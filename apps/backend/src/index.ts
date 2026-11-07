// Import first — initializes Sentry before any instrumented module loads.
import './instrument';
import { createApp } from './app';
import { config } from './lib/config';
import { prisma } from './lib/prisma';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[backend] listening on :${config.port} (${config.nodeEnv})`);
});

async function shutdown(signal: string) {
  console.log(`[backend] ${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
