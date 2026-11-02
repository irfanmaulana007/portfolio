---
name: resolve-ai-review
description: Resolve the automated Claude Review (ai-review) on a pull request — read its findings (F1, F2, …), verify each against the code, fix the actionable ones on the PR branch following this repo's rules, push, and post ONE resolution comment that says what was fixed and why the rest isn't (pre-existing, by design, false-positive, separate concern). Use when asked to "resolve the AI review", "fix the review findings", "address Claude Review", or given a PR link with a Claude Review comment.
---

# Resolve the AI review on a PR

> **Canonical source:** [`irfanmaulana007/ai-review`](https://github.com/irfanmaulana007/ai-review/tree/main/.claude/skills/resolve-ai-review).
> Repos carry a copy — change it there and re-copy, don't edit copies in place.

The ai-review workflow posts one **"🤖 Claude Review — risk X/10"** comment per PR,
with findings `F1`, `F2`, … grouped by category (security, bugs, logic,
reliability, performance, clean code, code structure, file structure, testing),
each with a severity, location, explanation and 💡 suggestion. Every new commit
triggers a **re-review that edits that same comment** and marks each finding
✅ resolved / ⚠️ partial / still open.

This skill closes the loop: fix what's real, explain what isn't, push, and let
the re-review confirm it.

The review is **informational, not an approval gate.** Not every finding should
be fixed — but every finding gets an honest answer.

**Arguments:** a PR URL (`https://github.com/<owner>/<repo>/pull/<n>`) or a PR
number in the current repo.

## Ground rules

- **Never edit or delete the review comment**, and never edit comments by other
  people. The reviewer owns its comment; it updates it on the next push.
- **Follow this repository's rules**, not this skill's defaults, for everything
  repo-specific: read `CLAUDE.md` and `.claude/rules/` first (branch flow, commit
  and PR title format, test commands, "never push to X", PR-description format).
- **Verify every finding against the actual code before classifying it.** The
  reviewer can be wrong; so can a quick glance.
- **Be honest.** Don't call something a false-positive because it's inconvenient.
  If it's real but out of scope, say "separate concern" and why.
- **Stay in scope.** Fix what this PR introduced. Don't refactor the codebase to
  satisfy a finding about a pattern that's everywhere.

## Step 1 — Read the review

```bash
python3 .claude/skills/resolve-ai-review/scripts/fetch_review.py <PR URL or number> > /tmp/ai-review.json
```

It finds the review comment (the bot's when present, otherwise the latest manual
run) and returns structured JSON: `findings[]` (id, category, severity, title,
location, description, suggestion, owasp, status), `before_merging[]`,
`risk_score`, `reviewed_sha`, and `resolution_comment` (an earlier resolution
comment to **edit**, if one exists).

- Exit code 2 / `review_comment: null` → there's no review yet. Tell the user and stop.
- Skip findings whose `status` is `resolved` — the reviewer already confirmed them.
- `reviewed_sha` (bot comments): if the branch has moved past it, some findings may
  already be fixed — check before re-fixing.

## Step 2 — Get onto the PR branch and read the change

```bash
gh pr view <n> --json state,isDraft,headRefName,baseRefName,headRepositoryOwner
```

- **Stop if the PR is merged or closed** — never push to a merged branch.
- If the head branch is in a fork you can't push to, stop and tell the user.

```bash
git fetch origin <headRefName> <baseRefName>
git checkout -B <headRefName> origin/<headRefName>
git branch --show-current          # must be the PR branch, never a protected branch
git diff origin/<baseRefName>...HEAD --stat
```

Read the files each finding points at **and** their callers/tests — enough to
judge impact, not just the flagged line.

## Step 3 — Classify every finding

Pick exactly one per finding:

| Class | When | Action |
|---|---|---|
| **Fix** | Real problem introduced (or made worse) by this PR, fixable without scope creep | Fix it |
| **Pre-existing** | The pattern already exists in the codebase; this PR only touches nearby code or adds one more instance of a widespread pattern (≈10+ places) | Explain, don't fix |
| **By design** | Intentional per a requirement, AC, repo convention, or CLAUDE.md rule the reviewer couldn't know | Explain with the source |
| **False-positive** | The reviewer misread the code or its constraints (input is controlled, value is used elsewhere, path is unreachable…) | Explain concretely why |
| **Separate concern** | Real, but needs its own effort (cross-cutting refactor, client change in a test-only PR, infra) | Explain the scope; suggest a follow-up |

Defaults that are usually right:
- **critical/high security, data-integrity, and N+1/unbounded-query findings → Fix**, unless clearly false-positive.
- Findings tied to the "Before merging" list deserve extra care — that's the reviewer's blocker list.
- A low-severity nit that's a one-line, zero-risk fix → just fix it.
- Tokens/credentials in git-ignored local env files or CLI args are low risk in practice — usually not a fix, but say why.

If a finding is genuinely ambiguous (a product decision, not a code question),
ask the user before acting on it.

## Step 4 — Fix

For each **Fix**:
1. Make the smallest change at the root cause, following the existing patterns.
2. Add or update tests when the repo's testing rule requires it (it usually does
   for behaviour changes). A bug fix gets a test that fails without the fix.
