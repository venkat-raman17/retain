import type { Station, Trial } from '@/content/schemas';

import {
  arcsCleared,
  embersForCompletedDays,
  isArcCleared,
  stationForArcsCleared,
} from './progression';

const mockTrial = (dayNumber: number | 'crown', embers: number): Trial => ({
  id: `trial-${dayNumber}`,
  dayNumber,
  arcNumber: typeof dayNumber === 'number' ? Math.ceil(dayNumber / 10) : null,
  name: 'Test',
  tier: 'foundation',
  objectives: [{ id: 'o', kind: 'reveal_secret', label: 'Reveal', optional: false }],
  rewardEmbers: embers,
  rewardKeyId: null,
  flavor: 'Test flavor.',
});

const trials: Trial[] = [
  ...Array.from({ length: 90 }, (_, i) => mockTrial(i + 1, 25)),
  mockTrial('crown', 100),
];

const stations: Station[] = [
  { id: 'station-0', arcsCleared: 0, title: 'Initiate', description: 'Just begun.', sealSource: 'semantic', sealId: 'primary' },
  { id: 'station-1', arcsCleared: 1, title: 'Seeker', description: 'First arc held.', sealSource: 'arc', sealId: '1' },
  { id: 'station-9', arcsCleared: 9, title: 'Crowned', description: 'The practice is who he is.', sealSource: 'arc', sealId: '9' },
];

describe('embersForCompletedDays', () => {
  it('returns 0 for no completed days', () => {
    expect(embersForCompletedDays(trials, [], false)).toBe(0);
  });

  it('sums embers for completed days', () => {
    expect(embersForCompletedDays(trials, [1, 2, 3], false)).toBe(75);
  });

  it('adds crown embers when crown received', () => {
    expect(embersForCompletedDays(trials, [1], true)).toBe(125);
  });

  it('is monotonic — more days = more embers', () => {
    const ten = embersForCompletedDays(trials, Array.from({ length: 10 }, (_, i) => i + 1), false);
    const twenty = embersForCompletedDays(trials, Array.from({ length: 20 }, (_, i) => i + 1), false);
    expect(twenty).toBeGreaterThan(ten);
  });

  it('does not double-count the same day', () => {
    const once = embersForCompletedDays(trials, [1], false);
    const dup = embersForCompletedDays(trials, [1, 1], false);
    expect(dup).toBe(once);
  });
});

describe('arcsCleared', () => {
  it('returns 0 for empty', () => {
    expect(arcsCleared([])).toBe(0);
  });

  it('counts a full arc', () => {
    const days = Array.from({ length: 10 }, (_, i) => i + 1);
    expect(arcsCleared(days)).toBe(1);
  });

  it('does not count a partial arc', () => {
    expect(arcsCleared([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(0);
  });

  it('counts all 9 arcs', () => {
    const days = Array.from({ length: 90 }, (_, i) => i + 1);
    expect(arcsCleared(days)).toBe(9);
  });
});

describe('isArcCleared', () => {
  it('false when arc is partial', () => {
    expect(isArcCleared([1, 2, 3], 1)).toBe(false);
  });

  it('true when all 10 days done', () => {
    const days = Array.from({ length: 10 }, (_, i) => i + 1);
    expect(isArcCleared(days, 1)).toBe(true);
  });
});

describe('stationForArcsCleared', () => {
  it('returns initiate when 0 arcs cleared', () => {
    expect(stationForArcsCleared(stations, 0)?.title).toBe('Initiate');
  });

  it('returns seeker when 1 arc cleared', () => {
    expect(stationForArcsCleared(stations, 1)?.title).toBe('Seeker');
  });

  it('returns highest earned station', () => {
    expect(stationForArcsCleared(stations, 9)?.title).toBe('Crowned');
  });

  it('returns undefined for empty station list', () => {
    expect(stationForArcsCleared([], 3)).toBeUndefined();
  });
});
