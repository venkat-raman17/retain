import { createFakeRepositories } from '@/testing/fakes';
import { fixedClock } from '@/shared/lib';

import { QuestService } from './quest-service';

const CLOCK = fixedClock(new Date('2026-01-01T08:00:00Z'));

function makeService() {
  const repos = createFakeRepositories();
  const service = new QuestService(repos.forge, repos.urge, repos.contentProgress, CLOCK);
  return { repos, service };
}

describe('QuestService.getRecentQuests', () => {
  it('returns the current day plus prior days, newest first', async () => {
    const { service } = makeService();

    const quests = await service.getRecentQuests(5, 3);

    expect(quests.map((q) => q.trial.dayNumber)).toEqual([5, 4, 3]);
  });

  it('does not walk before day 1', async () => {
    const { service } = makeService();

    const quests = await service.getRecentQuests(2, 5);

    expect(quests.map((q) => q.trial.dayNumber)).toEqual([2, 1]);
  });

  it('reflects logged signals per day (no acts → not cleared)', async () => {
    const { service } = makeService();

    const quests = await service.getRecentQuests(3, 3);

    expect(quests.every((q) => !q.cleared)).toBe(true);
  });
});
