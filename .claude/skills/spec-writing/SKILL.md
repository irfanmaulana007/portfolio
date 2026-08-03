---
name: spec-writing
description: >
  Turn a fuzzy idea into an unambiguous brief with explicit constraints and
  testable acceptance criteria BEFORE any code is written. This is the single
  biggest quality multiplier in AI-assisted development — most bad output is a
  bad prompt. Use when a request is vague, large, or ambiguous ("build X",
  "add a feature for Y", "make it better"), when scope or success is unclear,
  or when the user asks to "write a spec / PRD / brief / ticket". Also use
  proactively before starting any non-trivial implementation task.
---

# Spec writing

Your job is to convert a fuzzy idea into a brief precise enough that a
competent engineer (human or agent) who has never spoken to the requester could
build the right thing and *know when they were done*. If you can't tell whether
the result is correct, the spec isn't finished.

## When to stop and spec

Write a spec first when ANY of these is true:
- The request is one sentence but implies a day+ of work.
- Two reasonable engineers would build materially different things from it.
- There's no stated definition of "done."
- It touches data, money, auth, or anything hard to reverse.

For a genuine one-liner (rename a variable, fix an obvious typo), skip this —
don't ceremony-wrap trivial work.

## Process

1. **Extract the real goal.** Ask *why* before *what*. "Add a CSV export" →
   the goal might be "let finance reconcile numbers without asking us," which
   changes the columns, the format, and whether a scheduled email beats a button.
2. **Surface unknowns as explicit questions.** Batch them. Don't ask what you
   can reasonably decide yourself — pick a sensible default, state it, and move on.
   Ask only when the answer changes what you'd build and guessing is expensive.
3. **Write the brief** using the template below.
4. **Derive acceptance criteria from the goal**, not from the implementation.
5. **Read it back adversarially:** where could a smart implementer go wrong and
   still technically satisfy every line? Tighten those lines.

## The template

```markdown
# <Feature> — Brief

## Goal / why
One or two sentences. The user-visible or business outcome. Not the mechanism.

## Context
Where this lives, who uses it, what exists today, what it connects to.

## Scope
### In scope
- Bullet the concrete behaviors this delivers.
### Out of scope (explicitly)
- Bullet what a reader might assume is included but ISN'T. This section
  prevents scope creep and mis-sized work more than any other.

## Constraints
- Tech: languages, frameworks, versions, patterns to follow / avoid.
- Data: schemas, migrations, backward-compat, PII handling.
- Performance / limits: p95 latency, payload size, rate limits, N of rows.
- Security / auth: who can do this, what must be validated.
- Compatibility: existing APIs/contracts that must not break.

## Acceptance criteria
Testable, binary pass/fail statements. Prefer Given/When/Then.
- [ ] Given <state>, when <action>, then <observable result>.
- [ ] Error case: given <bad input>, then <specific handling>, not a 500.
- [ ] Edge: empty / max / concurrent / unauthorized behaves as <X>.

## Open questions
- Anything still genuinely undecided, with your recommended default.
```

## What separates a good spec from a bad one

- **Acceptance criteria are observable and binary.** "Fast" is not a criterion;
  "p95 < 200ms for 10k rows" is. "Handles errors gracefully" is not; "returns
  422 with field-level messages on validation failure" is.
- **The out-of-scope list is non-empty.** If you can't name something you're
  deliberately not doing, you haven't drawn a boundary.
- **Edge cases are enumerated, not implied.** Empty input, maximum input,
  concurrent access, unauthenticated access, partial failure, and the
  network-flaky retry are where AI output silently goes wrong. Name each one
  and its expected behavior.
- **Constraints reference reality.** Point at the actual file, table, or API
  contract the work must respect. See [[context-engineering]] for keeping those
  references accurate, and [[architecture-boundaries]] for sizing the blast radius.

## Anti-patterns

- Restating the request in fancier words and calling it a spec.
- Specifying the *implementation* ("use a hashmap") instead of the *behavior*.
- Acceptance criteria you can't actually test — hand them to
  [[automated-verification]] and if they can't be turned into a test, rewrite them.
- Asking the user a wall of questions you could have answered yourself. Decide,
  state the assumption, proceed.
