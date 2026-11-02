#!/usr/bin/env python3
"""Fetch the ai-review comment on a PR and print its findings as JSON.

Usage:
    python3 fetch_review.py <PR URL | number> [--repo owner/repo]
    python3 fetch_review.py --from-file comment.md      # parse a saved comment body (tests)

Output (stdout, JSON):
    {
      "repo": "owner/repo", "pr": 88,
      "review_comment": {"id", "author", "url"} | null,
      "source": "state" | "markdown" | null,   # where findings came from
      "reviewed_sha": "<40 hex>" | null,       # last commit the reviewer saw (bot comments only)
      "risk_score": 4.8 | null,
      "before_merging": [...],
      "findings": [{"id", "category", "severity", "title", "location",
                    "description", "suggestion", "owasp", "status", "status_note"}],
      "resolution_comment": {"id", "author", "url"} | null   # earlier resolution to EDIT, not duplicate
    }

The reviewer posts exactly one comment per PR (see ai-review CLAUDE.md):
  - automated runs: authored by github-actions[bot], with hidden markers
    <!-- claude-review-summary sha=… --> and <!-- claude-review-state:<base64 JSON> -->
    → findings are read from the state (exact, structured);
  - manual runs: posted by a person, markers stripped
    → findings are parsed from the rendered markdown.

Standard library only; needs the `gh` CLI for API access.
"""
import argparse
import base64
import json
import re
import subprocess
import sys

BOT = "github-actions[bot]"
RESOLUTION_MARKER = "<!-- ai-review-resolution -->"
HEADER_RE = re.compile(r"^##\s+\S+\s+Claude Review\s+—\s+risk\s+\*\*([\d.]+)/10\*\*", re.M)

# Section headings rendered by the Publish step → category keys in review.json
SECTION_TO_CATEGORY = {
    "Security": "security", "Bugs": "bug", "Logic": "logic", "Reliability": "reliability",
    "Performance": "performance", "Clean Code": "clean_code", "Code Structure": "code_structure",
    "File Structure": "file_structure", "Testing": "testing",
}
# "- 🟠 **medium** · `F1` **Title** — `location` · _A01:2025 – …_ · _still open_<br>desc<br>💡 fix<br>🔁 note"
FINDING_RE = re.compile(
    r"^- \S+ \*\*(?P<severity>critical|high|medium|low)\*\* · `(?P<id>F\d+)` \*\*(?P<title>.+?)\*\*"
    r" — `(?P<location>[^`]*)`(?P<tags>(?: · _[^_]+_)*)<br>(?P<rest>.*)$"
)
RESOLVED_RE = re.compile(r"^- ~~`(?P<id>F\d+)` (?P<title>.+?)~~(?: — (?P<note>.*))?$")
STATUS_TAGS = {"still open": "open", "⚠️ partially fixed": "partial", "🆕 new": "new"}


def gh_json(path):
    out = subprocess.check_output(["gh", "api", "--paginate", "--slurp", path])
    return [item for page in json.loads(out) for item in page]


def current_repo():
    out = subprocess.check_output(["gh", "repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"], text=True)
    return out.strip()


def parse_target(target, repo):
    m = re.match(r"https?://github\.com/([^/]+/[^/]+)/pull/(\d+)", target)
    if m:
        return m.group(1), int(m.group(2))
    if target.lstrip("#").isdigit():
        return repo or current_repo(), int(target.lstrip("#"))
    raise SystemExit(f"error: not a PR URL or number: {target!r}")


def is_review_comment(c):
    body = c.get("body") or ""
    if c["user"]["login"] == BOT and "<!-- claude-review-summary" in body:
        return True
    return bool(HEADER_RE.search(body))


def parse_state(body):
    m = re.search(r"<!-- claude-review-state:([A-Za-z0-9+/=]+) -->", body)
    if not m:
        return None
    try:
        return json.loads(base64.b64decode(m.group(1)))
    except Exception:
        return None


