/**
 * Semantic theme — maps the raw stone/ember/gold palette to *meaning*.
 *
 * Components reference these names (e.g. `colors.support`, `colors.danger`) so the
 * palette can change without touching screens. Retain ships a single, intentional
 * dark theme for v1; consume it via `useTheme()` so a future theme context is a
 * drop-in change.
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
 * them with `*Text` for labels. See docs/DESIGN_SYSTEM.md.
 */
import { durations, palette, radii, shadows, spacing, typography } from './tokens';

/** The 12 archetype tones, used subtly to tint an archetype's surfaces. */
const archetype = {
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
} as const;

export const theme = {
  colors: {
    // ── Surfaces — the stone room, floor to overlay ──────────────────────────
    background: palette.backgroundPrimary, // app floor
    backgroundRaised: palette.backgroundSecondary, // nav chrome, sunken wells
    surface: palette.surfacePrimary, // default card slab
    surfaceRaised: palette.surfaceSecondary, // raised/secondary card
    surfaceOverlay: palette.surfaceElevated, // modals, inputs, highest slab

    // ── Edges — iron lines over heavy shadow ────────────────────────────────
    border: palette.borderSubtle,
    borderStrong: palette.borderStrong,
    borderGold: palette.borderGold, // ceremonial edge (milestones, vows)

    // ── Text — warm parchment on iron ───────────────────────────────────────
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted, // metadata only — non-essential copy
    onPrimary: palette.textInverse, // text on an ember/copper fill
    textInverse: palette.textInverse,

    /**
     * The copper ember — primary buttons, forge actions, selected borders,
     * active day, "I feel the fire." The fire is not decorative; it is governed.
     */
    primary: palette.ember,
    primarySoft: palette.emberWash,
    primaryBright: palette.emberBright, // readable ember text on dark stone
    primarySurface: palette.emberSurface, // solid ember-tinted fill surface

    /** Editorial accent — codex ink. Eyebrows, lineage labels, content marks. */
    accent: palette.bronze,
    accentSoft: palette.bronzeWash,
    accentText: palette.bronzeSoft, // readable editorial eyebrow text

    /** The fire itself — ember. Pause/urge moments: warm, present, never an alarm. */
    support: palette.ember,
    supportSoft: palette.emberWash,
    ember: palette.ember,
    emberMuted: palette.emberMuted,

    /** Standalone metals. Gold is ceremonial/archetype only; ember is primary. */
    gold: palette.gold,
    bronze: palette.bronze,
    iron: palette.iron,

    /** Completion & integration — deep olive. A thing that grew, not a checkmark. */
    success: palette.success,
    successSoft: palette.successWash,
    successText: palette.successSoft,
    /** Calm/recovery — same olive, steadying and restorative copy. */
    calm: palette.success,
    calmSoft: palette.successWash,

    /** Caution / urge — warm amber. The fire noticed; attention without shrillness. */
    warning: palette.warning,
    warningSoft: palette.warningWash,
    warningText: palette.warningSoft,

    /**
     * Lapse — deep rust. Grave, warm, and recoverable. Deliberately NOT a bright
     * red: a lapse ends a streak, not the practice (see docs/CONTENT_SAFETY.md).
     */
    danger: palette.danger,
    dangerSoft: palette.dangerWash,
    dangerText: palette.dangerSoft,

    /** Keyboard/focus ring — the copper ember glow. */
    focusRing: palette.ember,

    // ── Reading surfaces — warm parchment for long passages ─────────────────
    parchment: palette.parchment,
    parchmentText: palette.parchmentText,
    parchmentMuted: palette.parchmentMuted,
    parchmentBorder: palette.parchmentBorder,
  },

  /** Per-archetype tones — keyed by archetype id. Use subtly (rules in docs). */
  archetype,

  spacing,
  radii,
  typography,
  durations,
  shadows,
} as const;

export type AppTheme = typeof theme;
export type ThemeColor = keyof AppTheme['colors'];
export type ArchetypeTone = keyof AppTheme['archetype'];
