---
name: resolve-sonarqube
description: Resolve a failing SonarCloud / SonarQube "Quality Gate" check on a pull request — read the failed gate conditions and the New-Code issues & security hotspots behind them, verify each against the code, fix the real ones on the PR branch following this repo's rules, push (SonarCloud re-analyzes automatically), and report what was fixed vs. what needs a reviewer decision or a token. Use when the "SonarCloud Code Analysis" / "SonarQube" PR check is red, or when asked to "fix the Sonar issues", "pass the quality gate", "resolve SonarCloud", "why did Sonar fail".
---

# Resolve a failing SonarQube quality gate on a PR

SonarCloud (hosted SonarQube) posts a **"SonarCloud Code Analysis"** check on each
PR. When it's red the title is **"Quality Gate failed"** and the check summary
lists the **failed conditions** (e.g. *"C Security Rating on New Code (required ≥ A)"*).
A PR gate evaluates **New Code only** — the lines this PR added or changed — so the
fix is almost always in the diff, not the whole codebase.

This skill closes the loop: find what failed, fix what's real in code, push (Sonar
re-analyzes the new commit automatically), and give an honest answer for anything
that can't be fixed in code.

**Arguments:** a PR URL (`https://github.com/<owner>/<repo>/pull/<n>`) or a PR
number in the current repo.

## Ground rules

