#!/usr/bin/env python3
"""Fetch the SonarCloud/SonarQube quality-gate result + issues for a PR as JSON.

Usage:
    python3 fetch_issues.py <PR URL | number> [--repo owner/repo]
                            [--project <projectKey>] [--host https://sonarcloud.io]

Auth (optional): set SONAR_TOKEN for private projects or to mark issues later.
    export SONAR_TOKEN=xxxxxxxx
Public projects are readable anonymously; without a token you can read the gate
and issues but cannot mark issues False-Positive/Won't-Fix (that needs a token).

How it works:
  1. `gh` gives the PR head SHA and branch info.
  2. The "SonarCloud/SonarQube" check-run on that SHA carries the Sonar projectKey
     and PR number in its details_url (…?id=<projectKey>&pullRequest=<n>) — parsed
     here so you don't have to hardcode the key. Override with --project if absent.
  3. The Sonar web API returns the quality gate and the New-Code issues/hotspots.

Output (stdout, JSON):
    {
      "repo","pr","head_sha","base_ref","head_ref","state","is_draft",
      "sonar": {"host","project_key","pr","check": {"name","conclusion","url"},
                "quality_gate": {"status","conditions":[{metric,status,actual,threshold,comparator}]},
                "issues": [{key,rule,type,severity,component,file,line,message,effort,status}],
                "hotspots": [{key,ruleKey,securityCategory,vulnerabilityProbability,component,file,line,message,status}],
                "auth": "token" | "anonymous", "errors": [..]}
    }
    Exit 2 if no Sonar check-run is found on the PR head.

Standard library only; needs the `gh` CLI for GitHub access.
"""
import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

# Metric keys Sonar reports on PRs → human labels for the report.
METRIC_LABELS = {
    "new_security_rating": "Security Rating on New Code",
    "new_reliability_rating": "Reliability Rating on New Code",
    "new_maintainability_rating": "Maintainability Rating on New Code",
    "new_coverage": "Coverage on New Code",
    "new_duplicated_lines_density": "Duplicated Lines on New Code",
    "new_security_hotspots_reviewed": "Security Hotspots Reviewed on New Code",
    "new_violations": "New Issues",
}
RATING = {"1": "A", "2": "B", "3": "C", "4": "D", "5": "E"}


def gh_json(path, paginate=False):
    cmd = ["gh", "api"]
    if paginate:
        cmd += ["--paginate", "--slurp"]
    cmd.append(path)
    out = subprocess.check_output(cmd)
    data = json.loads(out)
    return [x for page in data for x in page] if paginate else data


def current_repo():
    return subprocess.check_output(
        ["gh", "repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"], text=True
    ).strip()


def parse_target(target, repo):
    m = re.match(r"https?://github\.com/([^/]+/[^/]+)/pull/(\d+)", target)
    if m:
        return m.group(1), int(m.group(2))
    if target.lstrip("#").isdigit():
        return repo or current_repo(), int(target.lstrip("#"))
    raise SystemExit(f"error: not a PR URL or number: {target!r}")


def find_sonar_check(repo, sha):
    runs = gh_json(f"repos/{repo}/commits/{sha}/check-runs").get("check_runs", [])
    for c in runs:
        if re.search(r"sonar", c.get("name", ""), re.I):
            return c
    return None


def parse_details_url(url):
    """…/dashboard?id=<projectKey>&pullRequest=<n> → (projectKey, host, pr)."""
    if not url:
        return None, None, None
    u = urllib.parse.urlparse(url)
    q = urllib.parse.parse_qs(u.query)
    host = f"{u.scheme}://{u.netloc}" if u.netloc else None
    return (q.get("id", [None])[0], host, q.get("pullRequest", [None])[0])


