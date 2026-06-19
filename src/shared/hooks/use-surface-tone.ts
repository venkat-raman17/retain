/**
 * useSurfaceTone — the theme-safe color resolver behind the redesign's
 * "per-surface color identity."
 *
 * A screen names a *source* of color (today's arc, an archetype, or a semantic
 * role) and gets back a `SurfaceTone`: a `base` identity color plus derived,
 * theme-correct values for soft fills (`wash`), tinted borders, hero `gradient`
 * stops, and readable-on-dark `text`. Everything resolves against the ACTIVE
 * theme (via `useTheme()`), never the default import, so the bolder color reads
 * correctly in all four themes.
 *
 * The resolution is split into a pure `resolveSurfaceTone(source, theme)` (unit
 * tested) and a thin hook wrapper.
 */
import type { AppTheme, ArchetypeTone } from '@/shared/design';
import { arcTone } from '@/shared/design/arc-colors';
import { useTheme } from '@/shared/hooks/use-theme';
import { lightenForContrast, withAlpha } from '@/shared/lib/color';

export type SemanticToneName =
  | 'primary'
  | 'support'
  | 'accent'
  | 'gold'
  | 'success'
  | 'warning'
  | 'danger'
  | 'mirror';

export type SurfaceToneSource =
  | { kind: 'arc'; arcNumber: number }
  | { kind: 'archetype'; id: ArchetypeTone }
  | { kind: 'semantic'; name: SemanticToneName };

export interface SurfaceTone {
  /** The identity color of the surface. */
  base: string;
  /** Low-alpha tint for soft fills and section bands. */
  wash: string;
  /** A variant of the tone that stays readable as text on dark stone. */
  text: string;
  /** A subtle tinted edge. */
  border: string;
  /** Two stops `[tint, fade]` for hero/section gradient bands. */
  gradient: readonly [string, string];
}

/** Build a tone from an arbitrary hex base, deriving theme-safe variants. */
export function surfaceToneFromBase(base: string, theme: AppTheme): SurfaceTone {
  return {
    base,
    wash: withAlpha(base, 0.14),
    text: lightenForContrast(base, theme.colors.surface),
    border: withAlpha(base, 0.45),
    gradient: [withAlpha(base, 0.2), withAlpha(base, 0)],
  };
}

/** Prefer the theme's purpose-built tones for semantic roles. */
function resolveSemantic(name: SemanticToneName, theme: AppTheme): SurfaceTone {
  const c = theme.colors;
  switch (name) {
    case 'primary':
      return { base: c.primary, wash: c.primarySoft, text: c.primaryBright, border: withAlpha(c.primary, 0.45), gradient: [withAlpha(c.primary, 0.2), withAlpha(c.primary, 0)] };
    case 'support':
      return { base: c.support, wash: c.supportSoft, text: c.primaryBright, border: withAlpha(c.support, 0.45), gradient: [withAlpha(c.support, 0.2), withAlpha(c.support, 0)] };
    case 'accent':
      return { base: c.accent, wash: c.accentSoft, text: c.accentText, border: withAlpha(c.accent, 0.45), gradient: [withAlpha(c.accent, 0.2), withAlpha(c.accent, 0)] };
    case 'gold':
      return { base: c.gold, wash: withAlpha(c.gold, 0.14), text: lightenForContrast(c.gold, c.surface), border: c.borderGold, gradient: [withAlpha(c.gold, 0.2), withAlpha(c.gold, 0)] };
    case 'success':
      return { base: c.success, wash: c.successSoft, text: c.successText, border: withAlpha(c.success, 0.45), gradient: [withAlpha(c.success, 0.2), withAlpha(c.success, 0)] };
    case 'warning':
      return { base: c.warning, wash: c.warningSoft, text: c.warningText, border: withAlpha(c.warning, 0.45), gradient: [withAlpha(c.warning, 0.2), withAlpha(c.warning, 0)] };
    case 'danger':
      return { base: c.danger, wash: c.dangerSoft, text: c.dangerText, border: withAlpha(c.danger, 0.45), gradient: [withAlpha(c.danger, 0.2), withAlpha(c.danger, 0)] };
    case 'mirror':
      return { base: c.iron, wash: withAlpha(c.iron, 0.14), text: c.textSecondary, border: withAlpha(c.iron, 0.4), gradient: [withAlpha(c.iron, 0.16), withAlpha(c.iron, 0)] };
    default:
      return { base: c.primary, wash: c.primarySoft, text: c.primaryBright, border: withAlpha(c.primary, 0.45), gradient: [withAlpha(c.primary, 0.2), withAlpha(c.primary, 0)] };
  }
}

/** Pure resolver — given a source and a theme, produce the surface tone. */
export function resolveSurfaceTone(source: SurfaceToneSource, theme: AppTheme): SurfaceTone {
  switch (source.kind) {
    case 'arc':
      return surfaceToneFromBase(arcTone(source.arcNumber), theme);
    case 'archetype':
      return surfaceToneFromBase(theme.archetype[source.id], theme);
    case 'semantic':
      return resolveSemantic(source.name, theme);
    default:
      return surfaceToneFromBase(theme.colors.primary, theme);
  }
}

/** Resolve a `SurfaceToneSource` against the active theme. */
export function useSurfaceTone(source: SurfaceToneSource): SurfaceTone {
  const theme = useTheme();
  return resolveSurfaceTone(source, theme);
}
