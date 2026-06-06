import { fixedClock } from '@/shared/lib';

import {
  currentStreakDays,
  initialPracticeState,
  registerReset,
  startStreak,
} from './practice-state';

describe('practice-state', () => {
  const now = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  it('starts with no running streak', () => {
    const state = initialPracticeState(now);
    expect(state.currentStreakStart).toBeNull();
    expect(currentStreakDays(state, now)).toBe(0);
  });

  it('counts whole days since the streak began', () => {
    const begin = fixedClock(new Date('2026-06-01T08:00:00.000Z'));
    const state = startStreak(initialPracticeState(begin), begin);
    expect(currentStreakDays(state, now)).toBe(5);
  });

  it('treats a reset as recovery: keeps best streak, clears the run, counts it', () => {
    const begin = fixedClock(new Date('2026-06-01T00:00:00.000Z'));
    const running = startStreak(initialPracticeState(begin), begin);

    const afterReset = registerReset(running, now);

    expect(afterReset.currentStreakStart).toBeNull();
    expect(afterReset.bestStreakDays).toBe(5);
    expect(afterReset.totalResets).toBe(1);
  });
});
