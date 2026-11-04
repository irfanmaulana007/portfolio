# Deployment — Dokploy

> Companion to [PRD.md](./PRD.md). How the three services + DB run on Dokploy.

> [!IMPORTANT]
> **Set the build args before the first deploy, or the build fails.** The
> frontend and admin inline the API URL **at build time**, so each needs a
> **Build Arg** (not just a runtime env var) in Dokploy:
>
> | App                  | Build Arg                  | Example                |
> | -------------------- | -------------------------- | ---------------------- |
> | `portfolio-frontend` | `NEXT_PUBLIC_API_BASE_URL` | `https://api.<domain>` |
> | `portfolio-admin`    | `VITE_API_BASE_URL`        | `https://api.<domain>` |
>
> The frontend build **hard-fails** without it:
>
> ```
> Error: NEXT_PUBLIC_API_BASE_URL must be set for a production build
> (it is inlined into the browser bundle). Pass it as a build arg.
> ```
>
> Setting it only as a runtime env var is the #1 deploy mistake — it won't
> satisfy the build. See [Build arguments](#build-arguments-compile-time--critical)
> below for where to put it in Dokploy.

## Resources

Four Dokploy resources, all in the same project/network:

| Resource             | Type                          | Dockerfile path            | Build context       |
| -------------------- | ----------------------------- | -------------------------- | ------------------- |
| `portfolio-db`       | PostgreSQL (Dokploy database) | —                          | —                   |
| `portfolio-backend`  | Application (this repo)       | `apps/backend/Dockerfile`  | **repo root (`.`)** |
| `portfolio-frontend` | Application (this repo)       | `apps/frontend/Dockerfile` | **repo root (`.`)** |
| `portfolio-admin`    | Application (this repo)       | `apps/admin/Dockerfile`    | **repo root (`.`)** |

> **Build context must be the repo root**, not the app subfolder — the Dockerfiles
> copy `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `packages/shared-types` so the pnpm
> workspace resolves. In Dokploy set each app's **Build Type = Dockerfile**, **Docker
> Context Path = `.`**, and **Dockerfile Path** to the app's Dockerfile above. Point all
> three at the same repo/branch.

## Domains

| Service  | Domain (example)                     | Container port |
| -------- | ------------------------------------ | -------------- |
| Frontend | `<domain>` (e.g. `irfanmaulana.dev`) | 3000           |
| Backend  | `api.<domain>`                       | 3001           |
| Admin    | `admin.<domain>`                     | 8080           |

## Build arguments (compile-time — critical)

Two apps inline the API URL **at build time**, so these must be set as **Build Args**
in Dokploy, not just runtime env:

| App                  | Build Arg                  | Example                |
| -------------------- | -------------------------- | ---------------------- |
| `portfolio-frontend` | `NEXT_PUBLIC_API_BASE_URL` | `https://api.<domain>` |
| `portfolio-admin`    | `VITE_API_BASE_URL`        | `https://api.<domain>` |

**Where in Dokploy:** open the application → **Environment** → the **Build-time
Variables / Build Args** section (separate from the runtime Environment panel) →
add the variable there → redeploy. Build args are only read during `docker build`,
so a value in the runtime panel alone never reaches the build.

**What happens if you miss it:**

- **Frontend** — the build **hard-fails** (by design — see
  [`apps/frontend/next.config.ts`](../apps/frontend/next.config.ts)) with:
  ```
  Error: NEXT_PUBLIC_API_BASE_URL must be set for a production build
  (it is inlined into the browser bundle). Pass it as a build arg.
  ```
  This is a guardrail: it refuses to ship a bundle that would silently point every
  visitor's browser at `http://localhost:3001`.
- **Admin** — the build succeeds but the shipped bundle falls back to
  `http://localhost:3001`, so admin API calls break in production.

## Environment variables (runtime)

**Backend (`portfolio-backend`)**

```
DATABASE_URL=postgresql://<user>:<pass>@portfolio-db:5432/portfolio
JWT_SECRET=<random-long-secret>
JWT_EXPIRES_IN=28800
ADMIN_EMAIL=<owner-email>
ADMIN_PASSWORD=<seed-password>        # used once by seed; rotate after
CORS_ORIGINS=https://<domain>,https://admin.<domain>
PORT=3001
NODE_ENV=production
```

**Frontend (`portfolio-frontend`)**

```
# Server-side (SSR/ISR) project fetch. Use the internal service URL if available,
# else the public API domain.
API_BASE_URL=http://portfolio-backend:3001
# Also set the same NEXT_PUBLIC_API_BASE_URL here for parity (it was already
# baked in at build time as a Build Arg above).
NEXT_PUBLIC_API_BASE_URL=https://api.<domain>
```

**Admin (`portfolio-admin`)** — no runtime env needed (static site; `VITE_API_BASE_URL`
was baked in at build time). Served by non-root nginx on port 8080 (set Dokploy's
container port to **8080** for this app).

> Secrets live only in Dokploy's env panel — never commit them.

## Auto-deploy & per-service watch paths

All three apps point at the **same repo and branch**, so by default a single push
would rebuild **all three** — wasteful, since most commits touch only one app.
Dokploy's **Watch Paths** filter fixes this: on each webhook push it compares the
changed files against the app's patterns and **only deploys when something matches**.

### 1. Enable auto-deploy (once per app)

For `portfolio-backend`, `portfolio-frontend`, and `portfolio-admin`:

1. Connect the Git provider (GitHub) and select the repo + production branch.
2. Turn on **Auto Deploy**. Dokploy registers a webhook on the repo (one webhook
   serves all three apps; the Watch Paths below decide which actually redeploy).

### 2. Set Watch Paths (once per app)

In each application's **Deployments → Watch Paths** (glob patterns, one per line):

**`portfolio-backend`**

```
apps/backend/**
packages/shared-types/**
pnpm-lock.yaml
pnpm-workspace.yaml
package.json
```

**`portfolio-frontend`**

```
apps/frontend/**
packages/shared-types/**
pnpm-lock.yaml
pnpm-workspace.yaml
package.json
```

**`portfolio-admin`**

```
apps/admin/**
packages/shared-types/**
pnpm-lock.yaml
pnpm-workspace.yaml
package.json
```

### Why these paths

- `apps/<svc>/**` — the service's own source. A change here rebuilds only that service.
- `packages/shared-types/**` — the shared DTO package every app compiles in. A change
  here **intentionally rebuilds all three** (they share the contract).
- `pnpm-lock.yaml`, `pnpm-workspace.yaml`, root `package.json` — workspace/dependency
  changes can affect any app's install, so they trigger all three (conservative and safe).
- Anything else — `docs/**`, `.github/**`, `README.md`, the other apps' folders — does
  **not** match, so that service stays untouched.

> **Leave Watch Paths empty = every push redeploys that app.** That's the fallback if
> the field isn't available in your Dokploy version — in that case, deploy manually
> (app → **Deploy**) or split into separate branches per service.

> The build context is still the repo root (so the lockfile/workspace resolve); Watch
> Paths only decide **whether** to deploy, not **what** gets copied into the image.

### Verify

Push a change under `apps/admin/**` only → **just** `portfolio-admin` should deploy
(check each app's **Deployments** tab). Push a change under `packages/shared-types/**`
→ all three should deploy.

## Migrations & seed

The backend container **runs migrations automatically on start** (from its Dockerfile
`CMD`):

```
node_modules/.bin/prisma migrate deploy && node dist/src/index.js
```

**Seed once** after the first successful deploy, to import the existing projects and the
admin user. Run this as a one-off in the backend container (Dokploy → app → Terminal, or
a scheduled/one-off command). From the app dir (`/repo/apps/backend`):

```
pnpm db:seed
```

It reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `DATABASE_URL` from the environment and is
idempotent (upserts), so re-running is safe.

## Health checks

- Backend: `GET /health` → `200`. Configure as the Dokploy health-check path.
- Frontend: `/` returns `200`.
- Admin: `/` returns `200` (nginx).

## Deploy order

1. **`portfolio-db`** — create the PostgreSQL database; note its internal host/credentials.
2. **`portfolio-backend`** — set env, deploy. Migrations run on start. Then run
   `pnpm db:seed` once. Verify `GET /health` and `GET /api/projects` (should return the
   8 seeded projects).
3. **`portfolio-frontend`** and **`portfolio-admin`** — set the build args + env, deploy.
   Verify the public site lists projects and the admin login works.

## Verify end-to-end

```bash
# Backend up + projects seeded
curl https://api.<domain>/health
curl https://api.<domain>/api/projects        # -> 8 projects

# Admin login (returns a JWT)
curl -X POST https://api.<domain>/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"<owner-email>","password":"<password>"}'

# Contact submission persists
curl -X POST https://api.<domain>/api/contact \
  -H 'content-type: application/json' \
  -d '{"name":"Test","email":"t@example.com","subject":"Hi","message":"Hello"}'
```

Then open `https://<domain>` (projects render from the API) and `https://admin.<domain>`
(log in, see the seeded projects and the test contact submission).

## Local development (alternative to Dokploy)

Root `docker-compose.yml` brings up Postgres + all three apps (build context = repo root,
matching Dokploy). `docker compose up --build`, then seed with
`docker compose exec backend pnpm db:seed`. Ports: frontend 3000, backend 3001, admin
5173, postgres 5432.

## CI/build notes

- Each Dockerfile installs with `pnpm install --frozen-lockfile --filter <app>...` and
  builds only that app plus `packages/shared-types`.
- Deploying one service does not require redeploying the others (independent apps).
  Combined with the per-service **Watch Paths** above, a push only rebuilds the
  app(s) whose files actually changed.
