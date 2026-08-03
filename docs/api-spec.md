# API Spec

> Companion to [PRD.md](./PRD.md). REST contract for the backend.

Base URL (prod): `https://api.<domain>`
All bodies are JSON. Errors use `{ "error": { "code", "message", "details"? } }`.

## Auth

- `POST /api/auth/login` — admin login.
  - Body: `{ "email": string, "password": string }`
  - 200: `{ "token": string, "expiresIn": number }`
  - 401 on bad credentials.
- Protected admin routes require `Authorization: Bearer <token>`.

## Public endpoints (consumed by frontend)

### `GET /api/projects`
List published projects.
- Query: `category` (`landing_page|dashboard|game`, optional), `sort` (`date|order`,
  default `order`).
- 200: `Project[]` (published only).

### `GET /api/projects/:slug`
- 200: `Project` · 404 if not found or unpublished.

### `POST /api/contact`
Create a contact submission. Rate-limited + validated + spam-guarded.
- Body: `{ "name": string, "email": string, "subject": string, "message": string, "honeypot"?: string }`
- 201: `{ "id": number, "status": "new" }`
- 400 on validation error · 429 when rate-limited.

### `GET /health`
- 200: `{ "status": "ok" }` (Dokploy health check).

## Admin endpoints (JWT required, consumed by admin app)

### Projects
- `GET /api/admin/projects` — all projects (published + drafts). Query filters: `category`,
  `published`, `featured`.
- `POST /api/admin/projects` — create. Body: Project fields (no `id`); `slug` auto-derived
  if omitted.
- `GET /api/admin/projects/:id`
- `PATCH /api/admin/projects/:id` — partial update.
- `DELETE /api/admin/projects/:id`
- `PATCH /api/admin/projects/reorder` — body `{ "order": [{ "id": number, "sortOrder": number }] }`.

### Contacts
- `GET /api/admin/contacts` — list. Query: `status` (`new|read|archived`), pagination.
- `GET /api/admin/contacts/:id`
- `PATCH /api/admin/contacts/:id` — body `{ "status": "read" | "archived" }`.

### Session
- `GET /api/admin/me` — current admin `{ id, email }`.

## DTO shapes

Shared via `packages/shared-types`. `Project` and `ContactSubmission` mirror the Prisma
models in [data-model.md](./data-model.md), with `date`/`createdAt` serialized as ISO
strings over the wire.

## Cross-cutting

- **Validation:** every write endpoint validates its body (e.g. Zod); reject unknown/extra
  fields on admin writes.
- **CORS:** allowed origins from `CORS_ORIGINS` env (frontend + admin domains).
- **Rate limiting:** applied to `POST /api/contact` and `POST /api/auth/login`.
- **Pagination:** admin list endpoints support `?page=&pageSize=`.
