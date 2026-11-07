// Sentry must be initialized before any other module is imported so its
// auto-instrumentation can patch http/express/prisma at require time. This file
// is therefore imported first in src/index.ts, ahead of all other imports.
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

// Load .env here too (config.ts also calls this, but that runs later) so a
// DSN placed in .env is available before Sentry.init. dotenv.config() does not
// override variables already present in the environment.
dotenv.config();

const dsn = process.env.SENTRY_DSN;

// No-op when SENTRY_DSN is unset: local dev and unconfigured deploys send nothing.
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    // Low-traffic personal site: sample a fraction of traces, always send errors.
    tracesSampleRate: 0.2,
  });
}
