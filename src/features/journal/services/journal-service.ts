import type { JournalRepository } from '@/db';
import { err, ok, type Clock, type Result } from '@/shared/lib';

import {
  createJournalEntry,
  type JournalEntry,
  type JournalEntryDraft,
} from '../domain/journal-entry';

/**
 * Orchestrates journal use-cases on top of the repository and domain. Screens
 * call the service (via a hook); the service applies domain rules and persists.
 * It depends on the repository *interface*, so it is unit-testable with a fake.
 */
export class JournalService {
  constructor(
    private readonly repository: JournalRepository,
    private readonly clock: Clock,
  ) {}

  listEntries(limit?: number): Promise<JournalEntry[]> {
    return this.repository.list(limit);
  }

  async addEntry(draft: JournalEntryDraft): Promise<Result<JournalEntry, string>> {
    try {
      const entry = createJournalEntry(draft, this.clock);
      await this.repository.save(entry);
      return ok(entry);
    } catch (error) {
      return err(error instanceof Error ? error.message : 'Could not save this entry.');
    }
  }

  deleteEntry(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
