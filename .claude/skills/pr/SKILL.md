---
name: pr
description: Create a pull request to the main branch with a detailed, structured description (summary, changes, test plan), auto-creating a feature branch off main when the working tree is on main, and following the project's git workflow. Use when the user asks to open or create a PR for the current changes.
---

# Create Pull Request

Create a pull request to the `main` branch with a detailed description, following
[`.claude/rules/git-workflow.md`](../../rules/git-workflow.md) and
[`.claude/rules/pr-labeling.md`](../../rules/pr-labeling.md).

## Instructions

1. Check the current branch:
   ```bash
   git branch --show-current
   ```

2. If on `main`:
   - Pull the latest main: `git pull origin main`
   - Check `git status` and `git log --oneline -5` to understand the state.
   - If there are staged/unstaged changes or unpushed commits, **auto-create a
     feature branch**: derive a name from the change
     (`feat/short-description`, `fix/short-description`), run
     `git checkout -b <branch-name>`, and continue.
   - If the tree is clean with no unpushed commits, tell the user there's nothing
     to open a PR for.

3. Get the commits included (since diverging from main):
   ```bash
   git log main..HEAD --oneline
   ```

4. Get the full diff and the changed files:
   ```bash
   git diff main...HEAD
   git diff main...HEAD --name-only
   ```

   Map changed paths to scope brackets (see `git-workflow.md`):
   - `app/` → `[app]`
   - `components/sections/` → `[sections]`
   - `components/ui/` → `[ui]`
   - other `components/` → `[components]`
   - `lib/` → `[lib]` (or `[content]` if it's just `lib/constants.ts` data/copy)
   - config files (eslint/prettier/tailwind/next/tsconfig) → `[config]`
   - `README.md` / docs → `[docs]`
   - `.claude/` → `[claude]`

   Include every scope that has changes (e.g. `[sections][ui]`).

5. Analyze ALL commits and the full diff, then generate a well-structured PR
   description. See the `pull-request-writing` skill for how to write a body a
   reviewer can approve without asking "why?" — scale the depth to the change.

   **Title:** `[scope][type] Description`
   - **Scope**: from the folders changed (above); combine multiple.
   - **Type**: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `chore`.
   - Examples:
     - `[sections][feat] Add testimonials section`
     - `[ui][fix] Fix theme toggle flash on first paint`
     - `[content][docs] Update featured projects`

   **Summary** — 2–4 bullets on the high-level purpose (what + why), action verbs.

   **Changes** — grouped by file/area: `` **`path/to/file.tsx`**: what changed ``.

   **Test Plan** — since there's no automated suite, give concrete manual steps:
   what to run (`npm run dev`), what to click/view, and the expected result.
   Always include `npm run lint` and `npm run build` pass. For UI changes, note
   that before/after screenshots should be attached and both light and dark
   themes + the responsive range were checked.

6. Show the user the generated title and description.

7. Push and create the PR:
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "<title>" --body "<body>" --label "<label>"
   ```
   Derive the single `--label` from the title's **type** bracket (see
   `pr-labeling.md`): `feat`→`Feature`; `refactor`/`perf`/`style`→`Improvement`;
   `fix`→`Bug fix`; `chore`/`ci`→`Chore`; `docs`→`Documentation`. If the label
   doesn't exist on the remote, create it (per `pr-labeling.md`) or omit it
   rather than failing the PR. Open PRs **ready for review**, not draft.

## PR Description Template

```markdown
## Summary
- [High-level description of what this PR achieves]
- [Another key change or improvement]
- [Why this change was needed — the motivation]

## Changes
- **`path/to/file1.tsx`**: [Specific description of changes]
- **`path/to/file2.ts`**: [What was added/modified/removed]

## Test Plan
- [ ] `npm run lint` and `npm run build` pass
- [ ] Run `npm run dev` and verify [the specific flow/section]
- [ ] UI looks correct in both light and dark themes
- [ ] Layout holds across the responsive range (~320px → wide)
- [ ] [Screenshots attached for UI changes]

---
Generated with [Claude Code](https://claude.ai/code)
```

## Notes
- Always target `main`; never commit on `main` or push to it directly.
- Review ALL commits, not just the latest — the description covers the whole
  changeset.
- Be specific with file paths and component names.
- Call out breaking changes or removed content prominently at the top.
- Keep descriptions scannable — bold, code blocks, tables where they help.
