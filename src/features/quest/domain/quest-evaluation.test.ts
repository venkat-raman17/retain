import { fixedClock } from '@/shared/lib/clock';

import { evaluateDayQuest, type DayQuestSignals } from './quest-evaluation';
import type { Trial } from '@/content/schemas';

const CLOCK = fixedClock(new Date('2026-01-01T08:00:00Z'));

const baseTrial: Trial = {
  id: 'trial-day-01',
  dayNumber: 1,
  arcNumber: 1,
  name: 'The Covenant',
  tier: 'foundation',
  objectives: [
    { id: 'obj-1', kind: 'reveal_secret', label: 'Reveal teaching', optional: false },
    { id: 'obj-2', kind: 'log_pause', label: 'Observe one urge', optional: false },
  ],
  rewardEmbers: 25,
  rewardKeyId: null,
  flavor: 'The vow is a direction chosen.',
};

const emptySignals: DayQuestSignals = {
  secretRevealed: false,
  forgeActsToday: 0,
  pausesToday: 0,
};

describe('evaluateDayQuest', () => {
  it('not cleared when no objectives met', () => {
    const result = evaluateDayQuest(baseTrial, emptySignals, CLOCK);
    expect(result.cleared).toBe(false);
    expect(result.embers).toBe(0);
    expect(result.objectives.every((o) => !o.complete)).toBe(true);
  });

  it('clears when all required objectives met', () => {
    const signals: DayQuestSignals = {
      ...emptySignals,
      secretRevealed: true,
      pausesToday: 1,
    };
    const result = evaluateDayQuest(baseTrial, signals, CLOCK);
    expect(result.cleared).toBe(true);
    expect(result.embers).toBe(25);
  });

  it('partially complete does not clear', () => {
    const signals: DayQuestSignals = { ...emptySignals, secretRevealed: true };
    const result = evaluateDayQuest(baseTrial, signals, CLOCK);
    expect(result.cleared).toBe(false);
    expect(result.embers).toBe(0);
    expect(result.objectives[0]?.complete).toBe(true);
    expect(result.objectives[1]?.complete).toBe(false);
  });

  it('optional objectives do not block clearing', () => {
    const trialWithOptional: Trial = {
      ...baseTrial,
      objectives: [
        { id: 'obj-1', kind: 'reveal_secret', label: 'Reveal', optional: false },
        { id: 'obj-2', kind: 'forge_act', label: 'Forge', optional: true },
      ],
    };
    const signals: DayQuestSignals = { ...emptySignals, secretRevealed: true };
    const result = evaluateDayQuest(trialWithOptional, signals, CLOCK);
    expect(result.cleared).toBe(true);
    expect(result.objectives[1]?.complete).toBe(false);
  });

  it('every objective kind resolves correctly', () => {
    const allKindsTrial: Trial = {
      ...baseTrial,
      objectives: [
        { id: 'o1', kind: 'reveal_secret', label: 'Secret', optional: false },
        { id: 'o2', kind: 'forge_act', label: 'Forge', optional: false },
        { id: 'o3', kind: 'log_pause', label: 'Pause', optional: false },
      ],
    };
    const signals: DayQuestSignals = {
      secretRevealed: true,
      forgeActsToday: 1,
      pausesToday: 1,
    };
    const result = evaluateDayQuest(allKindsTrial, signals, CLOCK);
    expect(result.cleared).toBe(true);
    expect(result.objectives.map((o) => o.complete)).toEqual([true, true, true]);
  });
});
