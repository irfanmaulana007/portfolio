import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? 'development';
const runningInProd = nodeEnv === 'production';

// `fallback` is a development-only convenience. In production a missing value is
// always a hard error — we never silently run on a default secret or DB URL,
// which would otherwise let anyone forge admin tokens.
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? (runningInProd ? undefined : fallback);
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv,
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/portfolio'),
  jwtSecret: required('JWT_SECRET', 'dev-insecure-secret-change-me'),
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN ?? 60 * 60 * 8), // 8h
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

export const isProd = config.nodeEnv === 'production';
