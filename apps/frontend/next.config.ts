import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
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

export default (phase: string): NextConfig => {
  // NEXT_PUBLIC_API_BASE_URL is inlined into the client bundle at build time;
  // if it's missing the contact form silently points at localhost for every
  // visitor. Fail the production build fast rather than ship that.
  if (phase === PHASE_PRODUCTION_BUILD && !process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL must be set for a production build ' +
        '(it is inlined into the browser bundle). Pass it as a build arg.'
    );
  }
  return nextConfig;
};
