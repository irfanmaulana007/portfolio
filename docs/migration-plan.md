# Migration Plan

> Companion to [PRD.md](./PRD.md). Ordered steps to split the repo and migrate content
> without losing data. Each phase maps to the PRD's milestones (P0–P4).

## P0 — Repo restructure (isolated PR)

1. Add pnpm workspaces: root `package.json` (private, `workspaces`/`pnpm-workspace.yaml`),
   move to pnpm if not already.
2. Create `apps/frontend/` and **git-move** all current frontend files into it
   (`app/`, `components/`, `lib/`, `public/`, config files, `package.json`). Use
   `git mv` so history is preserved.
3. Update path aliases (`tsconfig.json` `@/*`), `next.config.ts`, Tailwind/PostCSS paths.
4. Add empty shells: `apps/backend/`, `apps/admin/`, `packages/shared-types/`.
5. Add `docs/` (this documentation set).
6. Verify: `pnpm --filter frontend build` succeeds; site runs unchanged.
7. **Merge before starting backend work** — keep the move reviewable on its own.

## P1 — Backend MVP

1. Scaffold Express + TypeScript in `apps/backend`; add Prisma + Postgres.
2. Author `schema.prisma` (see [data-model.md](./data-model.md)); run first migration.
3. Implement routes/controllers/services per [api-spec.md](./api-spec.md): public
   `GET /api/projects`, `POST /api/contact`; auth + admin CRUD; `/health`.
4. Add middleware: JWT auth, Zod validation, error envelope, CORS, rate limiting.
5. Write `seed.ts`:
   - upsert admin user from env,
   - copy the current `projects[]` from the old `lib/constants.ts` into the DB using the
     field mapping in [data-model.md](./data-model.md#field-mapping--current-projects--project).
6. Verify seeded project **count and fields** match the current site exactly.

## P2 — Frontend integration

1. Add `packages/shared-types` DTOs; consume in frontend.
2. `projects-section.tsx`: replace `import { projects }` with a server-side fetch of
   `GET /api/projects` (ISR). Preserve the `all` + category filter UX.
3. `contact-section.tsx`: replace the `mailto:` handler with `POST /api/contact`; add
   loading/success/error states + client validation. (Optional `mailto:` fallback.)
4. Trim `lib/constants.ts` to static-only config; add `NEXT_PUBLIC_API_BASE_URL`.
5. Verify: public projects list is visually identical to pre-migration; a test submission
   lands in the DB.

## P3 — Admin panel

1. Scaffold the admin app in `apps/admin` (own build + Dockerfile).
2. Login screen → JWT; attach bearer token to all requests.
3. Projects management (list, create, edit, delete, reorder, toggle featured/published).
4. Contact inbox (list, detail, mark read/archived) + light dashboard counts.
5. Verify end-to-end: create a project in admin → it appears on the public site after
   revalidation.

## P4 — Dokploy deployment

Follow [deployment.md](./deployment.md): provision Postgres, deploy backend (migrate +
seed), then frontend and admin, wire domains + env, confirm health checks.

## Cutover & rollback

- **Cutover:** once P2 is verified in staging, point production frontend at the API.
- **Rollback:** the pre-migration frontend (with hardcoded `constants.ts`) remains in git
  history; reverting the frontend data-source change restores the static site. The DB and
  backend can stay up independently.

## Data-integrity checklist

- [ ] Seeded project count == current `projects[]` length.
- [ ] Every project's `title`, `date`, `category`, `featured`, `tags`, URLs match source.
- [ ] Slugs are unique and stable.
- [ ] Contact `POST` persists and appears in admin inbox.
- [ ] No secrets committed; all env set in Dokploy.
