# PRD — Portfolio Platform: Frontend + Backend + Admin

| | |
|---|---|
| **Status** | Draft |
| **Author** | Irfan Maulana |
| **Created** | 2026-08-03 |
| **Owner** | Irfan Maulana |
| **Related docs** | [Architecture](./architecture.md) · [Data Model](./data-model.md) · [API Spec](./api-spec.md) · [Deployment (Dokploy)](./deployment.md) · [Migration Plan](./migration-plan.md) |

---

## 1. Summary

Today the portfolio is a single Next.js application. All content — projects, skills,
personal info, social links — is hardcoded in `lib/constants.ts`, and the contact form
only opens a `mailto:` link (nothing is stored). Every content change requires a code
edit and a redeploy.

This PRD proposes splitting the repository into a **monorepo with three independently
deployable services**:

1. **Frontend** — the existing public portfolio site (Next.js), refactored to fetch
   content from the backend API instead of hardcoded constants.
2. **Backend** — a new Express + Prisma + PostgreSQL API that owns all dynamic content
   (projects, contact submissions, and other admin-managed data) and exposes it via a
   REST API.
3. **Admin** — a new, standalone admin panel (its own web app) where the owner logs in
   to manage projects and read contact submissions.

Each service is deployed as a **separate Dokploy application**, with the database
provisioned as a Dokploy PostgreSQL service.

## 2. Goals

- **G1** — Manage portfolio **projects dynamically** (create, edit, reorder, feature,
  publish/unpublish, delete) from an admin UI, with no code change or redeploy.
- **G2** — **Persist contact form submissions** to the database and let the owner read
  them in the admin panel (replacing the current `mailto:` behavior).
- **G3** — Restructure the repo into a **pnpm-workspaces monorepo** with clean
  boundaries between `apps/frontend`, `apps/backend`, `apps/admin`, and shared packages.
- **G4** — Deploy the three services **separately on Dokploy**, each with its own build,
  domain, and environment, backed by a managed PostgreSQL instance.
- **G5** — Add a **`docs/` directory** as the home for product and engineering
  documentation (this PRD and its companions).

## 3. Non-Goals

- Multi-tenant / multi-user CMS. The admin panel serves **one owner** (single admin
  account); no public user accounts or roles beyond `admin`.
- A visual page builder or arbitrary CMS. Only the modeled entities below are editable.
- Rewriting the public site's design or UX. The frontend's look and behavior stay the
  same; only its **data source** changes.
- Analytics dashboards, A/B testing, or email-campaign features.
- Migrating away from the current frontend framework (Next.js is retained).

## 4. Current State (as-is)

| Concern | Today |
|---|---|
| Projects | Hardcoded array in `lib/constants.ts` (`projects[]`) |
| Project fields | `id, title, description, image, tags[], demoUrl, codeUrl, date, previewImageUrl[], category, featured` |
| Categories | `ProjectCategory` enum: `landing_page`, `dashboard`, `game` (frontend also has `all` filter) |
| Contact form | `components/sections/contact-section.tsx` — client-only, builds a `mailto:` URL, **no persistence** |
| Other content | `personalInfo`, `socialLinks`, `skills`, `navItems` in `lib/constants.ts` |
| Hosting | Single Next.js app (Vercel — uses `@vercel/analytics`, `@vercel/speed-insights`) |
| Backend | None |
| Database | None |

## 5. Target Architecture (to-be)

```
Public visitor ──────────────► Frontend (Next.js)  ──HTTP──►  Backend (Express API)  ──►  PostgreSQL
Owner (admin) ──────────────►  Admin app          ──HTTP──►  Backend (Express API)  ──►  PostgreSQL
```

- **Frontend** reads published content from the backend's **public, read-only** endpoints
  and submits the contact form to a public `POST` endpoint.
- **Admin** authenticates (JWT) and calls the backend's **protected** admin endpoints for
  full CRUD.
- **Backend** is the single source of truth. It owns the schema (Prisma), validation,
  auth, and file/image handling.
- **Three separate Dokploy applications** + **one Dokploy PostgreSQL** database service.

See [architecture.md](./architecture.md) for the full diagram and request flows.

## 6. Repository Structure (to-be)

pnpm workspaces monorepo. The existing frontend files move under `apps/frontend`.

```
portfolio/
├── apps/
│   ├── frontend/            # existing Next.js site (moved from repo root)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/             # constants.ts trimmed to static-only config
│   │   ├── public/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── backend/             # NEW — Express + Prisma API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/  # auth, validation, error handling
│   │   │   ├── lib/         # prisma client, config, logger
│   │   │   └── index.ts     # app bootstrap
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── admin/               # NEW — standalone admin panel (own web app)
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   └── shared-types/        # DTOs / entity types shared by all three apps
│       ├── src/
│       └── package.json
├── docs/                    # NEW — this PRD + companion docs
│   ├── PRD.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-spec.md
│   ├── deployment.md
│   └── migration-plan.md
├── pnpm-workspace.yaml
├── package.json             # root: workspace scripts, shared tooling
├── .gitignore
└── README.md
```

