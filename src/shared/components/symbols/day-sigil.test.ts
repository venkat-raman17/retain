import { theme } from '@/shared/design';
import { resolveDayTone } from '@/shared/hooks/use-day-theme';

import { daySigilParams } from './day-sigil';

const arcForDay = (day: number) => Math.min(9, Math.max(1, Math.ceil(day / 10)));

describe('daySigilParams', () => {
  it('is deterministic — same inputs yield identical params', () => {
    for (const day of [1, 7, 42, 90]) {
      const arc = arcForDay(day);
      expect(daySigilParams(day, arc)).toEqual(daySigilParams(day, arc));
    }
  });

  it('bands ring count by arc (1→1, mid→2, late→3)', () => {
    expect(daySigilParams(1, 1).rings).toBe(1);
    expect(daySigilParams(45, 5).rings).toBe(2);
    expect(daySigilParams(85, 9).rings).toBe(3);
  });

  it('keeps accent count in the 5–12 band', () => {
    for (let day = 1; day <= 90; day += 1) {
      const { accentCount } = daySigilParams(day, arcForDay(day));
      expect(accentCount).toBeGreaterThanOrEqual(5);
      expect(accentCount).toBeLessThanOrEqual(12);
    }
  });

  it('gives the crown its own climactic form', () => {
    expect(daySigilParams(91, 9, true)).toEqual({
      rings: 3,
      accentCount: 12,
      accentRotation: 15,
      markStyle: 'diamond',
    });
  });
});

describe('resolveDayTone', () => {
  it('is deterministic and theme-safe', () => {
    const a = resolveDayTone({ day: 12, arcNumber: 2 }, theme);
    const b = resolveDayTone({ day: 12, arcNumber: 2 }, theme);
    expect(a).toEqual(b);
    expect(a.base).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});

describe('per-day distinctness across the full path', () => {
  it('produces a distinct mark+tone signature for all 91 days', () => {
    const signatures = new Set<string>();
    for (let day = 1; day <= 91; day += 1) {
      const crown = day === 91;
      const arc = arcForDay(day);
      const p = daySigilParams(day, arc, crown);
      const tone = resolveDayTone({ day, arcNumber: arc }, theme);
      signatures.add(`${p.rings}-${p.accentCount}-${p.accentRotation}-${p.markStyle}-${tone.base}`);
    }
    expect(signatures.size).toBe(91);
  });
});
