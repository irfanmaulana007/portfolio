---
name: pull-request-writing
description: >
  Write a pull request description that a reviewer can approve without asking
  "why?" — stating what the PR does, WHY it's needed, the root cause (for fixes),
  a before/after comparison, and what's affected (blast radius, migrations,
  rollout, risk). Use whenever opening or updating a PR, writing a PR body or
  merge/commit description, or when asked to "write the PR", "describe this
  change", "what should the PR say". Also use proactively right before
  `gh pr create` / pushing a branch for review.
---

# Pull request writing

A PR description exists so a reviewer can decide **should this merge?** without
reverse-engineering it from the diff. The diff shows *what changed*; your job is
everything the diff can't tell them: *why*, *what it replaces*, *what it touches*,
and *how they'd know it's wrong*. If a reviewer has to ask "why?" or "what does
this affect?", the description failed.

## Before you write

Gather these from the actual change — never invent them:

1. **The trigger.** What made this necessary? A bug, a ticket, a slow query, a
   user request, a refactor unblocking later work. Link it.
2. **The root cause** (for fixes). Not the symptom — the underlying reason. "The
   list was empty" is a symptom; "the query filtered on `deleted_at` but the
   index didn't cover it, so Postgres did a seq scan and timed out" is a cause.
3. **The before/after delta.** What was the observable behavior before, and what
   is it now? Numbers if you have them (latency, error rate, bundle size, rows).
4. **The blast radius.** Read your own diff and ask what depends on each touched
   surface — callers, schemas, configs, public APIs, other teams. See
   [[architecture-boundaries]] for reasoning about how far a change reaches.
5. **How it was verified.** Tests added, manual steps, screenshots.

## The template

```markdown
## What
One or two sentences: what this PR does, in plain language. A reviewer reading
only this line should know what they're about to look at.

## Why
The problem or goal this solves, and why it matters now. Link the ticket / issue
/ incident. State the user-visible or business impact — not the mechanism.

## Root cause (for bug fixes)
The actual underlying reason the bug happened — traced to a specific line,
query, config, or assumption. Distinguish it from the symptom. If a class of
bugs shares this cause, say so.

## Before / after
| | Before | After |
|---|---|---|
| Behavior | what a user/caller saw | what they see now |
| Metric (if any) | 2.4s p95, 3% errors | 180ms p95, 0 errors |

For UI, attach before/after screenshots or a short clip.

## What's affected
- **Surfaces touched:** files/modules/endpoints and who calls them.
- **Data / migrations:** schema changes, backfills, backward-compat.
- **Config / infra / env:** new vars, flags, secrets, deploy order.
- **Consumers:** other services, teams, or clients that depend on this.
- **Breaking?** Explicitly yes/no. If yes, the migration path.

## How to test / verify
- Tests added or updated (name them).
- Manual repro steps a reviewer can run.
- What you checked that isn't obvious from the diff.

## Risk & rollout
Risk level and why. Feature-flagged? Reversible? Rollback plan. Anything to
watch after deploy (a dashboard, an error rate).

## Notes / follow-ups
Deliberate omissions, known trade-offs, and what's intentionally left for a
later PR (prevents "why didn't you also…" review comments).
```

## Scale it to the change

Not every PR needs every section — an honest small PR with ceremony reads as
noise. Match the depth to the change:

- **Trivial** (typo, copy tweak, dependency bump): **What** + **Why** in two
  lines. Stop.
- **Bug fix:** lead with **Root cause** and **Before/after** — that's what the
  reviewer is checking. Skip sections that don't apply.
- **Feature / refactor:** **What/Why/What's-affected/How-to-test** are the core.
- **Migration, breaking change, or anything touching data/auth/money:** every
  section, and **Risk & rollout** is mandatory, not optional.

Drop a section when it's genuinely empty — but "Breaking? No" and "Risk: low,
fully reversible" are one line each and worth stating explicitly. Silence reads
as "didn't think about it."

## What separates a good PR description from a bad one

- **Why before what.** The single most common failure is a PR that describes the
  diff back to the reviewer ("changes the `fetchUser` function") and never says
  why. If your **Why** could be deleted without losing information, it's missing.
- **Root cause is specific and falsifiable.** It points at a line, a query, a
  race, a wrong assumption — something a reviewer can confirm. "Fixed the bug" is
  not a root cause.
- **Before/after is observable.** Concrete behavior or a number, not "it's better
  now." If you claim a perf win, show the measurement.
- **Blast radius is named, not implied.** List what depends on what you touched.
  A reviewer's biggest fear is the unlisted caller that breaks in production.
- **Verification is reproducible.** A reviewer can re-run your check. Pair this
  with [[reviewing-code]] — write the description that answers the questions a
  careful reviewer would ask.

## Anti-patterns

- **Restating the diff in prose.** The reviewer can read the diff; tell them what
  it doesn't show.
- **"Various fixes and improvements."** A title/body with no information. Each PR
  is one coherent change with one reason.
- **Symptom as root cause.** "List was empty" → keep asking *why* until you hit
  something you can fix so it never recurs.
- **Hiding the breaking change** three files deep in the diff instead of calling
  it out up top with a migration path.
- **Empty verification.** "Tested locally" with no steps. Say what you ran and
  what you observed.
- **A 5-paragraph essay for a one-line change.** Ceremony is a cost too.
