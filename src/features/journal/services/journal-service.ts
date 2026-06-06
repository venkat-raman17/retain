import type { JournalRepository } from '@/db';
import { err, ok, type Clock, type Result } from '@/shared/lib';

import {
  createJournalEntry,
  updateJournalEntry,
  type JournalEntry,
  type JournalEntryDraft,
  type JournalType,
} from '../domain/journal-entry';

export interface JournalEntryEdit {
  title?: string | null;
  body?: string;
  mood?: number | null;
}

/**
 * Orchestrates journal use-cases on top of the repository and domain. Depends on
 * the repository *interface*, so it is unit-testable with an in-memory fake.
 */
export class JournalService {
  constructor(
    private readonly repository: JournalRepository,
    private readonly clock: Clock,
  ) {}

  listEntries(limit?: number): Promise<JournalEntry[]> {
    return this.repository.list(limit);
  }

  listByType(type: JournalType, limit?: number): Promise<JournalEntry[]> {
    return this.repository.listByType(type, limit);
  }

  getEntry(id: string): Promise<JournalEntry | null> {
    return this.repository.getById(id);
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

  async editEntry(entry: JournalEntry, patch: JournalEntryEdit): Promise<Result<JournalEntry, string>> {
    try {
      const next = updateJournalEntry(entry, patch, this.clock);
      await this.repository.save(next);
      return ok(next);
    } catch (error) {
      return err(error instanceof Error ? error.message : 'Could not update this entry.');
    }
  }

  deleteEntry(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
