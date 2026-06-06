/**
 * Semantic theme — maps palette values to *meaning*.
 *
 * Components reference semantic names (e.g. `colors.primary`, `colors.danger`)
 * via `useTheme()` so the active theme can change at runtime without touching
 * screens. Four premium themes are available; the active one is held in
 * ThemeContext and persisted to SQLite.
 *
 * Three layers per accent/state, so the right tone is always reachable:
 *   - base   (`primary`, `support`, `danger`, …) — fills, borders, structural use.
 *   - `*Soft` — a translucent **wash** for soft backgrounds (selected chips, the
 *               pause circle, soft buttons). Subtle, never a loud block.
 *   - `*Text` — a lighter **solid** that stays readable as text on dark stone.
 *
 * Accessibility: text tones (`*Text`, `textPrimary/Secondary`, parchment ink) are
 * chosen to clear WCAG AA on the surfaces they're used on; base state tones
 * (`danger`, `success`, `warning`) are for fills/borders, not small text — pair
 * them with `*Text` for labels.
 */
import { durations, palette, radii, shadows, spacing, typography } from './tokens';

// ─── Explicit type definitions ───────────────────────────────────────────────
// Defined explicitly (not derived with `typeof theme`) so all four runtime
// themes can satisfy the same interface regardless of their specific hex values.

export type ThemeColor =
  | 'background'
  | 'backgroundRaised'
  | 'surface'
  | 'surfaceRaised'
  | 'surfaceOverlay'
  | 'border'
  | 'borderStrong'
  | 'borderGold'
  | 'textPrimary'
  | 'textSecondary'
  | 'textMuted'
  | 'onPrimary'
  | 'textInverse'
  | 'primary'
  | 'primarySoft'
  | 'primaryBright'
  | 'primarySurface'
  | 'accent'
  | 'accentSoft'
  | 'accentText'
  | 'support'
  | 'supportSoft'
  | 'ember'
  | 'emberMuted'
  | 'gold'
  | 'bronze'
  | 'iron'
  | 'success'
  | 'successSoft'
  | 'successText'
  | 'calm'
  | 'calmSoft'
  | 'warning'
  | 'warningSoft'
  | 'warningText'
  | 'danger'
  | 'dangerSoft'
  | 'dangerText'
  | 'focusRing'
  | 'parchment'
  | 'parchmentText'
  | 'parchmentMuted'
  | 'parchmentBorder';

export type ArchetypeTone =
  | 'monk'
  | 'warrior'
  | 'craftsman'
  | 'king'
  | 'lover'
  | 'pilgrim'
  | 'sage'
  | 'brother'
  | 'guardian'
  | 'builder'
  | 'healer'
  | 'sovereign';

export interface AppTheme {
  colors: Record<ThemeColor, string>;
  archetype: Record<ArchetypeTone, string>;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  durations: typeof durations;
  shadows: typeof shadows;
}

// ─── Shared non-color tokens — identical across all themes ───────────────────

/** The 12 archetype tones, used subtly to tint an archetype's surfaces. */
export const sharedArchetype: Record<ArchetypeTone, string> = {
  monk: palette.monk,
  warrior: palette.warrior,
  craftsman: palette.craftsman,
  king: palette.king,
  lover: palette.lover,
  pilgrim: palette.pilgrim,
  sage: palette.sage,
  brother: palette.brother,
  guardian: palette.guardian,
  builder: palette.builder,
  healer: palette.healer,
  sovereign: palette.sovereign,
};

// ─── Default theme (Noir & Bone) ─────────────────────────────────────────────
// This is the base/default theme and the fallback used by app-data-provider
// before the ThemeContext initializes. All components must consume the active
// theme through `useTheme()`, never by importing this constant directly.

export const theme: AppTheme = {
  colors: {
    // ── Surfaces ─────────────────────────────────────────────────────────────
    background: palette.backgroundPrimary,
    backgroundRaised: palette.backgroundSecondary,
    surface: palette.surfacePrimary,
    surfaceRaised: palette.surfaceSecondary,
    surfaceOverlay: palette.surfaceElevated,

    // ── Edges ────────────────────────────────────────────────────────────────
    border: palette.borderSubtle,
    borderStrong: palette.borderStrong,
    borderGold: palette.borderGold,

    // ── Text ─────────────────────────────────────────────────────────────────
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    onPrimary: palette.textInverse,
    textInverse: palette.textInverse,

    // ── Primary accent ───────────────────────────────────────────────────────
    primary: palette.ember,
    primarySoft: palette.emberWash,
    primaryBright: palette.emberBright,
    primarySurface: palette.emberSurface,

    // ── Editorial accent ─────────────────────────────────────────────────────
    accent: palette.bronze,
    accentSoft: palette.bronzeWash,
    accentText: palette.bronzeSoft,

    // ── Support / ember ──────────────────────────────────────────────────────
    support: palette.ember,
    supportSoft: palette.emberWash,
    ember: palette.ember,
    emberMuted: palette.emberMuted,

    // ── Standalone metals ────────────────────────────────────────────────────
    gold: palette.gold,
    bronze: palette.bronze,
    iron: palette.iron,

    // ── State ────────────────────────────────────────────────────────────────
    success: palette.success,
    successSoft: palette.successWash,
    successText: palette.successSoft,
    calm: palette.success,
    calmSoft: palette.successWash,
    warning: palette.warning,
    warningSoft: palette.warningWash,
    warningText: palette.warningSoft,
    danger: palette.danger,
    dangerSoft: palette.dangerWash,
    dangerText: palette.dangerSoft,

    // ── Focus ────────────────────────────────────────────────────────────────
    focusRing: palette.ember,

    // ── Reading surfaces ─────────────────────────────────────────────────────
    parchment: palette.parchment,
    parchmentText: palette.parchmentText,
    parchmentMuted: palette.parchmentMuted,
    parchmentBorder: palette.parchmentBorder,
  },

  archetype: sharedArchetype,
  spacing,
  radii,
  typography,
  durations,
  shadows,
};
