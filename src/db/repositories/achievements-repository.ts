import type { AppDatabase } from '../database';
import { parseRows } from './parse-rows';
import { z } from 'zod';
import { createId } from '@/shared/lib';

const earnedSchema = z.object({
  id: z.string().min(1),
  achievementId: z.string().min(1),
  earnedAt: z.string().datetime(),
});
export type EarnedAchievement = z.infer<typeof earnedSchema>;

export interface AchievementsRepository {
  /** Idempotent — silently no-ops if already earned. */
  markEarned(achievementId: string, at: string): Promise<void>;
  getEarned(): Promise<EarnedAchievement[]>;
  isEarned(achievementId: string): Promise<boolean>;
  /** Returns newly-earned ids among the candidates (those not yet in DB). */
  filterNotYetEarned(achievementIds: string[]): Promise<string[]>;
}

interface EarnedRow {
  id: string;
  achievement_id: string;
  earned_at: string;
}

function toEarned(row: EarnedRow): EarnedAchievement {
  return earnedSchema.parse({
    id: row.id,
    achievementId: row.achievement_id,
    earnedAt: row.earned_at,
  });
}

export class SqliteAchievementsRepository implements AchievementsRepository {
  constructor(private readonly db: AppDatabase) {}

  async markEarned(achievementId: string, at: string): Promise<void> {
    await this.db.run(
      `INSERT INTO achievements_earned (id, achievement_id, earned_at)
       VALUES (?, ?, ?)
       ON CONFLICT (achievement_id) DO NOTHING;`,
      [createId(), achievementId, at],
    );
  }

  async getEarned(): Promise<EarnedAchievement[]> {
    const rows = await this.db.getAll<EarnedRow>(
      'SELECT * FROM achievements_earned ORDER BY earned_at DESC;',
    );
    return parseRows('achievements_earned', rows, toEarned);
  }

  async isEarned(achievementId: string): Promise<boolean> {
    const row = await this.db.getFirst<{ n: number }>(
      'SELECT COUNT(*) AS n FROM achievements_earned WHERE achievement_id = ?;',
      [achievementId],
    );
    return (row?.n ?? 0) > 0;
  }

  async filterNotYetEarned(achievementIds: string[]): Promise<string[]> {
    if (achievementIds.length === 0) return [];
    const earned = await this.getEarned();
    const earnedSet = new Set(earned.map((e) => e.achievementId));
    return achievementIds.filter((id) => !earnedSet.has(id));
  }
}
