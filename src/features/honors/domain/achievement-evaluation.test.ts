import { fixedClock } from '@/shared/lib/clock';

import { evaluateAchievements, type AchievementSignals } from './achievement-evaluation';
import type { Achievement } from '@/content/schemas';

const CLOCK = fixedClock(new Date('2026-01-01T08:00:00Z'));

const emptySignals: AchievementSignals = {
  completedDays: [],
  pauseCount: 0,
  forgeActCount: 0,
  forgeCategoriesUsed: new Set(),
  returnCount: 0,
  crownReceived: false,
  totalEmbers: 0,
};

const allSignals: AchievementSignals = {
  completedDays: Array.from({ length: 90 }, (_, i) => i + 1),
  pauseCount: 15,
  forgeActCount: 20,
  forgeCategoriesUsed: new Set(['body', 'mind', 'spirit', 'order', 'creation', 'brotherhood']),
  returnCount: 2,
  crownReceived: true,
  totalEmbers: 2500,
};

const catalog: Achievement[] = [
  {
    id: 'first-pause',
    title: 'The Pause',
    description: 'Observed the first urge.',
    sealSource: 'semantic',
    sealId: 'support',
    criteria: { kind: 'pause_logged', params: { count: 1 } },
  },
  {
    id: 'gate-one',
    title: 'First Arc',
    description: 'Completed all ten days of Arc 1.',
    sealSource: 'arc',
    sealId: '1',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 1 } },
  },
  {
    id: 'fire-balance',
    title: 'Fire Balance',
    description: 'Used all six forge categories.',
    sealSource: 'semantic',
    sealId: 'accent',
    criteria: { kind: 'forge_all_categories', params: {} },
  },
  {
    id: 'the-return',
    title: 'The Return',
    description: 'Returned to the practice.',
    sealSource: 'archetype',
    sealId: 'healer',
    criteria: { kind: 'return_recorded', params: { count: 1 } },
  },
  {
    id: 'the-crown',
    title: 'The Crown',
    description: 'Received the crown.',
    sealSource: 'arc',
    sealId: '9',
    criteria: { kind: 'crown_received', params: {} },
  },
];

describe('evaluateAchievements', () => {
  it('returns empty when no signals', () => {
    const earned = evaluateAchievements(catalog, emptySignals, CLOCK);
    expect(earned).toEqual([]);
  });

  it('earns pause achievement on 1 pause', () => {
    const signals = { ...emptySignals, pauseCount: 1 };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).toContain('first-pause');
  });

  it('earns arc-cleared when all 10 days done', () => {
    const signals = {
      ...emptySignals,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).toContain('gate-one');
  });

  it('does NOT earn arc-cleared when missing one day', () => {
    const signals = {
      ...emptySignals,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).not.toContain('gate-one');
  });

  it('earns fire-balance when all 6 categories used', () => {
    const signals = {
      ...emptySignals,
      forgeCategoriesUsed: new Set(['body', 'mind', 'spirit', 'order', 'creation', 'brotherhood']),
    };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).toContain('fire-balance');
  });

  it('does NOT earn fire-balance with only 5 categories', () => {
    const signals = {
      ...emptySignals,
      forgeCategoriesUsed: new Set(['body', 'mind', 'spirit', 'order', 'creation']),
    };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).not.toContain('fire-balance');
  });

  it('earns return achievement on 1 return', () => {
    const signals = { ...emptySignals, returnCount: 1 };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).toContain('the-return');
  });

  it('earns crown achievement when crown received', () => {
    const signals = { ...emptySignals, crownReceived: true };
    const earned = evaluateAchievements(catalog, signals, CLOCK);
    expect(earned).toContain('the-crown');
  });

  it('is idempotent — same result on repeated call', () => {
    const result1 = evaluateAchievements(catalog, allSignals, CLOCK);
    const result2 = evaluateAchievements(catalog, allSignals, CLOCK);
    expect(result1).toEqual(result2);
  });

  it('earns all achievements with full signals', () => {
    const earned = evaluateAchievements(catalog, allSignals, CLOCK);
    expect(earned).toHaveLength(catalog.length);
  });
});
