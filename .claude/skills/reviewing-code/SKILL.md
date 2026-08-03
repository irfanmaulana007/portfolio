---
name: reviewing-code
description: >
  Read and review code for correctness — specifically to catch plausible-but-wrong
  code that compiles, passes a glance, and still breaks: silent N+1 queries, wrong
  error handling, off-by-one and boundary bugs, race conditions, unhandled edge
  cases, and subtle contract violations. Use when reviewing a diff or PR, reading
  unfamiliar code to build a mental model, verifying AI-generated changes before
  merge, or when asked "review this", "is this correct?", "what could go wrong
  here?", "why is this slow?". This is a correctness-and-reading skill, not a
  style linter.
---

# Reviewing code

You will read far more code than you write. The valuable skill is not spotting
what's ugly — a linter does that — but spotting what's *plausible-but-wrong*:
code that looks right, passes the happy path, and fails in ways no one notices
until production.

## How to read a diff

1. **Reconstruct intent first.** What is this change *supposed* to do? If you
   can't state it in one sentence, you can't judge correctness. Check it against
   the spec / PR description; a diff that does something different from its
   description is a finding by itself.
2. **Trace the data, not the lines.** Follow each input from entry to storage to
   output. Where does it get validated, transformed, trusted? Untrusted input
   that reaches a query, a filesystem path, or a shell is the bug.
3. **Hunt the unhappy paths.** The happy path almost always works. Bugs live in
   errors, empties, boundaries, concurrency, and partial failure.
4. **Verify claims against the code**, not against how confident the author (or
   an AI) sounds. "Handles retries" — show me the backoff and the max attempts.

## The plausible-but-wrong checklist

**Data & queries**
- [ ] N+1: a query or network call inside a loop / `.map` / per-row render.
      Look for awaits inside iteration and ORM lazy-loads in a serializer.
- [ ] Missing index behind a new WHERE/ORDER BY/JOIN on a large table.
- [ ] Unbounded result set — no LIMIT / pagination on user-facing data.
- [ ] Reads outside a transaction that assume a consistent snapshot.

**Error handling**
- [ ] Swallowed errors: `catch {}`, `catch (e) { log(e) }` then continue as if
      it succeeded, or `.catch(() => null)` that hides the failure downstream.
- [ ] Wrong granularity: one try/catch around 40 lines, so a failure in step 2
      is reported as a failure in step 5.
- [ ] Error path leaves state half-written (no rollback / cleanup / compensating
      action). Partial success is often worse than clean failure.
- [ ] Errors mapped to the wrong status/type (validation → 500, not-found → 200).

**Boundaries & edge cases**
- [ ] Off-by-one: `<=` vs `<`, `length` vs `length-1`, inclusive/exclusive ranges.
- [ ] Empty collection, single element, and max-size behave correctly.
- [ ] Null/undefined/NaN/empty-string distinct from "absent" — and handled.
- [ ] Timezone / DST / epoch-vs-ISO / locale in any date or money math.
- [ ] Float money math (use integers/decimals), rounding direction, currency units.

**Concurrency & state**
- [ ] Read-modify-write without a lock or atomic op (lost updates, race).
- [ ] Shared mutable state across requests/goroutines/async tasks.
- [ ] Non-idempotent handler on a retried/at-least-once path (double charge,
      double send). Check webhooks and job queues specifically.
- [ ] `await` inside a loop that should be a bounded-concurrency batch.

**Contracts & security**
- [ ] Change to a shared function/type/API that a caller elsewhere relies on
      (grep the callers — don't assume the diff shows every use).
- [ ] Authorization checked at the route but not on the object (IDOR).
- [ ] User input reaching SQL / shell / path / HTML without parameterize/escape.
- [ ] Secrets, tokens, or PII in logs, error messages, or responses.
- [ ] Backward-incompatible schema/response change without versioning/migration.

## Reporting findings

Rank by severity (correctness/security > performance > maintainability). For
each real finding give: **where** (file:line), **what breaks** (a concrete
failing input → wrong output), and **the fix direction**. Concrete repro beats
adjectives — "crashes when `items` is empty because `items[0]` on line 12"
beats "doesn't handle edge cases."

Separate confidence levels: say "bug: …" only when you can name the failing
case; otherwise "worth checking: …". Don't drown a real bug in nitpicks — call
out style separately and briefly, or defer it to [[automated-verification]] and
a linter.

## When you can't be sure

If correctness depends on runtime behavior you can't see (data shape, call
volume, timing), say so and propose the test or trace that would settle it —
hand it to [[automated-verification]] or [[observability-debugging]] rather than
guessing.
