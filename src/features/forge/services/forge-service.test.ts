import { createFakeRepositories } from '@/testing/fakes';
import { fixedClock } from '@/shared/lib';

import { ForgeService } from './forge-service';

const CLOCK = fixedClock(new Date('2024-01-15T08:00:00Z'));

describe('ForgeService', () => {
  it('logs a forge act', async () => {
    const repos = createFakeRepositories();
    const service = new ForgeService(repos.forge, CLOCK);

    const act = await service.logAct({
      category: 'body',
      title: 'Morning run',
      durationMinutes: 30,
      linkedUrgeId: null,
      note: null,
    });

    expect(act.category).toBe('body');
    expect(act.title).toBe('Morning run');
    expect(act.durationMinutes).toBe(30);
  });

  it('persists the act', async () => {
    const repos = createFakeRepositories();
    const service = new ForgeService(repos.forge, CLOCK);

    await service.logAct({ category: 'mind', title: 'Read for 1 hour' });
    const acts = await service.listRecent(10);

    expect(acts).toHaveLength(1);
    expect(acts[0]?.title).toBe('Read for 1 hour');
  });

  it('reports category counts', async () => {
    const repos = createFakeRepositories();
    const service = new ForgeService(repos.forge, CLOCK);

    await service.logAct({ category: 'body', title: 'Push-ups' });
    await service.logAct({ category: 'body', title: 'Squat' });
    await service.logAct({ category: 'mind', title: 'Study' });

    const counts = await service.categoryCounts();
    const bodyCounts = counts.find((c) => c.category === 'body');
    expect(bodyCounts?.count).toBe(2);
  });

  it('links a forge act to an urge log', async () => {
    const repos = createFakeRepositories();
    const service = new ForgeService(repos.forge, CLOCK);

    const act = await service.logAct({
      category: 'creation',
      title: 'Build the project',
      linkedUrgeId: 'urge-abc-123',
    });

    expect(act.linkedUrgeId).toBe('urge-abc-123');
  });
});
