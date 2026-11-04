# Git Workflow

## Commit Message Format

```
[scope][type] Message

# Examples:
[sections][feat] Add testimonials section
[ui][fix] Fix theme toggle flash on first paint
[content][docs] Update featured projects list
[config][chore] Bump Next.js to latest patch
```

### Scopes
- `app` — routing, root layout, `globals.css` (`app/`)
- `sections` — page sections (`components/sections/`)
- `ui` — shadcn/ui primitives (`components/ui/`)
- `components` — shared chrome (`header`, `footer`, `theme-provider`)
- `lib` — helpers, stores, hooks (`lib/`)
- `content` — site data/copy (`lib/constants.ts`)
- `config` — tooling/build config (eslint, prettier, tailwind, next, tsconfig)
- `docs` — README / documentation
- `claude` — `.claude/` rules, skills, settings

Combine when a change spans areas (e.g. `[sections][ui]`). Pick the scope that
best describes the change; don't overthink it for a small edit.

### Types
- `feat` — New feature or section
- `fix` — Bug fix
- `refactor` — Code refactoring
- `perf` — Performance improvement
- `style` — Visual/CSS-only change with no behavior change
- `docs` — Documentation
- `chore` — Maintenance, tooling, dependencies

## Important rules

1. **Never push directly to `main`** — always create a feature branch.
2. **Agents working in a worktree auto-open a PR to `main`** — when isolated in
   a worktree, commit the work, push the branch, and open a PR targeting `main`.
3. **Never commit to a merged PR branch** — if a PR is already merged, create a
   new branch from `main`. Verify the target PR is still open
   (`gh pr view <number> --json state`) before committing — pushing to a merged
   branch never reaches `main`.
4. **Always verify current branch before committing** — run
   `git branch --show-current`. If on `main`, stop and create a feature branch
   first.
5. **Open PRs as ready for review, not draft** — use plain `gh pr create`. If a
   PR was opened as draft, mark it ready with `gh pr ready <number>`.
