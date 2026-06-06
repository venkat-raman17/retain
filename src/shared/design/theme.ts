/**
 * Semantic theme — maps raw tokens to meaning. Components reference these names
 * (e.g. `colors.support`) so the palette can change without touching screens.
 *
 * Retain ships a single, intentional dark theme for v1. Consume it via
 * `useTheme()` in new work so a future theme context is a drop-in change.
 */
import { durations, palette, radii, shadows, spacing, typography } from './tokens';

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

    /** Recovery, calm, success — integration after effort. */
    calm: palette.jade,
    calmSoft: palette.jadeSoft,
    success: palette.jade,
    successSoft: palette.jadeSoft,

    /** Urge-support moments. Supportive and steady — not an alarm, not shame. */
    support: palette.ember,
    supportSoft: palette.emberSoft,

    /** Muted warning — amber, never bright failure-red. */
    warning: palette.warning,
    warningSoft: palette.warningSoft,

    focusRing: palette.indigo,
  },
  spacing,
  radii,
  typography,
  durations,
  shadows,
} as const;

export type AppTheme = typeof theme;
export type ThemeColor = keyof AppTheme['colors'];
