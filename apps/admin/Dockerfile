# syntax=docker/dockerfile:1
# Build context = repo root (so pnpm workspace deps resolve).
# Dokploy: set "Docker Context Path" to the repo root and "Dockerfile Path"
# to apps/admin/Dockerfile.
#
# VITE_API_BASE_URL is inlined at build time, so pass it as a build arg.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# ---- Dependencies --------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json packages/shared-types/
COPY apps/admin/package.json apps/admin/
# --ignore-scripts blocks dependency lifecycle scripts at install time (Sonar
# docker:S6505). The Vite build needs no install-time scripts.
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @portfolio/admin...

# ---- Builder -------------------------------------------------------------
FROM base AS builder
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/admin/node_modules ./apps/admin/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/admin ./apps/admin
RUN pnpm --filter @portfolio/admin build

# ---- Runner (static) -----------------------------------------------------
FROM nginx:1.27-alpine AS runner
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
