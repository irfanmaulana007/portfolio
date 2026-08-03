# Portfolio Monorepo

A pnpm-workspaces monorepo containing three independently deployable services:

| App | Path | Stack | Port (dev) |
|---|---|---|---|
| **Frontend** | `apps/frontend` | Next.js 15, React 19, Tailwind, Shadcn UI | 3000 |
| **Backend** | `apps/backend` | Express, Prisma, PostgreSQL | 3001 |
| **Admin** | `apps/admin` | Vite, React 19, React Router | 5173 |
| Shared types | `packages/shared-types` | TypeScript DTOs | — |

The frontend renders the public portfolio and fetches projects from the backend
API (falling back to a static list if the API is unavailable). The backend owns
all dynamic content — projects and contact submissions — and exposes public +
admin REST endpoints. The admin app is the owner-only UI for managing projects
and reading contact submissions.

See [`docs/`](./docs) for the PRD, architecture, data model, API spec,
deployment (Dokploy), and migration plan.

## Prerequisites

- Node.js >= 22
- pnpm 10 (`corepack enable`)
- PostgreSQL 16 (or `docker compose up -d postgres`)

## Getting started

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Start Postgres (or use your own and set DATABASE_URL)
docker compose up -d postgres

# 3. Configure backend env
cp apps/backend/.env.example apps/backend/.env
#   edit DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 4. Apply migrations and seed (imports existing projects + admin user)
pnpm --filter @portfolio/backend db:migrate:dev
pnpm db:seed

# 5. Run the services (separate terminals)
pnpm dev:backend    # http://localhost:3001
pnpm dev:frontend   # http://localhost:3000
pnpm dev:admin      # http://localhost:5173
```

Frontend and admin env:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/admin/.env.example apps/admin/.env
```

## Common scripts (run from repo root)

| Command | Description |
|---|---|
| `pnpm build` | Build all packages |
| `pnpm build:backend` / `:frontend` / `:admin` | Build one app |
| `pnpm dev:backend` / `:frontend` / `:admin` | Run one app in dev |
| `pnpm db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `pnpm db:seed` | Seed admin user + projects |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm format` | Prettier across the repo |

## Deployment

Each app has its own `Dockerfile` (build context = repo root) and deploys as a
separate Dokploy application, backed by a Dokploy PostgreSQL service. Full setup
in [docs/deployment.md](./docs/deployment.md).
