import { theme } from '@/shared/design';
import { ARC_TONE } from '@/shared/design/arc-colors';
import { contrastRatio } from '@/shared/lib/color';

import { resolveSurfaceTone } from './use-surface-tone';

describe('resolveSurfaceTone', () => {
  it('uses the arc base hue and derives a translucent wash', () => {
    const tone = resolveSurfaceTone({ kind: 'arc', arcNumber: 6 }, theme);
    expect(tone.base).toBe(ARC_TONE[6]);
    expect(tone.wash).toMatch(/^rgba\(/);
    expect(tone.gradient).toHaveLength(2);
  });

  it('falls back to the Gate tone for an out-of-range arc', () => {
    const tone = resolveSurfaceTone({ kind: 'arc', arcNumber: 99 }, theme);
    expect(tone.base).toBe(ARC_TONE[1]);
  });

  it('keeps arc text readable (AA) on the active surface', () => {
    for (const arcNumber of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const tone = resolveSurfaceTone({ kind: 'arc', arcNumber }, theme);
      expect(contrastRatio(tone.text, theme.colors.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('resolves an archetype to its theme tone', () => {
    const tone = resolveSurfaceTone({ kind: 'archetype', id: 'warrior' }, theme);
    expect(tone.base).toBe(theme.archetype.warrior);
  });

  it('prefers the theme purpose-built tones for semantic roles', () => {
    const primary = resolveSurfaceTone({ kind: 'semantic', name: 'primary' }, theme);
    expect(primary.base).toBe(theme.colors.primary);
    expect(primary.wash).toBe(theme.colors.primarySoft);
    expect(primary.text).toBe(theme.colors.primaryBright);

    const danger = resolveSurfaceTone({ kind: 'semantic', name: 'danger' }, theme);
    expect(danger.base).toBe(theme.colors.danger);
    expect(danger.text).toBe(theme.colors.dangerText);
  });
});
