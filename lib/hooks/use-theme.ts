import { useThemeStore } from '@/lib/theme-store';

export function useTheme() {
  const { theme, setTheme, toggleTheme, mounted } = useThemeStore();
  
  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSystem: theme === 'system',
  };
}
