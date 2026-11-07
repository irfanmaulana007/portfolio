import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { config, isProd } from './lib/config';
import { apiRouter } from './routes';
import { errorHandler, notFound } from './middleware/error';

export function createApp() {
  const app = express();

  // Behind a reverse proxy — trust the configured hop count so req.ip / rate
  // limiting work (see TRUST_PROXY in config/docs).
  app.set('trust proxy', config.trustProxy);

  app.use(helmet());
  // Only the configured origins are allowed — never reflect arbitrary origins.
  // Auth is a bearer header (not cookies), so `credentials` is intentionally off.
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(isProd ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(notFound);

  // Report errors to Sentry before our JSON error handler formats the response.
  // No-op unless Sentry was initialized (SENTRY_DSN set) in ./instrument.
  Sentry.setupExpressErrorHandler(app);

  app.use(errorHandler);

  return app;
}
