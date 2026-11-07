import * as Sentry from '@sentry/nextjs';

// Browser (client) initialization. Next.js loads this before hydration.
// When NEXT_PUBLIC_SENTRY_DSN is unset the SDK sends nothing, but note the
// @sentry/nextjs client SDK is still statically imported and therefore bundled
// regardless — "no-op" here means no events, not zero bundle cost. In this
// project Sentry is enabled in production, so the bundle cost is expected.
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
