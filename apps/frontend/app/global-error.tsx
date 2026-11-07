'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import './globals.css';

// Catches render errors in the root layout that normal error boundaries miss.
// Next renders it in place of the root layout, so it must provide its own
// <html>/<body> and can't rely on the layout's providers/font. We still pull in
// globals.css + the Button primitive so the crash screen matches the design
// system, and we wire Next's `reset` prop to a "Try again" recovery action.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAFA] antialiased dark:bg-[#121212]">
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#FAFAFA]">
              Something went wrong
            </h2>
            <p className="text-sm text-[#555555] dark:text-[#A0A0A0]">
              An unexpected error occurred. Please try again.
            </p>
          </div>
          <Button onClick={() => reset()}>Try again</Button>
        </main>
      </body>
    </html>
  );
}