**Notes**
- `packages/shared-types` holds the Project / Contact / Category types so the frontend,
  admin, and backend never drift. Backend derives types from Prisma; the shared package
  re-exports the API-facing DTO shapes.
- Root `package.json` provides orchestration scripts (`pnpm --filter frontend dev`, etc.).
- Each app keeps its **own Dockerfile** so Dokploy builds each independently.

## 7. Detailed Requirements

### 7.1 Backend service (Express + Prisma + PostgreSQL)

- **Runtime:** Node.js (LTS), TypeScript, Express.
- **ORM:** Prisma with PostgreSQL. Migrations are versioned in `prisma/migrations` and
  run on deploy (`prisma migrate deploy`).
- **Validation:** request-body validation (e.g. Zod) on every write endpoint.
- **Auth:** JWT-based. A single admin account, credentials seeded via env + `seed.ts`
  (password stored hashed with bcrypt/argon2). Protected routes require a valid bearer
  token; public routes are open.
- **CORS:** allow the frontend and admin origins (configurable via env).
- **Image handling:** project images and preview images. **Phase 1** stores an external
  image URL (owner uploads elsewhere / pastes a URL) to avoid a storage dependency.
  **Phase 2 (optional)** adds direct upload to object storage (S3-compatible / MinIO on
  Dokploy) — tracked separately, not blocking.
- **Health:** `GET /health` returning `200` for Dokploy health checks.
- **Errors:** consistent JSON error envelope `{ error: { code, message, details? } }`.

### 7.2 Data model (owned by backend)

Primary entities (full schema in [data-model.md](./data-model.md)):

- **Project** — mirrors today's fields plus admin controls:
  `id, title, slug, description, image, tags[], demoUrl, codeUrl, date, previewImageUrl[],
  category, featured, published, sortOrder, createdAt, updatedAt`.
- **ContactSubmission** —
  `id, name, email, subject, message, status (new|read|archived), createdAt, ipAddress?,
  userAgent?`.
- **AdminUser** — `id, email, passwordHash, createdAt` (single row in Phase 1).
- **Category** — start as a fixed enum (`landing_page`, `dashboard`, `game`) matching the
  current site; can be promoted to a table later if categories must be editable.

> **Migration note:** existing hardcoded projects in `lib/constants.ts` are imported into
> the DB via the seed script so no content is lost. See [migration-plan.md](./migration-plan.md).

### 7.3 API (backend)

Full contract in [api-spec.md](./api-spec.md). Summary:

**Public (no auth — consumed by frontend)**
- `GET /api/projects` — list **published** projects (supports `?category=` and sorting by
  `sortOrder`/`date`).
- `GET /api/projects/:slug` — single published project.
- `POST /api/contact` — create a contact submission (rate-limited, validated, spam-guard).
- `GET /health`

**Admin (JWT required — consumed by admin app)**
- `POST /api/auth/login` → `{ token }`
- `GET /api/admin/projects` / `POST` / `GET /:id` / `PATCH /:id` / `DELETE /:id`
- `PATCH /api/admin/projects/reorder` — bulk `sortOrder` update
- `GET /api/admin/contacts` — list submissions (filter by `status`)
- `PATCH /api/admin/contacts/:id` — update status (read/archived)
- `GET /api/admin/me` — current admin

### 7.4 Admin panel (standalone service)

- Its **own web app** (own Dockerfile, own Dokploy service, own domain e.g.
  `admin.<domain>`), not embedded in the frontend.
- **Login screen** → obtains JWT, stored client-side; all requests attach the bearer token.
- **Projects management:** table/list view with create, edit, delete; toggle `featured`
  and `published`; drag-or-input reorder (`sortOrder`); image URL fields; tag editor;
  category select; date picker.
- **Contact inbox:** list submissions newest-first, view detail, mark read/archived.
- **Dashboard (light):** counts of projects (published/draft) and unread contacts.
- Access restricted to the single admin account; unauthenticated users are redirected to
  login.

### 7.5 Frontend changes

- Move all files under `apps/frontend`; update imports/paths accordingly.
- **Projects section** (`components/sections/projects-section.tsx`): replace the
  `import { projects } from '@/lib/constants'` with a fetch from
  `GET /api/projects` (server-side fetch / ISR so the public site stays fast and
  cacheable). Keep the existing category-filter UX (`all` + the three categories).
- **Contact section** (`components/sections/contact-section.tsx`): replace the `mailto:`
  handler with a `POST /api/contact` submission, plus success/error UI states and basic
  client validation. (Optionally keep `mailto:` as a fallback if the API is unreachable.)
- `lib/constants.ts` is trimmed to genuinely static config (`navItems`, and — for now —
  `personalInfo`/`socialLinks`/`skills`, unless we later choose to make those dynamic too;
  see Open Questions).
