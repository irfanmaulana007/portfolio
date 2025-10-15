import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setMounted: (mounted: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      mounted: false,
      setTheme: (theme: Theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          applyTheme(theme);
        }
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        if (typeof window !== 'undefined') {
          applyTheme(newTheme);
        }
      },
      setMounted: (mounted: boolean) => {
        set({ mounted });
      },
    }),
    {
      name: 'theme-storage',
      partialize: state => ({ theme: state.theme }), // Only persist theme, not mounted state
      onRehydrateStorage: () => state => {
        if (state && typeof window !== 'undefined') {
          // Apply theme after hydration
          setTimeout(() => {
            applyTheme(state.theme);
            useThemeStore.getState().setMounted(true);
          }, 0);
        }
      },
    }
  )
);

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;

  // Remove existing theme classes
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Listen for system theme changes when theme is set to 'system'
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const currentTheme = useThemeStore.getState().theme;
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });
}
