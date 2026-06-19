import { boundarySchema, type Boundary } from '@/features/boundaries/domain/boundary';
import {
  boundaryCheckinSchema,
  type BoundaryCheckin,
} from '@/features/boundaries/domain/boundary-checkin';

import type { AppDatabase } from '../database';
import { parseRows } from './parse-rows';

export interface BoundaryRepository {
  list(activeOnly?: boolean): Promise<Boundary[]>;
  getById(id: string): Promise<Boundary | null>;
  save(boundary: Boundary): Promise<void>;
  setActive(id: string, isActive: boolean, updatedAt: string): Promise<void>;
  remove(id: string): Promise<void>;
  addCheckin(checkin: BoundaryCheckin): Promise<void>;
  listCheckins(boundaryId: string, limit?: number): Promise<BoundaryCheckin[]>;
  countCheckinsSince(iso: string): Promise<number>;
  countKeptCheckinsSince(iso: string): Promise<number>;
}

interface BoundaryRow {
  id: string;
  title: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CheckinRow {
  id: string;
  boundary_id: string;
  checked_at: string;
  status: string;
  note: string | null;
}

function toBoundary(row: BoundaryRow): Boundary {
  return boundarySchema.parse({
    id: row.id,
    title: row.title,
    description: row.description,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toCheckin(row: CheckinRow): BoundaryCheckin {
  return boundaryCheckinSchema.parse({
    id: row.id,
    boundaryId: row.boundary_id,
    checkedAt: row.checked_at,
    status: row.status,
    note: row.note,
  });
}

export class SqliteBoundaryRepository implements BoundaryRepository {
  constructor(private readonly db: AppDatabase) {}

  async list(activeOnly = false): Promise<Boundary[]> {
    const rows = await this.db.getAll<BoundaryRow>(
      activeOnly
        ? 'SELECT * FROM boundaries WHERE is_active = 1 ORDER BY created_at ASC;'
        : 'SELECT * FROM boundaries ORDER BY created_at ASC;',
    );
    return parseRows('boundaries', rows, toBoundary);
  }

  async getById(id: string): Promise<Boundary | null> {
    const row = await this.db.getFirst<BoundaryRow>('SELECT * FROM boundaries WHERE id = ?;', [id]);
    return row ? toBoundary(row) : null;
  }

  async save(boundary: Boundary): Promise<void> {
    await this.db.run(
      `INSERT INTO boundaries (id, title, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title, description = excluded.description,
         is_active = excluded.is_active, updated_at = excluded.updated_at;`,
      [
        boundary.id,
        boundary.title,
        boundary.description,
        boundary.isActive ? 1 : 0,
        boundary.createdAt,
        boundary.updatedAt,
      ],
    );
  }

  async setActive(id: string, isActive: boolean, updatedAt: string): Promise<void> {
    await this.db.run('UPDATE boundaries SET is_active = ?, updated_at = ? WHERE id = ?;', [
      isActive ? 1 : 0,
      updatedAt,
      id,
    ]);
  }

  async remove(id: string): Promise<void> {
    await this.db.run('DELETE FROM boundaries WHERE id = ?;', [id]);
  }

  async addCheckin(checkin: BoundaryCheckin): Promise<void> {
    await this.db.run(
      'INSERT INTO boundary_checkins (id, boundary_id, checked_at, status, note) VALUES (?, ?, ?, ?, ?);',
      [checkin.id, checkin.boundaryId, checkin.checkedAt, checkin.status, checkin.note],
    );
  }

  async listCheckins(boundaryId: string, limit = 100): Promise<BoundaryCheckin[]> {
    const rows = await this.db.getAll<CheckinRow>(
      'SELECT * FROM boundary_checkins WHERE boundary_id = ? ORDER BY checked_at DESC LIMIT ?;',
      [boundaryId, limit],
    );
    return parseRows('boundary_checkins', rows, toCheckin);
  }

  async countCheckinsSince(iso: string): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>(
      'SELECT COUNT(*) AS n FROM boundary_checkins WHERE checked_at >= ?;',
      [iso],
    );
    return row?.n ?? 0;
  }

  async countKeptCheckinsSince(iso: string): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>(
      "SELECT COUNT(*) AS n FROM boundary_checkins WHERE status = 'kept' AND checked_at >= ?;",
      [iso],
    );
    return row?.n ?? 0;
  }
}
