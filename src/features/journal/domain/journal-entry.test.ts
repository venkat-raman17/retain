import { fixedClock } from '@/shared/lib';

import { createJournalEntry, journalEntrySchema } from './journal-entry';

describe('journal-entry', () => {
  const clock = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  it('creates a valid entry from a minimal draft', () => {
    const entry = createJournalEntry({ body: '  a quiet reflection  ' }, clock);

    expect(entry.type).toBe('freeform');
    expect(entry.body).toBe('a quiet reflection');
    expect(entry.mood).toBeNull();
    expect(entry.createdAt).toBe('2026-06-06T12:00:00.000Z');
    expect(() => journalEntrySchema.parse(entry)).not.toThrow();
  });

  it('keeps the chosen type and mood', () => {
    const entry = createJournalEntry({ type: 'lapse', body: 'what I learned', mood: 3 }, clock);
    expect(entry.type).toBe('lapse');
    expect(entry.mood).toBe(3);
  });

  it('rejects an empty body', () => {
    expect(() => createJournalEntry({ body: '   ' }, clock)).toThrow();
  });
});
