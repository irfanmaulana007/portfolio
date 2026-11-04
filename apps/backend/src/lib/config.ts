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

// CORS: in production an allow-list is mandatory and we never reflect arbitrary
// origins — an unset or empty CORS_ORIGINS is a hard error rather than fail-open.
// In development it defaults to the local frontend/admin dev servers.
function parseCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS;
  const list = (raw ?? (runningInProd ? '' : 'http://localhost:3000,http://localhost:5173'))
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (runningInProd && list.length === 0) {
    throw new Error('CORS_ORIGINS must list at least one allowed origin in production');
  }
  return list;
}

// Number of reverse-proxy hops in front of the app, used by Express to derive
// req.ip (rate limiting / stored IPs). Defaults to 1 (single proxy, e.g. Dokploy).
// Set TRUST_PROXY to a hop count, or `true`/`false`, to match your topology.
function parseTrustProxy(): boolean | number {
  const v = process.env.TRUST_PROXY;
  if (v === undefined || v === '') return 1;
  if (v === 'true') return true;
  if (v === 'false') return false;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : 1;
}

export const config = {
  nodeEnv,
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/portfolio'),
  jwtSecret: required('JWT_SECRET', 'dev-insecure-secret-change-me'),
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN ?? 60 * 60 * 8), // 8h
  corsOrigins: parseCorsOrigins(),
  trustProxy: parseTrustProxy(),
};

export const isProd = config.nodeEnv === 'production';
