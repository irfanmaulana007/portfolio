# Deployment — Dokploy

> Companion to [PRD.md](./PRD.md). How the three services + DB run on Dokploy.

## Resources

Four Dokploy resources, all in the same project/network:

| Resource | Type | Source | Build |
|---|---|---|---|
| `portfolio-db` | PostgreSQL | Dokploy database | — |
| `portfolio-backend` | Application | this repo | `apps/backend/Dockerfile` |
| `portfolio-frontend` | Application | this repo | `apps/frontend/Dockerfile` |
| `portfolio-admin` | Application | this repo | `apps/admin/Dockerfile` |

Each application points at the **same git repo** but sets a different **Dockerfile path /
build context** so Dokploy builds only that service.

## Domains

| Service | Domain (example) |
|---|---|
| Frontend | `<domain>` (e.g. `irfanmaulana.dev`) |
| Backend | `api.<domain>` |
| Admin | `admin.<domain>` |

## Environment variables

**Backend (`portfolio-backend`)**
```
DATABASE_URL=postgresql://<user>:<pass>@portfolio-db:5432/portfolio
JWT_SECRET=<random-long-secret>
ADMIN_EMAIL=<owner-email>
ADMIN_PASSWORD=<seed-password>        # used once by seed; rotate after
CORS_ORIGINS=https://<domain>,https://admin.<domain>
PORT=3001
```

**Frontend (`portfolio-frontend`)**
```
NEXT_PUBLIC_API_BASE_URL=https://api.<domain>
```

**Admin (`portfolio-admin`)**
```
NEXT_PUBLIC_API_BASE_URL=https://api.<domain>   # or framework-equivalent
```

> Secrets live only in Dokploy's env panel — never commit them.

## Migrations & seed on deploy

Backend container start command runs migrations before serving:
```
npx prisma migrate deploy && node dist/index.js
```
Seed is run **once** after the first successful migrate (manually or via a one-off job):
```
node dist/prisma/seed.js
```

## Health checks

- Backend: `GET /health` → `200`. Configure as the Dokploy health check path.
- Frontend/Admin: root path `/` returns `200`.

## Deploy order

1. `portfolio-db` (create database, note connection string).
2. `portfolio-backend` (migrate + seed; verify `/health` and `/api/projects`).
3. `portfolio-frontend` and `portfolio-admin` (point at `api.<domain>`).

## Local development (optional)

A root `docker-compose.yml` for local dev can bring up Postgres + all three apps:
- `postgres` service
- `backend` (with `DATABASE_URL` pointing at the compose Postgres)
- `frontend` and `admin` pointing at `http://localhost:3001`

Production on Dokploy uses the per-app Dockerfiles, not compose.

## CI/build notes

- pnpm workspaces: each Dockerfile installs with `pnpm install --filter <app>...` and
  builds only its app plus `packages/shared-types`.
- Deploying one service does not require redeploying the others (independent apps).
