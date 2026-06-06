import { theme, type AppTheme } from '@/shared/design';

/**
 * Access the active theme. Retain is dark-only for v1, so this returns the
 * single theme today — but components should depend on this hook rather than
 * importing `theme` directly, so a future theme context is a drop-in change.
 */
export function useTheme(): AppTheme {
  return theme;
}
