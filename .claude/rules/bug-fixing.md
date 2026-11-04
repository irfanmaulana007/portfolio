# Bug Fixing

**Reproduce first — every time.** Before touching product code for any bug fix,
you MUST reproduce the reported failure yourself, then fix the root cause, then
reproduce the *identical* scenario again to prove it's gone. A fix you cannot
prove reproduces-then-resolves is not a fix — never ship a change you are "not
sure is the right place."

The order is always: **reproduce the failure (RED) → fix the root cause →
reproduce the same case again (GREEN).** If you cannot reproduce the failure,
STOP — your diagnosis or your assumptions are wrong; do not proceed to a fix you
cannot prove.

Pick the reproduction that matches the bug's surface:

- **Running the app locally (the usual case for this frontend).** Start the dev
  server (`npm run dev`), navigate the exact path/interaction that triggers the
  bug, and capture the actual wrong behavior — a wrong render, a broken
  interaction, a console error, a layout break at a given width. Then fix, and
  re-run the identical steps to confirm it's gone. For a visual bug, compare
  before/after in the browser; use the browser automation tools to drive and
  screenshot the click-path when useful.
- **A pure-logic bug** (a util, a hook, a data transform in `lib/`) can be
  reproduced by exercising that function directly — the smallest surface that
  shows the wrong output — before fixing the root cause.

When fixing, make the **smallest change at the root cause**, not a special-case
guard that papers over the one reported input. If your instinct is a hardcoded
value or a narrow `if` for the exact reported case, the fix is probably in the
wrong place.

Verify the whole interaction end-to-end before calling it done — e.g. a form
that both accepts input *and* reflects it, a toggle that flips state *and*
persists it, a layout that works across the responsive range — not just the one
half you touched. Then run `npm run lint` and `npm run build`, and re-check a
neighboring case you might have shifted the bug into.

> This repo has no automated test suite, so the live browser reproduction *is*
> the proof. If a bug ever has a clean unit-testable surface and the project
> later adds a test runner, land a regression test too.
