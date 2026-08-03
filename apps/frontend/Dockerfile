# syntax=docker/dockerfile:1
# Build context = repo root (so pnpm workspace deps resolve).
# Dokploy: set "Docker Context Path" to the repo root and "Dockerfile Path"
# to apps/frontend/Dockerfile.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /repo

# ---- Dependencies --------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json packages/shared-types/
COPY apps/frontend/package.json apps/frontend/
RUN pnpm install --frozen-lockfile --filter @portfolio/frontend...

# ---- Builder -------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/frontend/node_modules ./apps/frontend/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend
RUN pnpm --filter @portfolio/frontend build

# ---- Runner --------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# The standalone output preserves the monorepo layout under /repo.
COPY --from=builder --chown=nextjs:nodejs /repo/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/frontend/public ./apps/frontend/public

USER nextjs
EXPOSE 3000

# server.js is emitted at the app path inside the standalone bundle.
CMD ["node", "apps/frontend/server.js"]
