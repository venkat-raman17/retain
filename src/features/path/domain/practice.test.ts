import { fixedClock } from '@/shared/lib';

import { currentPathDay, daysSince, isPathRunning } from './practice';
import { DEFAULT_PROFILE, userProfileSchema } from './user-profile';

function profileWith(currentPathStartedAt: string | null) {
  return userProfileSchema.parse({
    ...DEFAULT_PROFILE,
    currentPathStartedAt,
    createdAt: '1970-01-01T00:00:00.000Z',
    updatedAt: '1970-01-01T00:00:00.000Z',
  });
}

describe('practice day counting', () => {
  const now = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  it('is day 0 and not running when no path has started', () => {
    const profile = profileWith(null);
    expect(currentPathDay(profile, now)).toBe(0);
    expect(isPathRunning(profile)).toBe(false);
  });

  it('is day 1 on the day a path begins', () => {
    const profile = profileWith('2026-06-06T08:00:00.000Z');
    expect(currentPathDay(profile, now)).toBe(1);
    expect(isPathRunning(profile)).toBe(true);
  });

  it('counts each elapsed day (1-indexed for display)', () => {
    const profile = profileWith('2026-06-01T08:00:00.000Z');
    expect(daysSince('2026-06-01T08:00:00.000Z', now)).toBe(5);
    expect(currentPathDay(profile, now)).toBe(6);
  });
});
