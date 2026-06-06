import {
  journalEntrySchema,
  type JournalEntry,
  type JournalType,
} from '@/features/journal/domain/journal-entry';

import type { AppDatabase } from '../database';
import { parseRows } from './parse-rows';

export interface JournalRepository {
  list(limit?: number): Promise<JournalEntry[]>;
  listByType(type: JournalType, limit?: number): Promise<JournalEntry[]>;
  getById(id: string): Promise<JournalEntry | null>;
  save(entry: JournalEntry): Promise<void>;
  remove(id: string): Promise<void>;
  count(): Promise<number>;
}

interface JournalRow {
  id: string;
  created_at: string;
  updated_at: string;
  type: string;
  prompt_id: string | null;
  title: string | null;
  body: string;
  mood: number | null;
}

function toEntry(row: JournalRow): JournalEntry {
  return journalEntrySchema.parse({
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    type: row.type,
    promptId: row.prompt_id,
    title: row.title,
    body: row.body,
    mood: row.mood,
  });
}

export class SqliteJournalRepository implements JournalRepository {
  constructor(private readonly db: AppDatabase) {}

  async list(limit = 100): Promise<JournalEntry[]> {
    const rows = await this.db.getAll<JournalRow>(
      'SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT ?;',
      [limit],
    );
    return parseRows('journal_entries', rows, toEntry);
  }

  async listByType(type: JournalType, limit = 100): Promise<JournalEntry[]> {
    const rows = await this.db.getAll<JournalRow>(
      'SELECT * FROM journal_entries WHERE type = ? ORDER BY created_at DESC LIMIT ?;',
      [type, limit],
    );
    return parseRows('journal_entries', rows, toEntry);
  }

  async getById(id: string): Promise<JournalEntry | null> {
    const row = await this.db.getFirst<JournalRow>('SELECT * FROM journal_entries WHERE id = ?;', [
      id,
    ]);
    return row ? toEntry(row) : null;
  }

  async save(entry: JournalEntry): Promise<void> {
    await this.db.run(
      `INSERT INTO journal_entries (id, created_at, updated_at, type, prompt_id, title, body, mood)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         updated_at = excluded.updated_at, type = excluded.type, prompt_id = excluded.prompt_id,
         title = excluded.title, body = excluded.body, mood = excluded.mood;`,
      [
        entry.id,
        entry.createdAt,
        entry.updatedAt,
        entry.type,
        entry.promptId,
        entry.title,
        entry.body,
        entry.mood,
      ],
    );
  }

  async remove(id: string): Promise<void> {
    await this.db.run('DELETE FROM journal_entries WHERE id = ?;', [id]);
  }

  async count(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>('SELECT COUNT(*) AS n FROM journal_entries;');
    return row?.n ?? 0;
  }
}
