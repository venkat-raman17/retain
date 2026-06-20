import type {
  AchievementsRepository,
  ContentProgressRepository,
  EarnedAchievement,
  ForgeCategoryCount,
  ForgeRepository,
  LapseRepository,
  PathRepository,
  Repositories,
  SettingsRepository,
  UrgeRepository,
  UserProfileRepository,
} from '@/db';
import {
  contentProgressSchema,
  CONTENT_STATUS_RANK,
  type ContentProgress,
  type ContentStatus,
  type ContentType,
} from '@/features/codex/domain/content-progress';
import type { ForgeAct, ForgeCategory } from '@/features/forge/domain/forge-act';
import type { LapseRecord } from '@/features/path/domain/lapse-record';
import type { PathEvent, PathEventType } from '@/features/path/domain/path-event';
import {
  DEFAULT_PROFILE,
  userProfileSchema,
  type UserProfile,
  type UserProfilePatch,
} from '@/features/path/domain/user-profile';
import type { UrgeLog } from '@/features/pause/domain/urge-log';
import {
  appPreferencesSchema,
  DEFAULT_PREFERENCES,
  SETTING_KEYS,
  type AppPreferences,
  type AppPreferencesPatch,
} from '@/features/settings/domain/settings';
import { createId } from '@/shared/lib';
/**
 * In-memory implementations of the repository ports. They let services, hooks,
 * and screens be tested without a native SQLite database — the same interfaces,
 * backed by plain JavaScript collections.
 */

const EPOCH = new Date(0).toISOString();

class InMemoryUserProfileRepository implements UserProfileRepository {
  private profile: UserProfile = userProfileSchema.parse({
    ...DEFAULT_PROFILE,
    createdAt: EPOCH,
    updatedAt: EPOCH,
  });

