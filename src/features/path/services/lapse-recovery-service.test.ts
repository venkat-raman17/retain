import { fixedClock } from '@/shared/lib';
import { createFakeRepositories } from '@/testing/fakes';

import { LapseRecoveryService } from './lapse-recovery-service';
import { PathService } from './path-service';

describe('LapseRecoveryService', () => {
  it('resets the current path on a lapse but preserves practice history', async () => {
    const repositories = createFakeRepositories();
    const startClock = fixedClock(new Date('2026-06-01T00:00:00.000Z'));
    const lapseClock = fixedClock(new Date('2026-06-06T00:00:00.000Z'));

    const pathService = new PathService(repositories.profile, repositories.path, startClock);
    await pathService.startPath();

    const before = await repositories.profile.get();
    expect(before.currentPathStartedAt).not.toBeNull();
    expect(before.pathStartedAt).not.toBeNull();

    const recovery = new LapseRecoveryService(
      repositories.profile,
      repositories.path,
      repositories.lapse,
      lapseClock,
    );
    await recovery.recordLapse({ lesson: 'noticed the trigger early' });

    const after = await repositories.profile.get();
    // current path is reset...
    expect(after.currentPathStartedAt).toBeNull();
    // ...but the first-ever start and history are preserved.
    expect(after.pathStartedAt).toBe(before.pathStartedAt);
    expect(await repositories.lapse.count()).toBe(1);
    expect(await repositories.path.countByType('lapse_recorded')).toBe(1);
  });

  it('restarts the current path on a return', async () => {
    const repositories = createFakeRepositories();
    const clock = fixedClock(new Date('2026-06-07T00:00:00.000Z'));
    const recovery = new LapseRecoveryService(
      repositories.profile,
      repositories.path,
      repositories.lapse,
      clock,
    );

    const profile = await recovery.recordReturn();

    expect(profile.currentPathStartedAt).toBe('2026-06-07T00:00:00.000Z');
    expect(await repositories.path.countByType('return_recorded')).toBe(1);
  });
});
