/**
 * Pure color utilities for deriving theme-safe tints from base hues.
 *
 * Used by `useSurfaceTone` to turn an earthen arc/archetype base color into a
 * low-alpha wash, a tinted border, a hero gradient, and a readable-on-dark text
 * tone. No React, no theme — just math, so it is trivially unit-testable.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, n));
}

/** Parse `#RGB` or `#RRGGBB` into channels. */
export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => clamp255(Math.round(n)).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Translucent version of a hex color, as an `rgba(...)` string. */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Linear blend of two hex colors. `ratio` 0 → a, 1 → b. */
export function mix(a: string, b: string, ratio: number): string {
  const t = Math.max(0, Math.min(1, ratio));
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
  });
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0–1). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Lighten `hex` toward white until it clears `minContrast` against `bg`, so an
 * earthen base tone stays readable as text on a dark surface. Capped so it never
 * blows out to pure white.
 */
export function lightenForContrast(hex: string, bg: string, minContrast = 4.5): string {
  let result = hex;
  for (let i = 0; i < 10 && contrastRatio(result, bg) < minContrast; i += 1) {
    result = mix(result, '#FFFFFF', 0.12);
  }
  return result;
}
