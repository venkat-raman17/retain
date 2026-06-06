import { forgeActSchema, type ForgeAct, type ForgeCategory } from '@/features/forge/domain/forge-act';

import type { AppDatabase } from '../database';

export interface ForgeCategoryCount {
  category: string;
  count: number;
}

export interface ForgeRepository {
  add(act: ForgeAct): Promise<void>;
  list(limit?: number): Promise<ForgeAct[]>;
  listByCategory(category: ForgeCategory, limit?: number): Promise<ForgeAct[]>;
  count(): Promise<number>;
  countSince(iso: string): Promise<number>;
  categoryCounts(): Promise<ForgeCategoryCount[]>;
}

interface ForgeRow {
  id: string;
  occurred_at: string;
  category: string;
  title: string;
  duration_minutes: number | null;
  linked_urge_id: string | null;
  note: string | null;
}

function toAct(row: ForgeRow): ForgeAct {
  return forgeActSchema.parse({
    id: row.id,
    occurredAt: row.occurred_at,
    category: row.category,
    title: row.title,
    durationMinutes: row.duration_minutes,
    linkedUrgeId: row.linked_urge_id,
    note: row.note,
  });
}

export class SqliteForgeRepository implements ForgeRepository {
  constructor(private readonly db: AppDatabase) {}

  async add(act: ForgeAct): Promise<void> {
    await this.db.run(
      `INSERT INTO forge_acts
         (id, occurred_at, category, title, duration_minutes, linked_urge_id, note)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [act.id, act.occurredAt, act.category, act.title, act.durationMinutes, act.linkedUrgeId, act.note],
    );
  }

  async list(limit = 100): Promise<ForgeAct[]> {
    const rows = await this.db.getAll<ForgeRow>(
      'SELECT * FROM forge_acts ORDER BY occurred_at DESC LIMIT ?;',
      [limit],
    );
    return rows.map(toAct);
  }

  async listByCategory(category: ForgeCategory, limit = 100): Promise<ForgeAct[]> {
    const rows = await this.db.getAll<ForgeRow>(
      'SELECT * FROM forge_acts WHERE category = ? ORDER BY occurred_at DESC LIMIT ?;',
      [category, limit],
    );
    return rows.map(toAct);
  }

  async count(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>('SELECT COUNT(*) AS n FROM forge_acts;');
    return row?.n ?? 0;
  }

  async countSince(iso: string): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>(
      'SELECT COUNT(*) AS n FROM forge_acts WHERE occurred_at >= ?;',
      [iso],
    );
    return row?.n ?? 0;
  }

  async categoryCounts(): Promise<ForgeCategoryCount[]> {
    return this.db.getAll<ForgeCategoryCount>(
      'SELECT category, COUNT(*) AS count FROM forge_acts GROUP BY category ORDER BY count DESC;',
    );
  }
}
