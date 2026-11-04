# Development Best Practices

## Project layout

This is a single **Next.js 15** app (App Router) — not a monorepo. See
[`CLAUDE.md`](../../CLAUDE.md) for the full map. In short:

- [`app/`](../../app/) — routes, root layout, `globals.css`.
- [`components/sections/`](../../components/sections/) — page sections.
- [`components/ui/`](../../components/ui/) — shadcn/ui primitives.
- [`lib/`](../../lib/) — `constants.ts` (content/data), `utils.ts`,
  `theme-store.ts`, `hooks/`.

## Languages & Build

TypeScript + React (RSC). Follow the existing patterns and tooling already in
the repo. After changes, run `npm run lint` and `npm run build` before
considering the work done — `next build` is the type-check and the real
correctness gate (there is no separate test suite). Confirm UI changes in the
browser with `npm run dev`.

## Code Quality

- Follow existing patterns in the repository as the source of truth.
- Keep components focused — one section/primitive per file, matching the current
  structure.
- Prefer the conventions already established (file naming, the `@/` import alias,
  `cn()` for class merging) over introducing new ones.
- Put site content/data in [`lib/constants.ts`](../../lib/constants.ts), not
  inline in components, when it matches the existing pattern.

## UI & styling

- Build from the design system — Tailwind tokens and the `components/ui`
  primitives. Never inline a raw hex color or magic spacing value where a token
  exists. See the `design-system` skill.
- Reuse an existing `components/ui` primitive before creating a new component;
  extend it with a variant rather than forking a near-duplicate.
- Respect light/dark theming — colors come from the CSS variables / Tailwind
  semantic tokens, so both themes work from one definition.
- Keep the site responsive; verify layouts from narrow (~320px) to wide.

## Security

- Never hardcode secrets, API keys, or credentials — use environment variables.
- Validate and sanitize any user input (e.g. a contact form) before using it.
- Don't commit `.env*` files.

## Code Style

- Follow existing naming conventions in the codebase.
- Keep functions and components focused and single-purpose.
- Write self-documenting code with clear names.
- Add comments only when the logic is not self-evident.
