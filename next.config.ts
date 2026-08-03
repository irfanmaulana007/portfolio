import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Emit a minimal standalone server bundle so the Docker image
  // ships only the files needed to run the app.
  output: 'standalone',
};

export default nextConfig;
