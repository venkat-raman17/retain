import {
  copy,
  getArcByNumber,
  getCodexDayByIndex,
  getCrownCodexByIndex,
  getDailyPathContent,
  type DailyPathContent,
  type PathSeason,
} from '@/content';
import { dayOfYearIndex, timeOfDay, type TimeOfDay } from '@/content/daily/time-of-day';
import type { UserProfileRepository } from '@/db';
import type { Clock } from '@/shared/lib';

import { currentPathDay, daysSince, isPathRunning } from '../domain/practice';

export interface DailyFocus {
  label: string;
  body: string;
}

export interface DailyTeaching {
  eyebrow: string;
  title: string;
  body: string;
}

/**
 * A ready-to-render view-model for the home surface, assembled from the profile,
 * the injected clock, and the bundled content. It surfaces a time-appropriate
 * focus (command in the morning, the account at night) and a rotating daily-codex
 * teaching, so the Path screen visibly changes by day AND time of day.
 */
export interface DailyBrief {
  running: boolean;
  day: number;
  arcNumber: number;
  arcTitle: string;
  season: PathSeason | null;
  timeOfDay: TimeOfDay;
  greeting: string;
  /** True once the Crown is received and the man walks the Long Path. */
  isLongPath: boolean;
  /** Days elapsed since the Long Path began (1-indexed); 0 during initiation_90. */
  longPathDay: number;
  focus: DailyFocus | null;
  teaching: DailyTeaching | null;
  seal: string | null;
  milestoneRiteId: string | null;
}

/**
 * Assembles the {@link DailyBrief}. Pure mapping over the content loaders + the
 * profile + clock — no business rules beyond picking fields by time/day. Mirrors
 * the DI of {@link import('./daily-path-service').DailyPathService}; takes only the
 * profile repository (rotation/time are clock-derived, never stored).
 */
export class DailyBriefService {
  constructor(
    private readonly profiles: UserProfileRepository,
    private readonly clock: Clock,
  ) {}

  async getDailyBrief(): Promise<DailyBrief> {
    const profile = await this.profiles.get();
    const running = isPathRunning(profile);
    const day = currentPathDay(profile, this.clock);
    const tod = timeOfDay(this.clock);
    const dailyCopy = copy.daily;

    const isLongPath = profile.currentPathPhase === 'crowned_long_path';
    const longPathDay = isLongPath ? daysSince(profile.longPathStartedAt, this.clock) + 1 : 0;

    // The Long Path has its own evergreen wisdom stream (the Crown Codex), rotated
    // by long-path day, so post-Crown days carry dedicated guidance rather than
    // recycling the initiation codex. Initiation rotates the 7-day codex by path
    // day; idle by calendar day — so the teaching is never static.
    const crownItem = isLongPath ? getCrownCodexByIndex(longPathDay - 1) : undefined;
    const codexIndex = running ? day : dayOfYearIndex(this.clock);
    const codexDay = getCodexDayByIndex(codexIndex);

    // Daily chambers only exist for days 1–90; skip on the long path.
    const content = running && !isLongPath ? getDailyPathContent(day) : undefined;
    const arc = content ? getArcByNumber(content.arcNumber) : undefined;

    const longPathFocusLabel = dailyCopy.focus[this.focusKey(tod)];

    return {
      running,
      day,
      arcNumber: content?.arcNumber ?? arc?.arcNumber ?? 1,
      arcTitle: isLongPath ? 'Long Path' : (content?.arcTitle || arc?.title || ''),
      season: content?.season ?? null,
      timeOfDay: tod,
      greeting: isLongPath ? `Long Path · Day ${longPathDay}` : dailyCopy.greeting[tod],
      isLongPath,
      longPathDay,
      focus: isLongPath
        ? crownItem
          ? { label: longPathFocusLabel, body: crownItem.practice }
          : null
        : content
          ? this.focusFor(tod, content)
          : null,
      teaching: isLongPath
        ? crownItem
          ? { eyebrow: dailyCopy.longPathEyebrow, title: crownItem.title, body: crownItem.body }
          : null
        : codexDay
          ? { eyebrow: dailyCopy.teachingEyebrow, title: codexDay.title, body: codexDay.teaching }
          : null,
      seal: isLongPath ? (crownItem?.seal ?? null) : (content?.seal ?? null),
      milestoneRiteId: content?.milestoneRiteId ?? null,
    };
  }

  /** Map time-of-day to the focus copy key (dawn collapses to morning). */
  private focusKey(tod: TimeOfDay): keyof typeof copy.daily.focus {
    switch (tod) {
      case 'dawn':
      case 'morning': return 'morning';
      case 'midday': return 'midday';
      case 'evening': return 'evening';
      case 'night': return 'night';
    }
  }

  /** Pick a focus from today's content based on the part of the day. */
  private focusFor(tod: TimeOfDay, content: DailyPathContent): DailyFocus {
    const f = copy.daily.focus;
    switch (tod) {
      case 'dawn':
      case 'morning':
        return { label: f.morning, body: content.command };
      case 'midday':
        return { label: f.midday, body: content.practice };
      case 'evening':
        return { label: f.evening, body: content.eveningAccount };
      case 'night':
        return { label: f.night, body: content.journalPrompt };
    }
  }
}
