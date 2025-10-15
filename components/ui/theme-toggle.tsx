'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/lib/theme-store';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?:
    | 'ghost'
    | 'primary'
    | 'secondary'
    | 'primary-outline'
    | 'secondary-outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ThemeToggle({
  className,
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system theme';
      case 'system':
        return 'Switch to light mode';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleThemeChange}
      className={cn(className)}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getIcon()}
    </Button>
  );
}

// Simple toggle component that just switches between light and dark
export function ToggleThemeButton({
  className,
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useThemeStore();
  const isDark = theme === 'dark';

  // Prevent hydration mismatch by showing a placeholder until mounted
  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={cn(className)} disabled>
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn(className)}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
