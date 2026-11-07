import * as Sentry from '@sentry/nextjs';

// Server + edge runtime initialization. Next.js calls `register()` once per
// runtime on boot. No-op unless NEXT_PUBLIC_SENTRY_DSN is set so local dev and
// unconfigured deploys send nothing.
export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      // Low-traffic personal site: sample a fraction of traces, always send errors.
      tracesSampleRate: 0.2,
    });
  }
}

// Capture errors thrown in nested React Server Components.
export const onRequestError = Sentry.captureRequestError;
