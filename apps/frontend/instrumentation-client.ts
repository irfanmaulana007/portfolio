import * as Sentry from '@sentry/nextjs';

// Browser (client) initialization. Next.js loads this before hydration.
// No-op unless NEXT_PUBLIC_SENTRY_DSN is set.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // Low-traffic personal site: sample a fraction of traces, always send errors.
    tracesSampleRate: 0.2,
  });
}

// Instrument client-side navigations so transactions are tied to route changes.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
