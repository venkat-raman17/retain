import { fixedClock } from '@/shared/lib';
import { createFakeRepositories } from '@/testing/fakes';

import { JournalService } from './journal-service';

describe('JournalService', () => {
  const clock = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  it('adds an entry and lists it back', async () => {
    const repositories = createFakeRepositories();
    const service = new JournalService(repositories.journal, clock);

    const result = await service.addEntry({ body: 'today I chose focus' });
    expect(result.ok).toBe(true);

    const entries = await service.listEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.body).toBe('today I chose focus');
  });

  it('returns an error result for invalid input instead of throwing', async () => {
    const repositories = createFakeRepositories();
    const service = new JournalService(repositories.journal, clock);

    const result = await service.addEntry({ body: '' });

    expect(result.ok).toBe(false);
    expect(await service.listEntries()).toHaveLength(0);
  });
});
