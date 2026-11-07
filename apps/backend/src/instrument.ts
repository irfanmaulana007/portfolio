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

// No-op at runtime when SENTRY_DSN is unset: local dev and unconfigured deploys
// send nothing. (The SDK is still bundled; "no-op" means no events, not zero cost.)
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    // Low-traffic personal site: sample a fraction of traces, always send errors.
    tracesSampleRate: 0.2,
    // Don't collect PII at the source (@sentry/node v11 replaced
    // `sendDefaultPii` with `dataCollection`): no user info, cookies, headers,
    // or request/response bodies. This keeps login credentials and contact-form
    // PII out of events entirely, not just scrubbed after the fact.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
    },
    // Keep Express request tracing, but turn OFF the integration's automatic
    // error capture. Its default sends any error without a resolvable HTTP
    // status as a 500 — which would report every ZodError (login/contact
    // validation) and mapped Prisma P2002/P2025 as an exception even though our
    // errorHandler answers 4xx/409/404. Instead we capture only genuine 500s
    // ourselves in middleware/error.ts (see Sentry.captureException there).
    integrations: [Sentry.expressIntegration({ shouldHandleError: false })],
    // Defence-in-depth: strip request body / cookies / auth from any event so a
    // visitor's contact-form PII or login credentials never reach Sentry, even
    // if a future change attaches request data to an event.
    beforeSend(event) {
      if (event.request) {
        delete event.request.data;
        delete event.request.cookies;
        const headers = event.request.headers;
        if (headers) {
          delete headers.authorization;
          delete headers.Authorization;
          delete headers.cookie;
          delete headers.Cookie;
        }
      }
      return event;
    },
  });
}
