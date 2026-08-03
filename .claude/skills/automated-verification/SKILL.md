---
name: automated-verification
description: >
  Make the test suite your reviewer. Establish and use layered automated
  verification — static types, unit/contract tests, integration and E2E — so
  correctness is machine-checked and you don't have to eyeball every generated
  diff across many projects. Use when writing or requesting tests, deciding what
  to test and at which layer, setting up CI checks, turning acceptance criteria
  into executable checks, verifying a change is actually correct, or reproducing
  a bug as a failing test first. Also use when asked "add tests", "how do I test
  this?", "is this covered?", "prove it works".
---

# Automated verification

When you generate code across several projects, you cannot read every diff
carefully. The verification suite becomes your reviewer: if a change is correct,
the suite stays green; if it isn't, the suite catches it before you do. Invest
accordingly — a fast, trustworthy suite is worth more than a large one.

## The layers (use the cheapest that can catch the bug)

1. **Static types & lint** — free, run on every keystroke. Make illegal states
   unrepresentable at the type level; a bug the compiler catches never needs a
   test. Prefer precise types over `any`/`interface{}`/`Object`.
2. **Unit tests** — pure logic, branches, and especially edge cases. Fast,
   deterministic, no I/O. This is where boundary/empty/error cases from
   [[reviewing-code]] get pinned down.
3. **Contract tests** — verify a module honors its published contract (see
   [[architecture-boundaries]]): input validation, output shape, error types,
   invariants. These are what let you trust a module in isolation and refactor
   its internals freely — and what let parallel agents rely on each other's
   modules.
4. **Integration tests** — real boundaries wired together (DB, queue, HTTP) with
   real serialization. Catches the bugs unit tests mock away.
5. **E2E** — a few high-value user journeys through the running system. Slow and
   flakier; keep them few and critical (login, checkout, the money path).

Aim for a wide base of fast unit/type checks and a thin tip of E2E.

## From acceptance criteria to checks

Every acceptance criterion from [[spec-writing]] should map to at least one
automated check. If a criterion can't be expressed as a test, it was too vague —
send it back and sharpen it. Translate Given/When/Then directly:

```
Given <state>  → arrange (fixtures/mocks/seed)
When <action>  → act (call the unit under test)
Then <result>  → assert (observable output, not internals)
```

## What makes a test worth keeping

- **Tests behavior, not implementation.** Assert on outputs and observable
  effects, not private calls. A refactor that keeps behavior must keep tests green.
- **Deterministic.** No real clock, network, randomness, or ordering
  assumptions. Inject them. A flaky test is worse than no test — it trains you
  to ignore red.
- **One reason to fail.** A focused assertion tells you *what* broke.
- **Fast enough to run constantly.** Slow suites get skipped, and a skipped
  reviewer reviews nothing.
- **Covers the unhappy path.** Error handling, empty/max input, unauthorized
  access, and concurrency — the places AI code fails silently. Coverage of only
  the happy path is a false sense of safety.

## Bug-fix discipline

Reproduce before you fix: **write a failing test that captures the bug, watch it
fail, then fix until it passes.** This proves you found the real cause and locks
the regression out forever. A fix without a test is a guess.

## Before declaring done

Run the suite and report what actually happened — command, pass/fail counts,
and any skips. Don't claim green without running it. If you added behavior and
the suite didn't change, ask what's untested. State results plainly; if tests
fail, say so with the output. See [[observability-debugging]] when a failure's
cause isn't visible from the assertion alone.
