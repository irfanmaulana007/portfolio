# syntax=docker/dockerfile:1
# Build context = repo root (so pnpm workspace deps resolve).
# Dokploy: set "Docker Context Path" to the repo root and "Dockerfile Path"
# to apps/backend/Dockerfile.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable
WORKDIR /repo

# ---- Dependencies --------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json packages/shared-types/
COPY apps/backend/package.json apps/backend/
# --ignore-scripts blocks dependency lifecycle scripts at install time (Sonar
# docker:S6505). The Prisma client is generated explicitly in the build stage
# (`prisma generate` in the backend build script), so nothing here needs them.
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @portfolio/backend...

# ---- Builder -------------------------------------------------------------
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/backend/node_modules ./apps/backend/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN pnpm --filter @portfolio/backend build

# ---- Runner --------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/backend ./apps/backend
COPY --from=builder /repo/packages ./packages
COPY package.json pnpm-workspace.yaml ./

WORKDIR /repo/apps/backend
EXPOSE 3001

# Drop to the image's built-in non-root `node` user (Sonar docker:S6471). The app
# only reads its (world-readable) files and writes nothing to the container FS.
ENV HOME=/home/node
USER node

# Apply migrations, then start. Invoke the Prisma binary directly (no pnpm/corepack
# at runtime, so no writable global store is needed as non-root). Seed is a one-off
# (see docs/deployment.md).
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/src/index.js"]