- Add `NEXT_PUBLIC_API_BASE_URL` env for the backend origin.

### 7.6 Shared types

- `packages/shared-types` exports `Project`, `ContactSubmission`, `ProjectCategory`, and
  request/response DTOs, consumed by frontend, admin, and (for DTO shapes) backend.

## 8. Deployment on Dokploy

Four Dokploy resources total (details in [deployment.md](./deployment.md)):

| Resource | Type | Build | Domain (example) | Notes |
|---|---|---|---|---|
| `portfolio-db` | PostgreSQL service | — | internal | Managed by Dokploy; backend connects via internal network |
| `portfolio-backend` | Application | `apps/backend/Dockerfile` | `api.<domain>` | Runs `prisma migrate deploy` on start; health check `/health` |
| `portfolio-frontend` | Application | `apps/frontend/Dockerfile` | `<domain>` | `NEXT_PUBLIC_API_BASE_URL=https://api.<domain>` |
| `portfolio-admin` | Application | `apps/admin/Dockerfile` | `admin.<domain>` | Talks to `api.<domain>` |

- Each application sets its **build context / Dockerfile path** to its app subfolder so
  Dokploy builds only that service.
- **Environment variables** per service (secrets in Dokploy env, not committed):
  - backend: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (seed),
    `CORS_ORIGINS`, `PORT`.
  - frontend: `NEXT_PUBLIC_API_BASE_URL`.
  - admin: `NEXT_PUBLIC_API_BASE_URL` (or equivalent), any admin-specific config.
- **Deploy order:** DB → backend (migrate + seed) → frontend & admin.
- Optional: a root `docker-compose.yml` for local dev that spins up Postgres + all three
  apps; Dokploy production uses the per-app Dockerfiles.

## 9. Milestones / Phasing

| Phase | Deliverable | Exit criteria |
|---|---|---|
| **P0 — Repo restructure** | Monorepo scaffolding: move frontend to `apps/frontend`, add pnpm workspaces, `docs/`, empty `apps/backend` + `apps/admin` shells | Frontend builds & runs from new path; CI/build unchanged behavior |
| **P1 — Backend MVP** | Express+Prisma API, Postgres schema, migrations, seed (imports current projects), public `GET /api/projects` + `POST /api/contact`, JWT auth, admin CRUD endpoints | API passes contract tests; seeded data matches current site |
| **P2 — Frontend integration** | Projects section fetches API; contact form posts to API | Public site renders DB-backed projects; submissions land in DB |
| **P3 — Admin panel** | Standalone admin app: login, projects CRUD, contact inbox | Owner can add/edit/delete a project and read a submission end-to-end |
| **P4 — Dokploy deploy** | Three Dokploy apps + Postgres wired with domains & env | All three services live; migrations run on deploy; health checks green |
| **P5 (optional)** | Image upload to object storage; make personalInfo/skills dynamic | Deferred — not blocking launch |

## 10. Success Metrics

- Adding or editing a project requires **zero code changes and zero redeploys**.
- **100%** of contact submissions are persisted and visible in the admin panel (0 lost).
- Public site's projects list is served from the DB with **no visual regression** vs. the
  current hardcoded list after seed.
- Three services deploy **independently** on Dokploy (deploying one doesn't require
  redeploying the others).

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Data loss migrating hardcoded projects | Seed script imports the exact current `projects[]`; verify count & fields before cutover |
| Public API abuse on `POST /api/contact` | Rate limiting + validation + honeypot/spam guard; consider captcha in P5 |
| Frontend depends on backend availability | Server-side fetch with ISR/caching; graceful fallback (last-good cache or static fallback list) if API is down |
| Secret management (JWT, DB, admin password) | Store only in Dokploy env; never commit; rotate `JWT_SECRET` capability |
| CORS / origin misconfig across 3 services | Centralize allowed origins in backend env; document exact domains in deployment.md |
| Repo move breaks imports/paths | Do the move in an isolated PR (P0), verify build before layering backend work |

## 12. Open Questions

1. Should `personalInfo`, `socialLinks`, and `skills` also become **admin-editable**
   (dynamic), or stay static in the frontend for now? (Assumed static in Phase 1.)
2. Do categories need to be **editable** by the owner, or is the fixed enum sufficient?
   (Assumed fixed enum in Phase 1.)
3. Image handling: URL-only in Phase 1, or is direct upload (object storage) required for
   launch? (Assumed URL-only.)
4. Should the frontend stay on Vercel, or move to Dokploy alongside backend/admin? (This
   PRD assumes **all three on Dokploy**; confirm.)
5. Contact submissions — is **email notification** to the owner on new submission needed
   at launch, or is the admin inbox enough? (Assumed inbox-only.)

---

*Companion documents in this directory expand each section: `architecture.md`,
`data-model.md`, `api-spec.md`, `deployment.md`, `migration-plan.md`. This PRD is the
source of scope; those documents carry the implementation detail.*
