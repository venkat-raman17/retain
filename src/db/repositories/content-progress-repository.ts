import {
  contentProgressSchema,
  type ContentProgress,
  type ContentStatus,
  type ContentType,
} from '@/features/codex/domain/content-progress';
import { createId } from '@/shared/lib';

import type { AppDatabase } from '../database';
import { parseRows } from './parse-rows';

export interface ContentProgressRepository {
  get(contentType: ContentType, contentId: string): Promise<ContentProgress | null>;
  markStatus(
    contentType: ContentType,
    contentId: string,
    status: ContentStatus,
    at: string,
  ): Promise<ContentProgress>;
  list(): Promise<ContentProgress[]>;
  countCompleted(): Promise<number>;
}

interface ProgressRow {
  id: string;
  content_id: string;
  content_type: string;
  status: string;
  first_opened_at: string | null;
  completed_at: string | null;
}

function toProgress(row: ProgressRow): ContentProgress {
  return contentProgressSchema.parse({
    id: row.id,
    contentId: row.content_id,
    contentType: row.content_type,
    status: row.status,
    firstOpenedAt: row.first_opened_at,
    completedAt: row.completed_at,
  });
}

export class SqliteContentProgressRepository implements ContentProgressRepository {
  constructor(private readonly db: AppDatabase) {}

  async get(contentType: ContentType, contentId: string): Promise<ContentProgress | null> {
    const row = await this.db.getFirst<ProgressRow>(
      'SELECT * FROM content_progress WHERE content_type = ? AND content_id = ?;',
      [contentType, contentId],
    );
    return row ? toProgress(row) : null;
  }

  async markStatus(
    contentType: ContentType,
    contentId: string,
    status: ContentStatus,
    at: string,
  ): Promise<ContentProgress> {
    const existing = await this.get(contentType, contentId);
    const firstOpenedAt = existing?.firstOpenedAt ?? (status === 'unread' ? null : at);
    const completedAt =
      status === 'completed' ? (existing?.completedAt ?? at) : (existing?.completedAt ?? null);

    const next = contentProgressSchema.parse({
      id: existing?.id ?? createId(),
      contentId,
      contentType,
      status,
      firstOpenedAt,
      completedAt,
    });

    await this.db.run(
      `INSERT INTO content_progress (id, content_id, content_type, status, first_opened_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(content_type, content_id) DO UPDATE SET
         status = excluded.status, first_opened_at = excluded.first_opened_at,
         completed_at = excluded.completed_at;`,
      [next.id, next.contentId, next.contentType, next.status, next.firstOpenedAt, next.completedAt],
    );
    return next;
  }

  async list(): Promise<ContentProgress[]> {
    const rows = await this.db.getAll<ProgressRow>('SELECT * FROM content_progress;');
    return parseRows('content_progress', rows, toProgress);
  }

  async countCompleted(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>(
      "SELECT COUNT(*) AS n FROM content_progress WHERE status = 'completed';",
    );
    return row?.n ?? 0;
  }
}
