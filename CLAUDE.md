# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this project is

**Irfan Maulana — Frontend Developer Portfolio.** A single-page personal
portfolio site: hero, about, projects, skills, and contact sections, with a
light/dark theme toggle. Content is static (no backend, no database, no auth) —
project/skills data lives in [`lib/constants.ts`](lib/constants.ts). Deployed on
Vercel (`@vercel/analytics` + `@vercel/speed-insights`).

## Stack

- **Next.js 15** (App Router, RSC) + **React 19** + **TypeScript**.
- **Tailwind CSS 3** + **shadcn/ui** (`new-york` style, Radix primitives,
  CSS-variable theming) — see [`components.json`](components.json) and
  [`tailwind.config.js`](tailwind.config.js).
- **Framer Motion** for animation, **Zustand** for the theme store,
  **lucide-react** for icons.
- Dev server runs with Turbopack.

## Commands

```bash
npm run dev            # start dev server (Turbopack) at http://localhost:3000
npm run build          # production build — the real correctness gate
npm run lint           # next lint (ESLint + Prettier)
npm run format         # prettier --write .
npm run format:check   # prettier --check .
```

There is **no automated test suite** (no Vitest/Jest/Playwright). The build,
type-check (via `next build`/`tsc`), and lint are the machine-checked gates —
run them before considering work done. "Verification" here means lint + build
clean and the change confirmed in the running app in a browser.

## Layout (where things live)

- [`app/`](app/) — App Router entry: `layout.tsx` (root layout, theme provider,
  analytics), `page.tsx` (composes the sections), `globals.css` (Tailwind +
  CSS theme variables).
- [`components/sections/`](components/sections/) — the page sections
  (`hero`, `about`, `projects`, `skills`, `contact`). One section per file.
- [`components/ui/`](components/ui/) — shadcn/ui primitives (`button`, `card`,
  `input`, `sheet`, `avatar`, `text`, `theme-toggle`, …). Reuse these; don't
  fork a near-duplicate.
- [`components/`](components/) — shared chrome: `header`, `footer`,
  `theme-provider`.
- [`lib/`](lib/) — `constants.ts` (site content/data), `utils.ts` (`cn` helper),
  `theme-store.ts` (Zustand), `hooks/`.
- Path alias: `@/` → repo root (e.g. `@/components/ui/button`).

## Working rules (see [`.claude/rules/`](.claude/rules/))

- **Follow existing patterns** — the repo's conventions are the source of truth.
  Build UI from existing tokens and `components/ui` primitives; don't invent a
  new blue or a one-off button. See the `design-system` skill.
- **Design before code for big changes** — anything larger than a small,
  self-contained edit starts with a short written brief (goal, scope,
  acceptance criteria) before implementation. See the `spec-writing` skill.
- **Verify before done** — run `npm run lint` and `npm run build`, and confirm
  the change in the browser (`npm run dev`). Report what you actually ran.
- **Reproduce bugs first** — RED → fix root cause → GREEN. See
  [`bug-fixing.md`](.claude/rules/bug-fixing.md).
- **Git** — never push to `main`; branch first. Commit/PR titles:
  `[scope][type] Message`. See
  [`git-workflow.md`](.claude/rules/git-workflow.md) and
  [`pr-labeling.md`](.claude/rules/pr-labeling.md).
- **Security** — no hardcoded secrets (use env vars); never commit API keys.

Authoritative rules: [`.claude/rules/`](.claude/rules/)
(`development-best-practices.md`, `git-workflow.md`, `bug-fixing.md`,
`pr-labeling.md`). Reusable workflows: [`.claude/skills/`](.claude/skills/).
