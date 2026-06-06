import { journalEntrySchema, type JournalEntry } from '@/features/journal/domain/journal-entry';

import type { AppDatabase } from '../database';

/**
 * Port: how the rest of the app reads and writes journal entries. Screens and
 * services depend on this interface; the SQLite implementation below is the only
 * code that knows about tables and SQL.
 */
export interface JournalRepository {
  list(limit?: number): Promise<JournalEntry[]>;
  getById(id: string): Promise<JournalEntry | null>;
  save(entry: JournalEntry): Promise<void>;
  remove(id: string): Promise<void>;
  count(): Promise<number>;
}

interface JournalRow {
  id: string;
  created_at: string;
  updated_at: string;
  kind: string;
  mood: number | null;
  energy: number | null;
  body: string;
  tags: string;
}

function toEntry(row: JournalRow): JournalEntry {
  return journalEntrySchema.parse({
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    kind: row.kind,
    mood: row.mood,
    energy: row.energy,
    body: row.body,
    tags: JSON.parse(row.tags) as unknown,
  });
}

export class SqliteJournalRepository implements JournalRepository {
  constructor(private readonly db: AppDatabase) {}

  async list(limit = 100): Promise<JournalEntry[]> {
    const rows = await this.db.getAll<JournalRow>(
      'SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT ?;',
      [limit],
    );
    return rows.map(toEntry);
  }

  async getById(id: string): Promise<JournalEntry | null> {
    const row = await this.db.getFirst<JournalRow>(
      'SELECT * FROM journal_entries WHERE id = ?;',
      [id],
    );
    return row ? toEntry(row) : null;
  }

  async save(entry: JournalEntry): Promise<void> {
    await this.db.run(
      `INSERT INTO journal_entries (id, created_at, updated_at, kind, mood, energy, body, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         updated_at = excluded.updated_at,
         kind = excluded.kind,
         mood = excluded.mood,
         energy = excluded.energy,
         body = excluded.body,
         tags = excluded.tags;`,
      [
        entry.id,
        entry.createdAt,
        entry.updatedAt,
        entry.kind,
        entry.mood,
        entry.energy,
        entry.body,
        JSON.stringify(entry.tags),
      ],
    );
  }

  async remove(id: string): Promise<void> {
    await this.db.run('DELETE FROM journal_entries WHERE id = ?;', [id]);
  }

  async count(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>(
      'SELECT COUNT(*) AS n FROM journal_entries;',
    );
    return row?.n ?? 0;
  }
}
