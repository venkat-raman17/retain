import type { AppTheme } from '@/shared/design';
import { THEME_META, THEME_IDS, type ThemeId } from '@/shared/design/themes';
import { useThemeContext } from '@/shared/storage/theme-context';

/**
 * Access the active theme. Returns the full `AppTheme` for the user's currently
 * selected theme, reactive to runtime changes via ThemeContext.
 *
 * Components should depend on this hook (not import `theme` directly) so that
 * the active theme propagates to every component on switch.
 */
export function useTheme(): AppTheme {
  return useThemeContext().theme;
}

/** Controls for the theme picker — themeId, setter, and ordered metadata. */
export function useThemeControls(): {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => Promise<void>;
  themeIds: ThemeId[];
  themeMeta: typeof THEME_META;
} {
  const { themeId, setThemeId } = useThemeContext();
  return { themeId, setThemeId, themeIds: THEME_IDS, themeMeta: THEME_META };
}
