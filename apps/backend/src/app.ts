import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, isProd } from './lib/config';
import { apiRouter } from './routes';
import { errorHandler, notFound } from './middleware/error';

export function createApp() {
  const app = express();

  // Behind Dokploy's reverse proxy — trust it so req.ip / rate limiting work.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigins.length > 0 ? config.corsOrigins : true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(isProd ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
