import { createFakeRepositories } from '@/testing/fakes';
import { fixedClock } from '@/shared/lib';

import { DailyPathService } from './daily-path-service';
import { PathService } from './path-service';

const DAY_1_CLOCK = fixedClock(new Date('2024-01-15T10:00:00Z')); // Day 1
const DAY_7_CLOCK = fixedClock(new Date('2024-01-21T10:00:00Z')); // Day 7 (started Jan 15)
const DAY_90_CLOCK = fixedClock(new Date('2024-04-13T10:00:00Z')); // Day 90

function makeService(clock = DAY_1_CLOCK) {
  const repos = createFakeRepositories();
  const service = new DailyPathService(repos.profile, repos.path, repos.contentProgress, clock);
  const pathService = new PathService(repos.profile, repos.path, clock);
  return { repos, service, pathService };
}

describe('DailyPathService — unlock states', () => {
  it('locks future days', async () => {
    const { service, repos } = makeService(DAY_7_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();

    const state = service.getUnlockState(
      14,
      7,
      await repos.profile.get(),
    );
    expect(state).toBe('locked');
  });

  it('marks today as available_today', async () => {
    const { service, repos } = makeService(DAY_7_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();

    const profile = await repos.profile.get();
    const currentDay = service.getCurrentDay(profile);
    const state = service.getUnlockState(currentDay, currentDay, profile);
    expect(state).toBe('available_today');
  });

  it('marks past days as revisit', async () => {
    const { service, repos } = makeService(DAY_7_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();

    const profile = await repos.profile.get();
    const currentDay = service.getCurrentDay(profile);
    const state = service.getUnlockState(1, currentDay, profile);
    expect(state).toBe('revisit');
  });
});

describe('DailyPathService — progress tracking', () => {
  it('marks day opened', async () => {
    const { service } = makeService();
    await service.markDayOpened(1);
    const completed = await service.getCompletedDays();
    expect(completed).not.toContain(1);
  });

  it('marks day completed', async () => {
    const { service } = makeService();
    await service.markDayCompleted(1);
    const completed = await service.getCompletedDays();
    expect(completed).toContain(1);
  });

  it('collects crown fragments from completed days', async () => {
    const { service } = makeService();
    await service.markDayCompleted(1); // Day 1 has a crown fragment
    await service.markDayCompleted(7); // Day 7 has a crown fragment

    const fragments = await service.getCollectedCrownFragments();
    expect(fragments.length).toBeGreaterThanOrEqual(1);
    expect(typeof fragments[0]).toBe('string');
  });

  it('persists a revealed secret and does not downgrade it on re-open', async () => {
    const { service } = makeService();
    await service.markDayOpened(5);
    await service.markDaySecretRevealed(5);
    expect(await service.getDayProgressStatus(5)).toBe('revealed');
    // Re-opening writes 'opened' but must not undo the reveal.
    await service.markDayOpened(5);
    expect(await service.getDayProgressStatus(5)).toBe('revealed');
  });

  it('keeps a completed day completed when revisited (no re-asking)', async () => {
    const { service } = makeService();
    await service.markDayCompleted(7);
    // Revisiting a finished day must not silently un-complete it.
    await service.markDayOpened(7);
    await service.markDaySecretRevealed(7);
    expect(await service.getDayProgressStatus(7)).toBe('completed');
    expect(await service.getCompletedDays()).toContain(7);
  });
});

describe('DailyPathService — Crown', () => {
  it('isCrownUnlocked returns false before Day 90', async () => {
    const { service, repos } = makeService(DAY_7_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();
    const profile = await repos.profile.get();
    const day = service.getCurrentDay(profile);
    expect(service.isCrownUnlocked(profile, day)).toBe(false);
  });

  it('receiveCrown sets phase to crowned_long_path', async () => {
    const { service, repos } = makeService(DAY_90_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();

    const updated = await service.receiveCrown();
    expect(updated.currentPathPhase).toBe('crowned_long_path');
    expect(updated.crownReceivedAt).not.toBeNull();
    expect(updated.longPathStartedAt).not.toBeNull();
  });

  it('receiveCrown emits crown_received path event', async () => {
    const { service, repos } = makeService(DAY_90_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();

    await service.receiveCrown();
    const events = await repos.path.listEvents();
    expect(events.some((e) => e.type === 'crown_received')).toBe(true);
  });

  it('all 90 days show revisit after Crown received', async () => {
    const { service, repos } = makeService(DAY_90_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();
    await service.receiveCrown();

    const profile = await repos.profile.get();
    for (let d = 1; d <= 90; d++) {
      const state = service.getUnlockState(d, 90, profile);
      expect(state).toBe('revisit');
    }
  });
});

describe('DailyPathService — lapse behavior', () => {
  it('lapse before Crown resets current day', async () => {
    const { service, repos } = makeService(DAY_7_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();

    // Record a lapse
    await repos.profile.update({ currentPathStartedAt: null });
    const profile = await repos.profile.get();
    expect(service.getCurrentDay(profile)).toBe(0);
  });

  it('recordPostCrownLapse does not reset Crown status', async () => {
    const { service, repos } = makeService(DAY_90_CLOCK);
    const startClock = fixedClock(new Date('2024-01-15T10:00:00Z'));
    await new PathService(repos.profile, repos.path, startClock).startPath();
    await service.receiveCrown();

    await service.recordPostCrownLapse();
    const profile = await repos.profile.get();
    expect(profile.currentPathPhase).toBe('crowned_long_path');
    expect(profile.crownReceivedAt).not.toBeNull();
  });
});
