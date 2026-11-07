'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Catches render errors in the root layout that normal error boundaries miss.
// Must render its own <html>/<body> because it replaces the root layout.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
      </body>
    </html>
  );
}
