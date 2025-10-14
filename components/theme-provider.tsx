'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mounted, setMounted } = useThemeStore();

  useEffect(() => {
    // Mark as mounted after hydration
    setMounted(true);
  }, [setMounted]);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
