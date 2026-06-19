/**
 * useDayTheme — a distinct-but-coherent color identity for EACH of the 90 days
 * (and the post-crown day).
 *
 * Where `useSurfaceTone({kind:'archetype'})` gives every day of an archetype the
 * same color, this derives a per-DAY tone: the archetype's base hue, nudged
 * toward the day's arc tone for arc-coherence, then shifted a small, deterministic
 * amount per day so consecutive days — even within one archetype — read as
 * different. Fully deterministic (seeded by day number, no `Math.random`), and
 * resolved against the ACTIVE theme so it stays theme-safe in all four themes.
 *
 * Split into a pure `resolveDayTone(source, theme)` (unit tested) + a thin hook.
 */
import type { AppTheme, ArchetypeTone } from '@/shared/design';
import { arcTone } from '@/shared/design/arc-colors';
import { useTheme } from '@/shared/hooks/use-theme';
import { surfaceToneFromBase, type SurfaceTone } from '@/shared/hooks/use-surface-tone';
import { daySeed } from '@/shared/lib';
import { adjustLightness, mix, shiftHue } from '@/shared/lib/color';

export interface DayThemeSource {
  /** 1–90 for path days; use 91 for the post-crown / Long Path day. */
  day: number;
  archetype: ArchetypeTone;
  /** 1–9. Tints the day tone toward the arc's earthen identity. */
  arcNumber: number;
}

/** Pure resolver: a per-day surface tone, theme-safe. */
export function resolveDayTone(source: DayThemeSource, theme: AppTheme): SurfaceTone {
  const archBase = theme.archetype[source.archetype] ?? theme.colors.primary;
  // Lean the archetype hue toward the arc's earthen tone so the day still reads
  // as belonging to its arc, then vary per day.
  const blended = mix(archBase, arcTone(source.arcNumber), 0.18);
  const seed = daySeed(source.day);
  const hueShift = (seed % 27) - 13; // −13°…+13°, small enough to stay on-family
  const lightShift = ((Math.trunc(seed / 27) % 7) - 3) * 0.012; // ±~0.036
  const base = adjustLightness(shiftHue(blended, hueShift), lightShift);
  return surfaceToneFromBase(base, theme);
}

/** Resolve a per-day tone against the active theme. */
export function useDayTheme(source: DayThemeSource): SurfaceTone {
  const theme = useTheme();
  return resolveDayTone(source, theme);
}
