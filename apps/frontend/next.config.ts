import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Emit a minimal standalone server bundle so the Docker image
  // ships only the files needed to run the app.
  output: 'standalone',
  // In a monorepo, trace files from the repo root so workspace deps
  // (e.g. @portfolio/shared-types) are included in the standalone output.
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // Transpile the shared workspace package (published as TS source).
  transpilePackages: ['@portfolio/shared-types'],
};

export default nextConfig;
