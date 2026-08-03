---
name: architecture-boundaries
description: >
  Design and enforce clear module/package/service boundaries with explicit
  contracts, so any single change has a small, predictable blast radius — which
  is what makes parallel agent work (multiple worktree sessions) safe. Use when
  structuring a new codebase or feature, deciding where code should live,
  defining an interface/API/module contract, splitting or merging modules,
  reviewing whether a change leaks across boundaries, or planning work to be
  done by multiple agents in parallel. Also use when asked "where should this
  go?", "how should I structure this?", "will these two tasks conflict?".
---

# Architecture & boundaries

The goal is not architectural purity — it's **small blast radius**. A change
should be understandable and testable through one module's contract without
reading its neighbors, and two agents working two features should be able to
touch disjoint files. Clear boundaries are what make that true.

## The contract is the boundary

A module is defined by what it *promises*, not what it contains:

- **Public surface** — the functions/types/endpoints others may call. Everything
  else is private. Keep the surface small and stable.
- **Inputs & outputs** — explicit types at the boundary. Validate untrusted
  input *at* the boundary, then trust it inside.
- **Invariants & ownership** — what data this module owns and guarantees. No one
  else writes to it directly.
- **Errors** — the error types/shapes callers must handle, part of the contract.
- **Side effects** — I/O, mutations, and events it emits, named explicitly.

If you can't write the contract in a few lines, the boundary is in the wrong
place.

## Rules for keeping blast radius small

- **Depend on interfaces, not implementations.** Dependencies point inward /
  toward stable abstractions. A leaf module importing from a feature module is a
  smell.
- **No reaching across boundaries.** No importing another module's internals, no
  shared mutable globals, no reading another module's database tables directly.
  Cross-module communication goes through the public contract or events.
- **One reason to change.** If a module changes for two unrelated reasons, split
  it. If two modules always change together, the boundary between them is wrong.
- **Push shared code to a lower layer** (a `core`/`shared` with no feature
  dependencies) rather than sideways between features.
- **Make dependencies visible.** Prefer explicit injection over hidden imports
  and singletons, so a change's reach is legible.

## Designing for parallel / worktree work

Before splitting work across agents, check the boundaries make it safe:

1. **Partition by module, not by layer.** "Agent A does all the backend, Agent B
   all the frontend" collides on the contract between them. "Agent A owns
   module X end-to-end, Agent B owns module Y" does not.
2. **Freeze shared contracts first.** If two tasks touch the same interface,
   type, schema, or config, define that contract *before* forking the work and
   treat it as read-only during parallel work. Contract changes are a
   serialized, single-owner step. See [[spec-writing]] to pin each task's scope.
3. **Check for shared write targets.** Two agents editing the same file,
   migration, lockfile, or generated artifact will conflict. Assign each
   contested file a single owner, or sequence those edits.
4. **Give each task an independent verification path** so it can be validated in
   isolation — see [[automated-verification]].

Green flag: you can describe each parallel task as "owns files X, reads contract
Y, must not touch Z." Red flag: you can't say which files a task will touch.

## Warning signs the boundaries are wrong

- A one-line feature change forces edits in five modules.
- You must read three files to understand whether a change is safe.
- "Utils"/"helpers"/"common" grab-bags that everything imports and nothing owns.
- Circular dependencies between modules.
- Two agents' PRs keep conflicting in the same files.
- A module's tests need half the app stood up (the boundary leaks).

When you spot these, propose the re-partition explicitly and record the intended
architecture via [[context-engineering]] (an ADR) so the next session honors it.
