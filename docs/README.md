# Documentation

Product and engineering docs for the portfolio platform.

| Doc | What it covers |
|---|---|
| [PRD.md](./PRD.md) | Product requirements: goals, scope, phasing, success metrics. **Start here.** |
| [architecture.md](./architecture.md) | Services, request flows, tech choices, repo layout |
| [data-model.md](./data-model.md) | Prisma schema for Project, ContactSubmission, AdminUser |
| [api-spec.md](./api-spec.md) | REST endpoints (public + admin), payloads, auth |
| [deployment.md](./deployment.md) | Dokploy setup for the three services + PostgreSQL |
| [migration-plan.md](./migration-plan.md) | Step-by-step repo split and content migration |

**TL;DR** — split the single Next.js app into a pnpm-workspaces monorepo with three
independently deployed services (frontend, backend API, admin panel) backed by
PostgreSQL, so projects and contact submissions become dynamic instead of hardcoded.