def parse_markdown(body):
    """Rebuild findings from the rendered comment (manual runs have no state)."""
    findings, category = [], None
    before = []
    bm = re.search(r"^> \*\*Before merging:\*\* (.+)$", body, re.M)
    if bm:
        before = [s.strip() for s in re.split(r"\s*\d+\.\s+", bm.group(1)) if s.strip()]
    for line in body.splitlines():
        h = re.match(r"^### \S+\s+(.+?) \(\d+\)$", line)
        if h:
            title = h.group(1)
            category = SECTION_TO_CATEGORY.get(title, "resolved" if title.startswith("Resolved") else None)
            continue
        if category == "resolved":
            r = RESOLVED_RE.match(line)
            if r:
                findings.append({"id": r["id"], "category": None, "severity": None, "title": r["title"],
                                 "location": None, "description": "", "suggestion": "", "owasp": None,
                                 "status": "resolved", "status_note": r["note"] or ""})
            continue
        m = FINDING_RE.match(line)
        if not (m and category):
            continue
        tags = [t for t in re.findall(r" · _([^_]+)_", m["tags"])]
        status = next((STATUS_TAGS[t] for t in tags if t in STATUS_TAGS), "new")
        owasp = next((t for t in tags if re.match(r"A\d\d:\d{4}", t)), None)
        parts = m["rest"].split("<br>")
        desc = parts[0] if parts else ""
        sugg = next((p[2:].strip() for p in parts[1:] if p.startswith("💡")), "")
        note = next((p[2:].strip() for p in parts[1:] if p.startswith("🔁")), "")
        findings.append({"id": m["id"], "category": category, "severity": m["severity"], "title": m["title"],
                         "location": m["location"], "description": desc, "suggestion": sugg, "owasp": owasp,
                         "status": status, "status_note": note})
    return findings, before


def extract(body):
    """Return (source, reviewed_sha, risk, findings, before_merging) for a review comment body."""
    sha = re.search(r"<!-- claude-review-summary sha=([0-9a-f]{40}) -->", body)
    state = parse_state(body)
    risk = HEADER_RE.search(body)
    if state and isinstance(state.get("findings"), list):
        return ("state", sha.group(1) if sha else None, state.get("risk_score"),
                state["findings"], state.get("before_merging") or [])
    findings, before = parse_markdown(body)
    return ("markdown", sha.group(1) if sha else None, float(risk.group(1)) if risk else None, findings, before)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", nargs="?", help="PR URL or number")
    ap.add_argument("--repo", help="owner/repo (default: current repo)")
    ap.add_argument("--from-file", help="parse a saved review comment body instead of calling GitHub")
    a = ap.parse_args()

    if a.from_file:
        source, sha, risk, findings, before = extract(open(a.from_file, encoding="utf-8").read())
        print(json.dumps({"source": source, "reviewed_sha": sha, "risk_score": risk,
                          "before_merging": before, "findings": findings}, indent=2, ensure_ascii=False))
        return
    if not a.target:
        ap.error("target is required unless --from-file is given")

    repo, pr = parse_target(a.target, a.repo)
    comments = gh_json(f"repos/{repo}/issues/{pr}/comments")
    reviews = [c for c in comments if is_review_comment(c)]
    # Prefer the bot's comment (it's the one re-reviews edit); otherwise the latest manual one.
    review = next((c for c in reversed(reviews) if c["user"]["login"] == BOT), reviews[-1] if reviews else None)
    resolution = next((c for c in reversed(comments) if RESOLUTION_MARKER in (c.get("body") or "")), None)

    result = {"repo": repo, "pr": pr, "review_comment": None, "source": None, "reviewed_sha": None,
              "risk_score": None, "before_merging": [], "findings": [], "resolution_comment": None}
    if review:
        source, sha, risk, findings, before = extract(review["body"])
        result.update(review_comment={"id": review["id"], "author": review["user"]["login"], "url": review["html_url"]},
                      source=source, reviewed_sha=sha, risk_score=risk, findings=findings, before_merging=before)
    if resolution:
        result["resolution_comment"] = {"id": resolution["id"], "author": resolution["user"]["login"],
                                        "url": resolution["html_url"]}
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if not review:
        print(f"no ai-review comment found on {repo}#{pr}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
