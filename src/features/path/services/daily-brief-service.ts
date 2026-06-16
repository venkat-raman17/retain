import {
  copy,
  getArcByNumber,
  getCodexDayByIndex,
  getDailyPathContent,
  type DailyPathContent,
  type PathSeason,
} from '@/content';
import { dayOfYearIndex, timeOfDay, type TimeOfDay } from '@/content/daily/time-of-day';
import type { UserProfileRepository } from '@/db';
import type { Clock } from '@/shared/lib';

import { currentPathDay, isPathRunning } from '../domain/practice';

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
    const content = running ? getDailyPathContent(day) : undefined;
    const arc = content ? getArcByNumber(content.arcNumber) : undefined;
    const dailyCopy = copy.daily;

    // Rotate the daily codex by path day while running, else by calendar day, so
    // the "Today's teaching" card is never static.
    const codexDay = getCodexDayByIndex(running ? day : dayOfYearIndex(this.clock));

    return {
      running,
      day,
      arcNumber: content?.arcNumber ?? arc?.arcNumber ?? 1,
      arcTitle: content?.arcTitle || arc?.title || '',
      season: content?.season ?? null,
      timeOfDay: tod,
      greeting: dailyCopy.greeting[tod],
      focus: content ? this.focusFor(tod, content) : null,
      teaching: codexDay
        ? { eyebrow: dailyCopy.teachingEyebrow, title: codexDay.title, body: codexDay.teaching }
        : null,
      seal: content?.seal ?? null,
      milestoneRiteId: content?.milestoneRiteId ?? null,
    };
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
      default:
        return { label: f.morning, body: content.command };
    }
  }
}
