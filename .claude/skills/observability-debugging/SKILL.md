---
name: observability-debugging
description: >
  Debug code you didn't write and have no mental model of, by leaning on
  observability — structured logs, error trackers (Sentry), metrics, and traces
  — as your map, and by improving that observability so future failures are
  diagnosable. The quality of a fix is capped by the quality of the error
  context you can gather. Use when investigating a bug, error, crash, incident,
  or performance regression; when reading a stack trace / error report / log;
  when adding logging, tracing, or error reporting; or when building anything
  that must be debuggable later (e.g. an auto-fix worker whose input is an error
  report). Also use when asked "why did this fail?", "debug this", "what's this
  error?", "make this observable".
---

# Observability & debugging

You didn't write most of this code, so when it breaks you start with no mental
model. Observability is how you build one fast. And because an automated fixer's
output is only as good as the error context it's fed, improving observability is
itself a force multiplier: **fix quality is capped by context quality.**

## Debugging as evidence-gathering, not guessing

1. **Reproduce or capture.** Get a concrete failing case — a request ID, an
   input, a Sentry event. If you can't reproduce, gather enough telemetry until
   you can. A bug you can't trigger, you can't confirm fixed.
2. **Read the evidence before theorizing.** The stack trace, the surrounding log
   lines, the request/trace ID, the release version, the environment. Follow the
   trace ID across services. Most bugs are solved by *reading*, not guessing.
3. **Form one hypothesis and a cheap test for it.** "If it's a null user, this
   log line will show `user=null`." Change one thing at a time; revert what
   didn't help.
4. **Find the true cause, not the symptom.** A null-check that hides the null
   isn't a fix — trace *why* it was null. Then reproduce as a failing test
   ([[automated-verification]]) before fixing.
5. **Confirm the fix against the same evidence** that revealed the bug — the
   trace is clean, the error rate drops, the failing test passes.

## Using the tools you have

This project has MCP access to real telemetry — use it instead of speculating:
- **Sentry** — search issues/events for the error, read the stack trace,
  breadcrumbs, tags, affected releases, and frequency. Use Seer analysis for a
  first hypothesis, then verify it against the code yourself.
- **Structured logs / Cloudflare Workers observability** — query logs by
  fields (request id, user, route, status) to see the sequence that led to the
  failure.
- **Databases (postgres/mysql)** — inspect the actual data state a bug depends
  on rather than assuming the shape.
Reach for these first; a real event beats a plausible story.

## Make failures diagnosable (so next time is easier)

Every fix is a chance to improve the map. Aim for: given only the error report,
a person (or an auto-fix agent) can locate and understand the failure without
re-running anything.

- **Structured logs, not string soup.** Log events with fields
  (`event`, `request_id`, `user_id`, `duration_ms`, `status`) so they're
  queryable. One event per meaningful state change.
- **Log at boundaries** ([[architecture-boundaries]]): inbound request, outbound
  call, and the decision points between — with the correlation/trace id threaded
  through so a single request is followable end to end.
- **Errors carry context.** Capture the operation, the inputs that matter, and
  the cause chain — not just `"failed"`. Report to the error tracker with tags
  (release, environment, user segment) that make triage possible.
- **Right levels.** `error` = needs a human; `warn` = degraded but handled;
  `info` = milestone; `debug` = detail. Noise at `error` trains people to ignore it.
- **Never log secrets or PII.** Tokens, passwords, full card/SSN, raw request
  bodies with credentials — redact at the logging boundary.
- **Metrics for the things you'd page on** (error rate, latency p95, queue
  depth, saturation) so you see trouble before it's an incident.

## For an auto-fix worker specifically

The agent's fix is bounded by the error context you feed it. Give it: the full
stack trace, the failing input / request id, recent related log lines, the
release/commit, and links into the code. A one-line `"error: 500"` yields a
one-line guess; a rich, structured event yields a real fix. Invest in the
context pipeline before blaming the fixer.

## Anti-patterns

- Guessing and editing before reading the trace.
- "Fixing" the symptom (swallow the error, add a retry) without finding the cause.
- Adding a `console.log`, eyeballing once, and removing it — instead of leaving
  a structured, queryable event.
- Logging so much that the signal is buried, or so little that failures are
  invisible.
- Declaring it fixed without confirming against the evidence.
