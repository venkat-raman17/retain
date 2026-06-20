import { getDailyPathContent } from '@/content';
import { fixedClock, type Clock } from '@/shared/lib';
import { createFakeRepositories } from '@/testing/fakes';

import { DailyBriefService } from './daily-brief-service';
import { PathService } from './path-service';

async function startedService(clock: Clock): Promise<DailyBriefService> {
  const repos = createFakeRepositories();
  await new PathService(repos.profile, repos.path, clock).startPath();
  return new DailyBriefService(repos.profile, clock);
}

describe('DailyBriefService', () => {
  it('reports not running before the path begins, but still rotates a teaching', async () => {
    const repos = createFakeRepositories();
    const service = new DailyBriefService(repos.profile, fixedClock(new Date('2024-01-15T09:00:00')));
    const brief = await service.getDailyBrief();
    expect(brief.running).toBe(false);
    expect(brief.day).toBe(0);
    expect(brief.focus).toBeNull();
    expect(brief.teaching).not.toBeNull();
  });

  it('surfaces the morning command on day 1', async () => {
    const service = await startedService(fixedClock(new Date('2024-01-15T09:00:00')));
    const brief = await service.getDailyBrief();
    expect(brief.running).toBe(true);
    expect(brief.day).toBe(1);
    expect(brief.timeOfDay).toBe('morning');
    expect(brief.focus?.label).toBe('This morning');
    expect(brief.focus?.body).toBe(getDailyPathContent(1)?.command);
  });

  it('carries the day archetype + invocation so the home can lead with it', async () => {
    const service = await startedService(fixedClock(new Date('2024-01-15T09:00:00')));
    const brief = await service.getDailyBrief();
    expect(brief.archetype).toBe(getDailyPathContent(1)?.archetype);
    expect(brief.archetypeName).toBeTruthy();
    expect(brief.invocation).toBe(getDailyPathContent(1)?.invocation);
  });

  it('surfaces the evening account in the evening', async () => {
    const service = await startedService(fixedClock(new Date('2024-01-15T19:00:00')));
    const brief = await service.getDailyBrief();
    expect(brief.timeOfDay).toBe('evening');
    expect(brief.focus?.label).toBe('Tonight');
    expect(brief.focus?.body).toBe(getDailyPathContent(1)?.eveningAccount);
  });

  it('changes the focus body across the day', async () => {
    const morning = await (await startedService(fixedClock(new Date('2024-01-15T09:00:00')))).getDailyBrief();
    const evening = await (await startedService(fixedClock(new Date('2024-01-15T19:00:00')))).getDailyBrief();
    expect(morning.focus?.body).not.toBe(evening.focus?.body);
  });

  it('surfaces a Long Path touchpoint once the Crown is received', async () => {
    const repos = createFakeRepositories();
    const clock = fixedClock(new Date('2024-04-15T09:00:00'));
    await new PathService(repos.profile, repos.path, clock).startPath();
    await repos.profile.update({
      currentPathPhase: 'crowned_long_path',
      longPathStartedAt: new Date('2024-04-10T09:00:00').toISOString(),
    });
    const brief = await new DailyBriefService(repos.profile, clock).getDailyBrief();
    expect(brief.isLongPath).toBe(true);
    expect(brief.longPathTouchpoint).toBeTruthy();
    expect(brief.arcTitle).toBe('Long Path');
  });
});
