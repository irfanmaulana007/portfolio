# Data Model

> Companion to [PRD.md](./PRD.md). Prisma schema owned by the backend.

## Categories

Phase 1 keeps categories as a fixed enum matching the current site
(`lib/constants.ts` → `ProjectCategory`). The public frontend additionally has an `all`
filter, which is a UI concern, not a stored value.

## Prisma schema (draft)

```prisma
// apps/backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProjectCategory {
  landing_page
  dashboard
  game
}

enum ContactStatus {
  new
  read
  archived
}

model Project {
  id              Int             @id @default(autoincrement())
  title           String
  slug            String          @unique
  description     String
  image           String          // main image URL
  tags            String[]        // e.g. ["Next.js", "TypeScript"]
  demoUrl         String?
  codeUrl         String?
  date            DateTime        // project date (used for sorting)
  previewImageUrl String[]        // gallery images
  category        ProjectCategory
  featured        Boolean         @default(false)
  published       Boolean         @default(true)
  sortOrder       Int             @default(0)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([published, category])
  @@index([sortOrder])
}

model ContactSubmission {
  id        Int           @id @default(autoincrement())
  name      String
  email     String
  subject   String
  message   String
  status    ContactStatus @default(new)
  ipAddress String?
  userAgent String?
  createdAt DateTime      @default(now())

  @@index([status, createdAt])
}

model AdminUser {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

// Site content (formerly apps/frontend/lib/constants.ts + the skills-section
// inline list), now served to the public frontend via GET /api/profile.
model SiteProfile {        // singleton, id = 1
  id             Int      @id @default(1)
  name           String
  role           String
  bio            String
  phone          String
  email          String
  location       String
  developerSince String   // e.g. "2018"
  updatedAt      DateTime @updatedAt
}

model SocialLink {
  id        Int      @id @default(autoincrement())
  platform  String   @unique   // e.g. "github"
  url       String
  label     String
  sortOrder Int      @default(0)
  updatedAt DateTime @updatedAt
}

model NavItem {
  id        Int      @id @default(autoincrement())
  name      String
  href      String   @unique   // e.g. "#about"
  sortOrder Int      @default(0)
  updatedAt DateTime @updatedAt
}

model Skill {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  level     Int                 // 0–100 proficiency
  sortOrder Int      @default(0)
  updatedAt DateTime @updatedAt
}
```

## Field mapping — current `projects[]` → `Project`

| Current constant field | Model field | Notes |
|---|---|---|
| `id` | `id` | preserved during seed |
| `title` | `title` | — |
| — | `slug` | derived from `title` (kebab-case), must be unique |
| `description` | `description` | — |
| `image` | `image` | URL string |
| `tags` | `tags` | string array |
| `demoUrl` | `demoUrl` | nullable (some are `''` today → store `null`) |
| `codeUrl` | `codeUrl` | nullable |
| `date` | `date` | parse `YYYY-MM-DD` → `DateTime` |
| `previewImageUrl` | `previewImageUrl` | string array |
| `category` | `category` | enum value already matches |
| `featured` | `featured` | — |
| — | `published` | default `true` for all seeded projects |
| — | `sortOrder` | seed by current display order (newest first) |

## Seeding

`apps/backend/prisma/seed.ts` — all steps are **create-only** (idempotent; never
overwrite rows edited directly in the DB, and never reset an existing admin's
password):
1. Create the single `AdminUser` from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (hashed),
   only if it does not already exist.
2. Create the `SiteProfile` / `SocialLink` / `NavItem` / `Skill` content, only if
   absent.
3. Create all projects (the mapping above), only if the slug is absent.

The `SiteProfile`/`SocialLink`/`NavItem`/`Skill` content is **also** inserted by
the data migration `migrations/20261105000000_add_site_content`
(`INSERT ... ON CONFLICT DO NOTHING`), so an existing deployment gets it
automatically on `prisma migrate deploy` without running the seed. Keep the
migration's values in sync with `seed.ts`.
