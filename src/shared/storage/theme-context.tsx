import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  DEFAULT_THEME_ID,
  THEMES,
  isThemeId,
  type ThemeId,
} from '@/shared/design/themes';
import type { AppTheme } from '@/shared/design';

import { useRepositories } from './repositories-context';

const STORAGE_KEY = 'theme_id';

// ─── Context ─────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: AppTheme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => Promise<void>;
}

/**
 * Default context value — the default theme with a no-op setter. This lets
 * primitives (AppText, etc.) render in the default theme during app bootstrap,
 * before ThemeProvider mounts (the loading/error screens in AppDataProvider
 * render outside the provider, since the provider needs ready repositories).
 */
const DEFAULT_CONTEXT_VALUE: ThemeContextValue = {
  theme: THEMES[DEFAULT_THEME_ID],
  themeId: DEFAULT_THEME_ID,
  setThemeId: async () => {},
};

const ThemeContext = createContext<ThemeContextValue>(DEFAULT_CONTEXT_VALUE);

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Holds the active theme and persists the user's choice to SQLite.
 * Must be rendered **inside** AppDataProvider (needs `useRepositories()`).
 * All components consume the active theme through `useTheme()`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useRepositories();
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);

  // Load persisted theme on mount
  useEffect(() => {
    let active = true;
    void settings.get(STORAGE_KEY).then((stored) => {
      if (!active) return;
      if (stored !== null && isThemeId(stored)) {
        setThemeIdState(stored);
      }
    });
    return () => {
      active = false;
    };
  }, [settings]);

  const setThemeId = useCallback(
    async (id: ThemeId) => {
      setThemeIdState(id);
      await settings.set(STORAGE_KEY, id);
    },
    [settings],
  );

  const value: ThemeContextValue = {
    theme: THEMES[themeId],
    themeId,
    setThemeId,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Internal hook — used by `useTheme()` and `useThemeControls()`. Outside a
 * ThemeProvider it returns the default theme (no throw) so bootstrap UI renders.
 */
export function useThemeContext(): ThemeContextValue {
  return useContext(ThemeContext);
}
