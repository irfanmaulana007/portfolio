# Architecture

> Companion to [PRD.md](./PRD.md). Describes the target system.

## Services

| Service | Tech | Role | Dokploy domain (example) |
|---|---|---|---|
| Frontend | Next.js 15 (App Router), React 19, TS, Tailwind, Shadcn UI | Public portfolio site; reads content from the API | `<domain>` |
| Backend | Node.js, Express, TypeScript, Prisma | Source of truth; REST API; auth; validation | `api.<domain>` |
| Admin | Standalone web app (own build), TS | Owner-only UI for CRUD + contact inbox | `admin.<domain>` |
| Database | PostgreSQL (Dokploy service) | Persistence | internal network |

## Request flows

```
                     ┌─────────────────────────────┐
Public visitor ─────▶│ Frontend (Next.js)          │
                     │  - GET /api/projects (SSR/ISR)
                     │  - POST /api/contact         │
                     └───────────────┬─────────────┘
                                     │ HTTPS
Owner (admin) ──────▶ Admin app ─────┤
                       - login (JWT) │
                       - CRUD        ▼
                     ┌─────────────────────────────┐
                     │ Backend (Express + Prisma)   │
                     │  public routes | admin routes│
                     └───────────────┬─────────────┘
                                     │ Prisma (internal net)
                                     ▼
                     ┌─────────────────────────────┐
                     │ PostgreSQL                   │
                     └─────────────────────────────┘
```

## Boundaries & principles

- **Backend is the only writer to the DB.** Frontend and admin never touch Postgres
  directly — they go through the API.
- **Public vs. admin surface.** Public endpoints are read-only (plus contact create) and
  return only `published` content. Admin endpoints require a JWT and expose full CRUD.
- **Stateless services.** All state lives in Postgres; services can be restarted/scaled
  by Dokploy without loss.
- **Shared types.** `packages/shared-types` keeps DTOs aligned across the three apps.
- **Caching.** Frontend uses SSR/ISR so the public site stays fast and survives brief
  backend downtime with last-good content.

## Tech-choice rationale

- **Express + Prisma + PostgreSQL** — lightweight, TypeScript-native, minimal boilerplate;
  Prisma gives type-safe queries and versioned migrations that run cleanly on Dokploy.
- **pnpm workspaces** — one repo, three deployables, shared tooling and types without
  publishing packages.
- **Separate admin app** — keeps the admin bundle and auth surface fully isolated from the
  public site; each deploys and scales on its own.

## Repo layout

See [PRD.md §6](./PRD.md#6-repository-structure-to-be) for the full tree.
