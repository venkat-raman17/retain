import { fixedClock } from '@/shared/lib';

import { createJournalEntry, journalEntrySchema } from './journal-entry';

describe('journal-entry', () => {
  const clock = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  it('creates a valid entry from a minimal draft', () => {
    const entry = createJournalEntry({ body: '  a quiet reflection  ' }, clock);

    expect(entry.kind).toBe('reflection');
    expect(entry.body).toBe('a quiet reflection');
    expect(entry.tags).toEqual([]);
    expect(entry.createdAt).toBe('2026-06-06T12:00:00.000Z');
    expect(() => journalEntrySchema.parse(entry)).not.toThrow();
  });

  it('rejects an empty body', () => {
    expect(() => createJournalEntry({ body: '   ' }, clock)).toThrow();
  });
});
