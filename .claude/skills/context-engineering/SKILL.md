---
name: context-engineering
description: >
  Create and maintain the project context that agents read before acting —
  CLAUDE.md, conventions docs, and ADRs (architecture decision records) — and
  keep it ACCURATE. Stale or wrong context is the top cause of "why did it do it
  that way?": an agent faithfully following an out-of-date doc produces
  confidently wrong work. Use when setting up or updating CLAUDE.md, writing
  conventions/onboarding docs, recording an architectural decision, noticing
  that docs and code disagree, or when a task reveals a convention worth
  capturing. Also use when asked "document how this works", "why do we do X?",
  "update the project context", "write an ADR".
---

# Context engineering

Agents don't carry a mental model between sessions — the written context *is*
their memory. Its value is entirely in its accuracy. A precise, current CLAUDE.md
makes every future session better; a stale one makes every future session
confidently wrong, because the agent will follow it faithfully off a cliff.

> The cardinal rule: **inaccurate context is worse than no context.** When code
> and a doc disagree, treat it as a bug and fix the doc in the same change.

## The three artifacts

**CLAUDE.md** — the always-loaded operating manual. Keep it short and true.
Include only what an agent needs *every* session and can't quickly derive:
- How to build, test, run, and lint (exact commands).
- Project layout and where things live (the map, not every file).
- Hard conventions and non-obvious constraints ("money is stored in cents",
  "never call the billing API from a request handler").
- Gotchas and footguns that have bitten people.
- Pointers to deeper docs and ADRs — don't inline them.
Cut anything the agent can learn faster by reading the code. Length is a cost:
every stale or low-value line dilutes the useful ones.

**Conventions docs** — the how-we-do-things reference: naming, error handling,
API shape, testing patterns, the design system ([[design-system]]) and module
contracts ([[architecture-boundaries]]). Referenced from CLAUDE.md, read on demand.

**ADRs** — one short file per significant decision, capturing *why*. This is the
antidote to "why did it do it that way?" — decisions have context that code
can't show. Template:
```markdown
# ADR-00X: <decision>
Date: <YYYY-MM-DD>   Status: accepted | superseded by ADR-00Y
## Context
The forces at play — constraints, requirements, what we knew then.
## Decision
What we chose, stated plainly.
## Consequences
What this makes easy, what it makes hard, what we're accepting.
## Alternatives considered
Options rejected and why — so no one re-litigates them blindly.
```

## Writing rules

- **Specific and imperative.** "Run `pnpm test:unit` before pushing," not "tests
  are important." Point at real files, commands, and tables.
- **Say why for anything non-obvious.** A rule without a reason gets "fixed"
  away by the next session.
- **Convert relative dates to absolute** ("as of 2026-07, we…"), because the doc
  outlives the moment.
- **One source of truth.** Don't restate the same fact in three docs — link.
  Duplicated facts drift apart.
- **Prune ruthlessly.** Delete or mark superseded anything no longer true. An
  ADR is never edited to lie about the past — mark it `superseded` and add a new one.

## Keep it accurate (the part everyone skips)

- When you change behavior, update the doc that describes it *in the same
  change*. Docs and code drift the instant they're allowed to.
- When a task surprises you ("oh, auth actually happens in the gateway"), that's
  a signal the context was missing or wrong — capture the correction.
- Periodically audit: pick a claim in CLAUDE.md and verify it against the code.
  A doc you can't trust is a doc no one reads.
- If you can't verify a statement is still true, don't assert it — flag it.

## Anti-patterns

- A 600-line CLAUDE.md that no one maintains and everyone half-ignores.
- Aspirational docs describing how you *wish* it worked.
- Decisions with no recorded rationale, re-argued every quarter.
- Copy-pasting the same convention into every subfolder instead of linking.
- Leaving a doc untouched "because the code change was small" — small changes
  cause the worst drift, because no one thinks to check the docs.
