import type {
  BoundaryRepository,
  ContentProgressRepository,
  ForgeCategoryCount,
  ForgeRepository,
  JournalRepository,
  LapseRepository,
  PathRepository,
  Repositories,
  SettingsRepository,
  UrgeRepository,
  UserProfileRepository,
} from '@/db';
import type { Boundary } from '@/features/boundaries/domain/boundary';
import type { BoundaryCheckin } from '@/features/boundaries/domain/boundary-checkin';
import {
  contentProgressSchema,
  type ContentProgress,
  type ContentStatus,
  type ContentType,
} from '@/features/codex/domain/content-progress';
import type { ForgeAct, ForgeCategory } from '@/features/forge/domain/forge-act';
import type { JournalEntry, JournalType } from '@/features/journal/domain/journal-entry';
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

class InMemoryJournalRepository implements JournalRepository {
  private readonly entries = new Map<string, JournalEntry>();

  async list(limit = 100): Promise<JournalEntry[]> {
    return [...this.entries.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
  async listByType(type: JournalType, limit = 100): Promise<JournalEntry[]> {
    return (await this.list(Number.MAX_SAFE_INTEGER))
      .filter((entry) => entry.type === type)
      .slice(0, limit);
  }
  async getById(id: string): Promise<JournalEntry | null> {
    return this.entries.get(id) ?? null;
  }
  async save(entry: JournalEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }
  async remove(id: string): Promise<void> {
    this.entries.delete(id);
  }
  async count(): Promise<number> {
    return this.entries.size;
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

class InMemoryBoundaryRepository implements BoundaryRepository {
  private readonly boundaries = new Map<string, Boundary>();
  private checkins: BoundaryCheckin[] = [];

  async list(activeOnly = false): Promise<Boundary[]> {
    const all = [...this.boundaries.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
    return activeOnly ? all.filter((boundary) => boundary.isActive) : all;
  }
  async getById(id: string): Promise<Boundary | null> {
    return this.boundaries.get(id) ?? null;
  }
  async save(boundary: Boundary): Promise<void> {
    this.boundaries.set(boundary.id, boundary);
  }
  async setActive(id: string, isActive: boolean, updatedAt: string): Promise<void> {
    const existing = this.boundaries.get(id);
    if (existing) this.boundaries.set(id, { ...existing, isActive, updatedAt });
  }
  async remove(id: string): Promise<void> {
    this.boundaries.delete(id);
    this.checkins = this.checkins.filter((checkin) => checkin.boundaryId !== id);
  }
  async addCheckin(checkin: BoundaryCheckin): Promise<void> {
    this.checkins.unshift(checkin);
  }
  async listCheckins(boundaryId: string, limit = 100): Promise<BoundaryCheckin[]> {
    return this.checkins.filter((checkin) => checkin.boundaryId === boundaryId).slice(0, limit);
  }
  async countCheckinsSince(iso: string): Promise<number> {
    return this.checkins.filter((checkin) => checkin.checkedAt >= iso).length;
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
    const next = contentProgressSchema.parse({
      id: existing?.id ?? createId(),
      contentId,
      contentType,
      status,
      firstOpenedAt: existing?.firstOpenedAt ?? (status === 'unread' ? null : at),
      completedAt: status === 'completed' ? (existing?.completedAt ?? at) : (existing?.completedAt ?? null),
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
    const read = (key: string, fallback: boolean): boolean => {
      const value = this.kv.get(key);
      return value === undefined ? fallback : value === '1';
    };
    return appPreferencesSchema.parse({
      hapticsEnabled: read(SETTING_KEYS.hapticsEnabled, DEFAULT_PREFERENCES.hapticsEnabled),
      remindersEnabled: read(SETTING_KEYS.remindersEnabled, DEFAULT_PREFERENCES.remindersEnabled),
      safetyAcknowledged: read(SETTING_KEYS.safetyAcknowledged, DEFAULT_PREFERENCES.safetyAcknowledged),
    });
  }
  async updatePreferences(patch: AppPreferencesPatch): Promise<AppPreferences> {
    const write = (value: boolean): string => (value ? '1' : '0');
    if (patch.hapticsEnabled !== undefined) {
      this.kv.set(SETTING_KEYS.hapticsEnabled, write(patch.hapticsEnabled));
    }
    if (patch.remindersEnabled !== undefined) {
      this.kv.set(SETTING_KEYS.remindersEnabled, write(patch.remindersEnabled));
    }
    if (patch.safetyAcknowledged !== undefined) {
      this.kv.set(SETTING_KEYS.safetyAcknowledged, write(patch.safetyAcknowledged));
    }
    return this.getPreferences();
  }
}

export function createFakeRepositories(): Repositories {
  return {
    profile: new InMemoryUserProfileRepository(),
    path: new InMemoryPathRepository(),
    urge: new InMemoryUrgeRepository(),
    forge: new InMemoryForgeRepository(),
    journal: new InMemoryJournalRepository(),
    lapse: new InMemoryLapseRepository(),
    boundary: new InMemoryBoundaryRepository(),
    contentProgress: new InMemoryContentProgressRepository(),
    settings: new InMemorySettingsRepository(),
  };
}