def sonar_get(host, path, params, token):
    qs = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{host}/api/{path}?{qs}")
    if token:
        # SonarCloud accepts the token as HTTP basic-auth username (empty password).
        req.add_header("Authorization", "Basic " + base64.b64encode(f"{token}:".encode()).decode())
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", help="PR URL or number")
    ap.add_argument("--repo", help="owner/repo (default: current repo)")
    ap.add_argument("--project", help="Sonar projectKey (default: parsed from the check URL)")
    ap.add_argument("--host", help="Sonar host (default: parsed from the check URL or sonarcloud.io)")
    a = ap.parse_args()

    token = os.environ.get("SONAR_TOKEN") or os.environ.get("SONARQUBE_TOKEN")
    repo, pr = parse_target(a.target, a.repo)
    pull = gh_json(f"repos/{repo}/pulls/{pr}")
    head_sha = pull["head"]["sha"]

    check = find_sonar_check(repo, head_sha)
    key, host, pr_param = (a.project, a.host, str(pr))
    if check:
        k, h, p = parse_details_url(check.get("details_url"))
        key = key or k
        host = host or h
        pr_param = p or pr_param
    host = host or os.environ.get("SONAR_HOST_URL") or "https://sonarcloud.io"

    result = {
        "repo": repo, "pr": pr, "head_sha": head_sha,
        "base_ref": pull["base"]["ref"], "head_ref": pull["head"]["ref"],
        "state": pull["state"], "is_draft": pull.get("draft", False),
        "sonar": {"host": host, "project_key": key, "pr": pr_param,
                  "check": None, "quality_gate": None, "issues": [], "hotspots": [],
                  "auth": "token" if token else "anonymous", "errors": []},
    }
    s = result["sonar"]
    if check:
        s["check"] = {"name": check.get("name"), "conclusion": check.get("conclusion"),
                      "url": check.get("details_url")}
    if not key:
        print(json.dumps(result, indent=2, ensure_ascii=False))
        print("error: could not determine Sonar projectKey (no Sonar check on PR head); pass --project", file=sys.stderr)
        sys.exit(2)

    # Quality gate
    try:
        qg = sonar_get(host, "qualitygates/project_status",
                       {"projectKey": key, "pullRequest": pr_param}, token)["projectStatus"]
        conds = []
        for c in qg.get("conditions", []):
            mk = c["metricKey"]
            actual = c.get("actualValue")
            if mk.endswith("_rating") and actual in RATING:
                actual = RATING[actual]
            conds.append({"metric": mk, "label": METRIC_LABELS.get(mk, mk), "status": c["status"],
                          "actual": actual, "comparator": c.get("comparator"),
                          "threshold": c.get("errorThreshold")})
        s["quality_gate"] = {"status": qg.get("status"), "conditions": conds}
    except (urllib.error.HTTPError, urllib.error.URLError, KeyError) as e:
        s["errors"].append(f"quality_gate: {e}")

    # Issues (unresolved, New Code)
    try:
        page, issues = 1, []
        while True:
            d = sonar_get(host, "issues/search",
                          {"componentKeys": key, "pullRequest": pr_param, "resolved": "false",
                           "inNewCodePeriod": "true", "ps": 500, "p": page}, token)
            for i in d.get("issues", []):
                comp = i.get("component", "")
                issues.append({"key": i.get("key"), "rule": i.get("rule"), "type": i.get("type"),
                               "severity": i.get("severity"), "component": comp,
                               "file": comp.split(":", 1)[1] if ":" in comp else comp,
                               "line": i.get("line"), "message": i.get("message"),
                               "effort": i.get("effort"), "status": i.get("status")})
            if page * 500 >= d.get("total", 0) or not d.get("issues"):
                break
            page += 1
        s["issues"] = issues
    except (urllib.error.HTTPError, urllib.error.URLError) as e:
        s["errors"].append(f"issues: {e}")

    # Security hotspots to review
    try:
        d = sonar_get(host, "hotspots/search",
                      {"projectKey": key, "pullRequest": pr_param, "status": "TO_REVIEW", "ps": 500}, token)
        for h in d.get("hotspots", []):
            comp = h.get("component", "")
            s["hotspots"].append({"key": h.get("key"), "ruleKey": h.get("ruleKey"),
                                  "securityCategory": h.get("securityCategory"),
                                  "vulnerabilityProbability": h.get("vulnerabilityProbability"),
                                  "component": comp,
                                  "file": comp.split(":", 1)[1] if ":" in comp else comp,
                                  "line": h.get("line"), "message": h.get("message"),
                                  "status": h.get("status")})
    except (urllib.error.HTTPError, urllib.error.URLError) as e:
        s["errors"].append(f"hotspots: {e}")

    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
