import { createFakeRepositories } from '@/testing/fakes';
import { fixedClock } from '@/shared/lib';

import { PauseService } from './pause-service';

const CLOCK = fixedClock(new Date('2024-01-15T20:00:00Z'));

describe('PauseService', () => {
  it('records an urge log with the provided draft', async () => {
    const repos = createFakeRepositories();
    const service = new PauseService(repos.urge, CLOCK);

    const log = await service.recordUrge({
      triggerType: 'boredom',
      intensityBefore: 4,
      intensityAfter: 2,
      completedPauseTimerSeconds: 180,
      selectedResponse: '20 push-ups',
      note: null,
    });

    expect(log.triggerType).toBe('boredom');
    expect(log.intensityBefore).toBe(4);
    expect(log.intensityAfter).toBe(2);
    expect(log.completedPauseTimerSeconds).toBe(180);
    expect(log.selectedResponse).toBe('20 push-ups');
  });

  it('persists the urge log', async () => {
    const repos = createFakeRepositories();
    const service = new PauseService(repos.urge, CLOCK);

    await service.recordUrge({ intensityBefore: 5, triggerType: 'stress' });
    const logs = await service.listRecent();

    expect(logs).toHaveLength(1);
    expect(logs[0]?.triggerType).toBe('stress');
  });

  it('returns recent urge logs', async () => {
    const repos = createFakeRepositories();
    const service = new PauseService(repos.urge, CLOCK);

    await service.recordUrge({ intensityBefore: 4, triggerType: 'lust' });
    await service.recordUrge({ intensityBefore: 3, triggerType: 'loneliness' });

    const logs = await service.listRecent(10);
    expect(logs).toHaveLength(2);
  });

  it('handles an urge with no intensity after (ride-out without logging after)', async () => {
    const repos = createFakeRepositories();
    const service = new PauseService(repos.urge, CLOCK);

    const log = await service.recordUrge({
      triggerType: 'habit',
      intensityBefore: 5,
      intensityAfter: null,
    });

    expect(log.intensityAfter).toBeNull();
  });
});