  async get(): Promise<UserProfile> {
    return this.profile;
  }
  async update(patch: UserProfilePatch): Promise<UserProfile> {
    this.profile = userProfileSchema.parse({
      ...this.profile,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return this.profile;
  }
}

class InMemoryPathRepository implements PathRepository {
  private events: PathEvent[] = [];

  async addEvent(event: PathEvent): Promise<void> {
    this.events.unshift(event);
  }
  async listEvents(limit = 200): Promise<PathEvent[]> {
    return this.events.slice(0, limit);
  }
  async countByType(type: PathEventType): Promise<number> {
    return this.events.filter((event) => event.type === type).length;
  }
}

class InMemoryUrgeRepository implements UrgeRepository {
  private logs: UrgeLog[] = [];

  async add(log: UrgeLog): Promise<void> {
    this.logs.unshift(log);
  }
  async list(limit = 100): Promise<UrgeLog[]> {
    return this.logs.slice(0, limit);
  }
  async count(): Promise<number> {
    return this.logs.length;
  }
  async mostCommonTrigger(): Promise<string | null> {
    const counts = new Map<string, number>();
    for (const log of this.logs) {
      counts.set(log.triggerType, (counts.get(log.triggerType) ?? 0) + 1);
    }
    let best: string | null = null;
    let bestCount = 0;
    for (const [trigger, count] of counts) {
      if (count > bestCount) {
        best = trigger;
        bestCount = count;
      }
    }
    return best;
  }
}

class InMemoryForgeRepository implements ForgeRepository {
  private acts: ForgeAct[] = [];

  async add(act: ForgeAct): Promise<void> {
    this.acts.unshift(act);
  }
  async list(limit = 100): Promise<ForgeAct[]> {
    return this.acts.slice(0, limit);
  }
  async listByCategory(category: ForgeCategory, limit = 100): Promise<ForgeAct[]> {
    return this.acts.filter((act) => act.category === category).slice(0, limit);
  }
  async count(): Promise<number> {
    return this.acts.length;
  }
  async countSince(iso: string): Promise<number> {
    return this.acts.filter((act) => act.occurredAt >= iso).length;
  }
  async categoryCounts(): Promise<ForgeCategoryCount[]> {
    const counts = new Map<string, number>();
    for (const act of this.acts) {
      counts.set(act.category, (counts.get(act.category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }
}

class InMemoryLapseRepository implements LapseRepository {
  private records: LapseRecord[] = [];

  async add(record: LapseRecord): Promise<void> {
    this.records.unshift(record);
  }
  async list(limit = 100): Promise<LapseRecord[]> {
    return this.records.slice(0, limit);
  }
  async count(): Promise<number> {
    return this.records.length;
  }
}

class InMemoryContentProgressRepository implements ContentProgressRepository {
  private readonly items = new Map<string, ContentProgress>();
  private key(type: ContentType, id: string): string {
    return `${type}:${id}`;
  }

  async get(contentType: ContentType, contentId: string): Promise<ContentProgress | null> {
    return this.items.get(this.key(contentType, contentId)) ?? null;
  }
  async markStatus(
    contentType: ContentType,
    contentId: string,
    status: ContentStatus,
    at: string,
  ): Promise<ContentProgress> {
    const existing = await this.get(contentType, contentId);
    // Monotonic — mirrors the SQLite repo so re-opening never undoes progress.
    const effectiveStatus: ContentStatus =
      existing && CONTENT_STATUS_RANK[existing.status] >= CONTENT_STATUS_RANK[status]
        ? existing.status
        : status;
    const next = contentProgressSchema.parse({
      id: existing?.id ?? createId(),
      contentId,
      contentType,
      status: effectiveStatus,
      firstOpenedAt: existing?.firstOpenedAt ?? (effectiveStatus === 'unread' ? null : at),
      completedAt:
        effectiveStatus === 'completed' ? (existing?.completedAt ?? at) : (existing?.completedAt ?? null),
    });
    this.items.set(this.key(contentType, contentId), next);
    return next;
  }
  async list(): Promise<ContentProgress[]> {
    return [...this.items.values()];
  }
  async countCompleted(): Promise<number> {
    return [...this.items.values()].filter((item) => item.status === 'completed').length;
  }
}

class InMemorySettingsRepository implements SettingsRepository {
  private readonly kv = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.kv.get(key) ?? null;
  }
  async set(key: string, value: string): Promise<void> {
    this.kv.set(key, value);
  }
  async getPreferences(): Promise<AppPreferences> {
    const readBit = (key: string, fallback: boolean): boolean => {
      const value = this.kv.get(key);
      return value === undefined ? fallback : value === '1';
    };
    const readStr = (key: string): string | null => {
      const value = this.kv.get(key);
      return value === undefined || value === '' ? null : value;
    };
    return appPreferencesSchema.parse({
      hapticsEnabled: readBit(SETTING_KEYS.hapticsEnabled, DEFAULT_PREFERENCES.hapticsEnabled),
      remindersEnabled: readBit(SETTING_KEYS.remindersEnabled, DEFAULT_PREFERENCES.remindersEnabled),
      safetyAcknowledged: readBit(SETTING_KEYS.safetyAcknowledged, DEFAULT_PREFERENCES.safetyAcknowledged),
      primaryIntention: readStr(SETTING_KEYS.primaryIntention),
      preferredForgeCategory: readStr(SETTING_KEYS.preferredForgeCategory),
    });
  }
  async updatePreferences(patch: AppPreferencesPatch): Promise<AppPreferences> {
    const writeBit = (value: boolean): string => (value ? '1' : '0');
    if (patch.hapticsEnabled !== undefined) {
      this.kv.set(SETTING_KEYS.hapticsEnabled, writeBit(patch.hapticsEnabled));
    }
    if (patch.remindersEnabled !== undefined) {
      this.kv.set(SETTING_KEYS.remindersEnabled, writeBit(patch.remindersEnabled));
    }
    if (patch.safetyAcknowledged !== undefined) {
      this.kv.set(SETTING_KEYS.safetyAcknowledged, writeBit(patch.safetyAcknowledged));
    }
    if (patch.primaryIntention !== undefined) {
      this.kv.set(SETTING_KEYS.primaryIntention, patch.primaryIntention ?? '');
    }
    if (patch.preferredForgeCategory !== undefined) {
      this.kv.set(SETTING_KEYS.preferredForgeCategory, patch.preferredForgeCategory ?? '');
    }
    return this.getPreferences();
  }
}

class InMemoryAchievementsRepository implements AchievementsRepository {
  private readonly earned = new Map<string, EarnedAchievement>();

  async markEarned(achievementId: string, at: string): Promise<void> {
    if (!this.earned.has(achievementId)) {
      this.earned.set(achievementId, { id: createId(), achievementId, earnedAt: at });
    }
  }
  async getEarned(): Promise<EarnedAchievement[]> {
    return [...this.earned.values()].sort((a, b) =>
      b.earnedAt.localeCompare(a.earnedAt),
    );
  }
  async isEarned(achievementId: string): Promise<boolean> {
    return this.earned.has(achievementId);
  }
  async filterNotYetEarned(achievementIds: string[]): Promise<string[]> {
    return achievementIds.filter((id) => !this.earned.has(id));
  }
}

export function createFakeRepositories(): Repositories {
  return {
    profile: new InMemoryUserProfileRepository(),
    path: new InMemoryPathRepository(),
    urge: new InMemoryUrgeRepository(),
    forge: new InMemoryForgeRepository(),
    lapse: new InMemoryLapseRepository(),
    contentProgress: new InMemoryContentProgressRepository(),
    settings: new InMemorySettingsRepository(),
    achievements: new InMemoryAchievementsRepository(),
  };
}
