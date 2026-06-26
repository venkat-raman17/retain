/**
 * useDayTheme — a distinct-but-coherent color identity for EACH of the 90 days
 * (and the post-crown day).
 *
 * Each day is now its own archetype (1:1), so the tone is derived from the day's
 * ARC — giving each 10-day arc a color family — then spread by the day's position
 * within its arc so every day reads as distinct, with a small per-day jitter on
 * top. Fully deterministic (seeded by day number, no `Math.random`) and resolved
 * against the ACTIVE theme so it stays theme-safe in all four themes.
 *
 * Split into a pure `resolveDayTone(source, theme)` (unit tested) + a thin hook.
 */
import type { AppTheme } from '@/shared/design';
import { arcTone } from '@/shared/design/arc-colors';
import { useTheme } from '@/shared/hooks/use-theme';
import { surfaceToneFromBase, type SurfaceTone } from '@/shared/hooks/use-surface-tone';
import { daySeed } from '@/shared/lib';
import { adjustLightness, shiftHue } from '@/shared/lib/color';

export interface DayThemeSource {
  /** 1–90 for path days; use 91 for the post-crown / Long Path day. */
  day: number;
  /** 1–9. The day tone is built from this arc's earthen identity. */
  arcNumber: number;
}

/** Pure resolver: a per-day surface tone, theme-safe. */
export function resolveDayTone(source: DayThemeSource, theme: AppTheme): SurfaceTone {
  const arcBase = arcTone(source.arcNumber);
  const seed = daySeed(source.day);
  // Spread the ~10 days of an arc across a hue band so each reads distinct while
  // staying in the arc's family, then add a small per-day jitter + lightness shift.
  const dayWithinArc = (Math.trunc(source.day) - 1) % 10; // 0–9
  const bandShift = (dayWithinArc - 4.5) * 6; // −27°…+27°
  const jitter = (seed % 9) - 4; // −4°…+4°
  const lightShift = ((Math.trunc(seed / 9) % 7) - 3) * 0.014; // ±~0.042
  const base = adjustLightness(shiftHue(arcBase, bandShift + jitter), lightShift);
  return surfaceToneFromBase(base, theme);
}

/** Resolve a per-day tone against the active theme. */
export function useDayTheme(source: DayThemeSource): SurfaceTone {
  const theme = useTheme();
  return resolveDayTone(source, theme);
}
