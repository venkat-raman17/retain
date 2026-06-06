/**
 * Type system — strong, restrained, ceremonial.
 *
 * Two bundled, offline typefaces (loaded at startup via `@expo-google-fonts`):
 *   - `ceremony` = **Cinzel**, Roman monumental capitals modeled on classical
 *     stone inscriptions — for display, headings, card/rite titles, seals.
 *   - `reading`  = **Inter**, a clean neutral grotesque — for sustained reading
 *     (body, labels, metadata).
 * The pairing reads like a carved codex: an engraved title over legible teaching.
 *
 * Each Google-Font weight ships as its OWN family name (`Cinzel_700Bold`,
 * `Inter_400Regular`, …). On Android, `fontWeight` does not select between them,
 * so `family` is keyed by weight and `AppText` resolves a concrete family name
 * through `fontFamilyFor()` rather than relying on the `fontWeight` style.
 *
 * The conceptual hierarchy (mapped to `AppText` variants):
 *   display   → ceremonial section titles
 *   heading   → screen titles
 *   title     → cards and rites
 *   subheading→ secondary titles within a card
 *   body      → teachings (optimized for long Codex passages)
 *   label     → controls and inline labels
 *   caption   → metadata and eyebrows
 *   seal      → short, mantra-like closing lines (engraved feel)
 */
const ceremony = {
  regular: 'Cinzel_400Regular',
  medium: 'Cinzel_500Medium',
  semibold: 'Cinzel_600SemiBold',
  bold: 'Cinzel_700Bold',
} as const;

const reading = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  /**
   * Weight-keyed font families. `ceremony` = Cinzel (titles/seals);
   * `reading` = Inter (body/metadata). Resolve a concrete name via
   * `fontFamilyFor(family, weight)`.
   */
  family: {
    ceremony,
    reading,
  },
  size: {
    display: 34,
    title: 24,
    heading: 21,
    subheading: 18,
    body: 16,
    label: 14,
    caption: 12,
    seal: 13,
  },
  lineHeight: {
    display: 42,
    title: 31,
    heading: 28,
    subheading: 25,
    body: 26, // generous leading for long-form reading
    label: 20,
    caption: 16,
    seal: 20,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    /** A touch of air under ceremonial titles. */
    ceremonial: 0.3,
    wide: 0.6,
    /** Engraved eyebrows and seals. */
    wider: 1.4,
  },
} as const;

/** `'ceremony'` (Cinzel) or `'reading'` (Inter). */
export type FontFamilyName = keyof typeof typography.family;
/** `'regular' | 'medium' | 'semibold' | 'bold'`. */
export type FontWeightName = keyof typeof ceremony;

/**
 * Resolve the concrete bundled font family for a `(family, weight)` pair —
 * e.g. `fontFamilyFor('ceremony', 'bold')` → `'Cinzel_700Bold'`. Use this
 * instead of the `fontWeight` style so the right TTF is selected on Android.
 */
export function fontFamilyFor(
  family: FontFamilyName,
  weight: FontWeightName = 'regular',
): string {
  return typography.family[family][weight];
}

/** All bundled font family names — pass to `useFonts()` to load at startup. */
export const BUNDLED_FONT_FAMILIES = [
  ...Object.values(ceremony),
  ...Object.values(reading),
] as const;