- **Follow this repository's rules.** Read `CLAUDE.md` and `.claude/rules/` first
  (branch flow, commit/PR title format, the `lint`/`build` commands, "never push
  to `main`"). This skill's defaults never override the repo's.
- **Verify every issue against the actual code before acting.** Sonar is usually
  right about its rule, but whether it *matters here* is your call.
- **Prefer fixing in code over marking an issue away.** Only mark False-Positive /
  Won't-Fix when the rule genuinely doesn't apply — and say why, concretely.
- **Stay in scope.** Fix what this PR's New Code introduced. Don't refactor the
  whole repo to satisfy a rule that predates this PR (those aren't in New Code and
  won't be gating anyway).

## How the gate maps to work (read this first)

The quality gate is a set of **conditions on New Code**. What you do depends on
which condition failed:

| Failed condition | What it means | How to clear it |
|---|---|---|
| **Security Rating** (≥ A) | New code has ≥1 **Vulnerability** issue (one C/D/E issue sets the rating) | Fix the Vulnerability issue(s); the rating recomputes to A |
| **Reliability Rating** (≥ A) | New code has ≥1 **Bug** issue | Fix the Bug issue(s) |
| **Maintainability Rating** (≥ A) | New code has **Code Smell** issues over the debt ratio | Fix the smells (or the worst ones) |
| **Security Hotspots Reviewed** (= 100%) | New code has un-reviewed **hotspots** | Review each hotspot: fix if real, else mark **Safe** (needs a token) |
| **Coverage on New Code** (≥ N%) | New/changed lines aren't covered by tests | Add tests — **or**, if the repo has no test suite, this can't be met in code (see below) |
| **Duplicated Lines** (≤ N%) | New code duplicates existing code | Extract/refactor the duplication |
| **New Issues / violations** | Any new issue over the threshold | Fix or justify each issue |

> **Ratings are driven by the single worst issue.** A gate failing on "Security
> Rating = C" usually means **one** vulnerability — fix that one issue and the
> rating goes back to A. Don't over-read a letter grade; look at the issue list.

## Step 1 — Fetch the gate and the issues

```bash
python3 .claude/skills/resolve-sonarqube/scripts/fetch_issues.py <PR URL or number> > /tmp/sonar.json
```

It uses `gh` to find the Sonar check on the PR head, parses the `projectKey` from
the check URL, and returns JSON: `sonar.quality_gate` (status + each condition
with `status`/`actual`/`threshold`), `sonar.issues[]` (rule, type, severity,
`file:line`, message), and `sonar.hotspots[]`. It reads the public API
anonymously; set `SONAR_TOKEN` for a private project or to mark issues later
(Step 5). Exit 2 / `project_key: null` → no Sonar check on this PR yet; tell the
user and stop.

Open the links too when useful: the check summary and the project's PR view
(`…/project/issues?id=<key>&pullRequest=<n>&inNewCodePeriod=true`) show each issue
with its rule description and a suggested fix.

## Step 2 — Get onto the PR branch

```bash
gh pr view <n> --json state,isDraft,headRefName,baseRefName,headRepositoryOwner
```

- **Stop if the PR is merged or closed** — never push to a merged branch.
- If the head branch is a fork you can't push to, stop and tell the user.

```bash
git fetch origin <headRefName> <baseRefName>
git checkout -B <headRefName> origin/<headRefName>
git branch --show-current          # must be the PR branch, never a protected branch
```

## Step 3 — Classify every issue & hotspot

For each issue, read the flagged `file:line` (and the rule's intent — the message
usually states it) and pick exactly one:

| Class | When | Action |
|---|---|---|
| **Fix** | A real problem in this PR's new code, fixable without scope creep | Fix at the root cause |
| **False-positive** | The rule misreads this code (input is controlled, path unreachable, the construct is safe here) | Mark False-Positive in Sonar + explain (Step 5) |
| **Won't-fix / by design** | Real per the rule but intentional for this repo (a documented convention, a deliberate trade-off) | Mark Won't-Fix/Accept + explain the source |
| **Separate concern** | Real but pre-existing or cross-cutting, not introduced by this PR | Explain; it's typically not in New Code so it won't gate — don't expand scope |

Defaults that are usually right:
- **Vulnerability / Bug issues → Fix.** They drive the Security/Reliability gate
  and are nearly always worth a small, correct change.
- **Security hotspots → review each.** Fix if exploitable; otherwise mark **Safe**
  with a one-line justification. 100% reviewed is required to pass.
- A one-line, zero-risk Code Smell fix → just fix it.
- If an issue is genuinely a product/design judgment, ask the user before marking.

### Common GitHub-Actions-workflow rules (this repo has a `pr-review.yml`)
- **`githubactions:S7637` "Use full commit SHA for this dependency"** — pin a
  third-party action to an immutable 40-char commit SHA, not a mutable tag:
  `uses: owner/action@<full-sha> # v1`. Resolve the tag with
  `gh api repos/<owner>/<action>/git/refs/tags/<tag>` (dereference an annotated
  tag's `.object.sha` via `git/tags/<sha>`). GitHub-owned `actions/*` are usually
  not flagged.
- Script-injection rules — never interpolate `${{ github.event.* }}` untrusted
  text directly into a `run:` shell; pass it through `env:` and reference `"$VAR"`.

## Step 4 — Fix, verify, push

1. Make the smallest change at the root cause, following existing patterns.
2. Run the repo's checks for what you touched — the commands in `CLAUDE.md`
   (here: `npm run lint` and `npm run build`). Fix what you broke.
3. Commit using **this repo's commit format** (`[scope][type] …`), referencing the
   rule, e.g. `[ci][fix] Pin claude-code-action to a commit SHA (Sonar S7637)`.
4. Push to the PR branch (never force-push unless asked):
   ```bash
   git push origin HEAD:<headRefName>
   ```
   **SonarCloud re-analyzes automatically on the new commit** (this repo uses
   Automatic Analysis — there is no Sonar step in CI to re-trigger). Wait for the
   check to re-run, then re-run Step 1 to confirm the gate is green.

## Step 5 — Mark issues that are genuinely not code-fixable (needs a token)

Only for issues you classified False-Positive or Won't-Fix. Requires a
`SONAR_TOKEN` with **"Administer Issues"** on the project (ask the user if you
don't have one — don't guess credentials):

```bash
# False positive
curl -s -u "$SONAR_TOKEN:" -X POST "https://sonarcloud.io/api/issues/do_transition" \
  -d "issue=<issueKey>" -d "transition=falsepositive"
# Won't fix / accept (newer SonarCloud uses "accept")
curl -s -u "$SONAR_TOKEN:" -X POST "https://sonarcloud.io/api/issues/do_transition" \
  -d "issue=<issueKey>" -d "transition=wontfix"
# add a reason
curl -s -u "$SONAR_TOKEN:" -X POST "https://sonarcloud.io/api/issues/add_comment" \
  -d "issue=<issueKey>" -d "text=<why this is safe here>"
# resolve a reviewed hotspot as safe
curl -s -u "$SONAR_TOKEN:" -X POST "https://sonarcloud.io/api/hotspots/change_status" \
  -d "hotspot=<hotspotKey>" -d "status=REVIEWED" -d "resolution=SAFE" -d "comment=<why>"
```

After marking, the gate recomputes (ratings ignore False-Positive/Accepted issues).

### When the failing condition can't be met in code
If the gate fails on **Coverage on New Code** and the repo has **no test suite**
(as noted in `CLAUDE.md`), you cannot raise coverage by changing the PR's code.
Do **not** silently ignore it — report it and lay out the options for the user,
who owns the project:
- Add a test runner + tests for the new code (a real project change), or
- Adjust the project's **Quality Gate** (e.g. the New-Code definition or the
  coverage condition) in SonarCloud, or
- Accept the gate as non-blocking in branch protection.
State the trade-offs; let the user decide. The same applies to any condition that
is a project/policy decision rather than a code defect.

## Step 6 — Report

Tell the user: which gate conditions failed and why, what you fixed (with the
rule ids and commits), what you marked False-Positive/Won't-Fix and the reason,
anything that needs a `SONAR_TOKEN` or a project-owner decision (e.g. coverage
with no test suite), and the current gate status after the push.
