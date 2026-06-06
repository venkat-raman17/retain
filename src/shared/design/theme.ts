/**
 * Semantic theme — maps raw tokens to meaning. Components reference these names
 * (e.g. `colors.support`) so the palette can change without touching screens.
 *
 * Retain ships a single, intentional dark theme for v1. The shape below is built
 * to allow additional themes later without changing component code: consume the
 * theme via `useTheme()` rather than importing `theme` directly in new work.
 */
import { durations, palette, radii, spacing, typography } from './tokens';

export const theme = {
  colors: {
    background: palette.obsidian,
    surface: palette.ink,
    surfaceRaised: palette.slate,
    surfaceOverlay: palette.slateRaised,

    border: palette.border,
    borderStrong: palette.borderStrong,

    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,

    /** The energy — the ally. Warm, valuable, never garish. */
    primary: palette.gold,
    primarySoft: palette.goldSoft,
    onPrimary: palette.obsidian,

    /** The path — mystical, aspirational. */
    accent: palette.indigo,
    accentSoft: palette.indigoSoft,

    /** Recovery, calm, integration after a lapse. */
    calm: palette.jade,
    calmSoft: palette.jadeSoft,

    /** Urge-support moments. Supportive and steady — not an alarm, not shame. */
    support: palette.ember,
    supportSoft: palette.emberSoft,

    focusRing: palette.indigo,
  },
  spacing,
  radii,
  typography,
  durations,
} as const;

export type AppTheme = typeof theme;
export type ThemeColor = keyof AppTheme['colors'];
