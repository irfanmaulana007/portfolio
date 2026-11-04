# PR Labeling

**Every pull request should carry exactly one label** describing what kind of
change it is. The label is derived directly from the PR title's type bracket, so
a well-formed title already tells you which label to apply. This keeps the PR
list clean, scannable, and filterable in the GitHub UI.

The scope (`app` / `sections` / `ui` / …) already lives in the title brackets,
so it does not need its own labels — keep this to a single, flat set.

## Labels

| Label | Title type bracket(s) | When |
|-------|----------------------|------|
| `Feature` | `feat` | New feature or section |
| `Improvement` | `refactor`, `perf`, `style` | Enhancement/refactor/visual tweak, no new feature |
| `Bug fix` | `fix` | Bug fix |
| `Chore` | `chore`, `ci` | Maintenance, tooling, CI, dependencies |
| `Documentation` | `docs` | Documentation only |

## Deriving the label from the title

PR titles follow `[scope][type] Description` (see
[`git-workflow.md`](git-workflow.md)). To pick the label:

1. **Take the type** — the **last** bracket before the description (ignore scope
   brackets like `[ui]`).
2. **Map it** to a label via the table above.

### Examples

| Title | Label |
|-------|-------|
| `[sections][feat] Add testimonials section` | `Feature` |
| `[ui][fix] Fix theme toggle flash` | `Bug fix` |
| `[sections][style] Tighten hero spacing on mobile` | `Improvement` |
| `[docs] Update README project list` | `Documentation` |
| `[config][chore] Bump Next.js` | `Chore` |

## Applying the label

When creating a PR, pass the derived label:

```bash
gh pr create --title "<title>" --body "<body>" --label "Feature"
```

If the label does not yet exist on the remote, create the set once, then retry
(never skip labeling, but don't let a missing label block the PR — create it or
omit it rather than failing):

```bash
gh label create "Feature"       --color "1D76DB" --description "New feature"            2>/dev/null
gh label create "Improvement"   --color "0E8A16" --description "Enhancement or refactor" 2>/dev/null
gh label create "Bug fix"       --color "D73A4A" --description "Bug fix"                 2>/dev/null
gh label create "Chore"         --color "FEF2C0" --description "Maintenance / tooling"   2>/dev/null
gh label create "Documentation" --color "0075CA" --description "Documentation only"      2>/dev/null
```

To label an existing PR: `gh pr edit <number> --add-label "Feature"`.