3. Run the repo's checks for the parts you touched — the commands in `CLAUDE.md`
   (build, lint, typecheck, unit tests). Fix what you broke. Note anything you
   couldn't run (e.g. e2e that needs a live stack) for the resolution comment.

Commit — one commit per finding or per coherent group, using **this repo's commit
format**, mentioning the finding IDs, e.g.:

```
fix: address AI review F1, F6 — treat blank test data as missing
```

Push to the PR branch (never force-push unless the user asks):

```bash
git push origin HEAD:<headRefName>
```

The push triggers the re-review, which will mark the fixed findings ✅.

## Step 5 — Post (or update) the resolution comment

Exactly **one** resolution comment per PR. If `fetch_review.py` returned a
`resolution_comment` you authored, **edit it**; otherwise create it.

```bash
# create
gh api -X POST repos/<owner>/<repo>/issues/<n>/comments -F body=@/tmp/resolution.md
# or edit an existing one
gh api -X PATCH repos/<owner>/<repo>/issues/comments/<resolution_comment.id> -F body=@/tmp/resolution.md
```

The body **must start with the marker line** so the next run finds it:

```markdown
<!-- ai-review-resolution -->
## 🛠️ AI Review Resolution

Resolved against [Claude Review](<review comment url>) (risk **X/10**, N findings) · fixes pushed in <commit links>.

| ID | Finding | Severity | Resolution |
|----|---------|----------|------------|
| F1 | **<title>** | 🟠 medium (bug) | ✅ **Fixed** — <what changed and why> (<short sha>) |
| F2 | **<title>** | 🟡 low (clean code) | ➖ **Not addressed — pre-existing** — <where the pattern already lives> |
| F3 | **<title>** | 🟡 low (testing) | ➖ **Not addressed — by design** — <requirement / convention it follows> |
| F4 | **<title>** | 🟠 medium (reliability) | ➖ **Not addressed — false-positive** — <why the reviewer is wrong, concretely> |
| F5 | **<title>** | 🟡 low (code structure) | ➖ **Not addressed — separate concern** — <scope, and the follow-up> |

**Verification:** <commands run and their result; anything not runnable here>.

<sub>Re-review will update the Claude Review comment for the new commits.</sub>
```

Severity emoji: 🔴 critical/high · 🟠 medium · 🟡 low. Keep each Resolution to one
or two sentences; list every unresolved finding — none silently dropped.

## Step 6 — Report

Tell the user: how many findings fixed vs. not addressed (by reason), the commits
pushed, the resolution comment link, and anything they need to decide or run
themselves (e.g. e2e that needs a live stack).
