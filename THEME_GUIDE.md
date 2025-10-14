# Theme System Guide

This portfolio includes a comprehensive dark/light mode theme system with persistence using Zustand.

## Features

- 🌙 **Dark/Light Mode Toggle**: Simple toggle between light and dark themes
- 💾 **Local Storage Persistence**: Theme preference is saved and restored on page reload
- 🎨 **Tailwind CSS Integration**: Uses Tailwind's dark mode classes
- 🔄 **System Theme Support**: Can follow system theme preference
- ⚡ **Zustand State Management**: Efficient state management with persistence

## Components

### Theme Toggle Components

#### `SimpleThemeToggle`
A simple toggle that switches between light and dark modes.

```tsx
import { SimpleThemeToggle } from '@/components/ui/theme-toggle';

<SimpleThemeToggle />
```

#### `ThemeToggle`
A more advanced toggle that cycles through light → dark → system → light.

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle />
```

### Theme Hook

Use the `useTheme` hook for theme management in your components:

```tsx
import { useTheme } from '@/lib/hooks/use-theme';

function MyComponent() {
  const { theme, setTheme, toggleTheme, isDark, isLight, isSystem } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Theme Store

Direct access to the Zustand store:

```tsx
import { useThemeStore } from '@/lib/theme-store';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  
  // Your component logic
}
```

## Usage in Components

### Conditional Styling

Use Tailwind's dark mode classes:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to theme
</div>
```

### Theme-Aware Components

```tsx
import { useTheme } from '@/lib/hooks/use-theme';

function ThemedComponent() {
  const { isDark } = useTheme();
  
  return (
    <div className={isDark ? 'bg-gray-800' : 'bg-white'}>
      Theme-aware content
    </div>
  );
}
```

## CSS Variables

The theme system uses CSS custom properties defined in `globals.css`:

- `--background`: Main background color
- `--foreground`: Main text color
- `--card`: Card background color
- `--primary`: Primary accent color
- `--secondary`: Secondary accent color
- `--muted`: Muted text color
- `--border`: Border color
- And more...

## Implementation Details

1. **Theme Store**: Uses Zustand with persistence middleware
2. **Theme Provider**: Wraps the app to initialize theme on mount
3. **CSS Classes**: Applies `light` or `dark` class to the root element
4. **System Theme**: Listens for system theme changes when theme is set to 'system'

## File Structure

```
lib/
├── theme-store.ts          # Zustand store with persistence
└── hooks/
    └── use-theme.ts        # Custom hook for theme management

components/
├── theme-provider.tsx      # Theme initialization provider
└── ui/
    └── theme-toggle.tsx    # Theme toggle components
```

## Adding to New Components

1. Import the theme hook: `import { useTheme } from '@/lib/hooks/use-theme';`
2. Use Tailwind dark mode classes: `className="bg-white dark:bg-gray-900"`
3. Or use the hook for conditional logic: `const { isDark } = useTheme();`
