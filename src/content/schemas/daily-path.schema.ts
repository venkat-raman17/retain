import { z } from 'zod';

import { archetypeSchema } from './archetype.schema';

export const PATH_SEASONS = [
  'the_vow',
  'guard_the_gates',
  'body_must_be_included',
  'discipline_of_assent',
  'inner_order',
  'transmutation',
  'brotherhood_and_service',
  'the_integrated_man',
] as const;
export const pathSeasonSchema = z.enum(PATH_SEASONS);
export type PathSeason = z.infer<typeof pathSeasonSchema>;

export const PATH_SEASON_RANGES: Record<PathSeason, { start: number; end: number; title: string }> = {
  the_vow: { start: 1, end: 7, title: 'The Vow' },
  guard_the_gates: { start: 8, end: 14, title: 'Guard the Gates' },
  body_must_be_included: { start: 15, end: 21, title: 'The Body Must Be Included' },
  discipline_of_assent: { start: 22, end: 30, title: 'The Discipline of Assent' },
  inner_order: { start: 31, end: 45, title: 'The Inner Order' },
  transmutation: { start: 46, end: 60, title: 'Transmutation' },
  brotherhood_and_service: { start: 61, end: 75, title: 'Brotherhood and Service' },
  the_integrated_man: { start: 76, end: 90, title: 'The Integrated Man' },
};

export function seasonForDay(day: number): PathSeason {
  for (const [season, range] of Object.entries(PATH_SEASON_RANGES) as [PathSeason, { start: number; end: number }][]) {
    if (day >= range.start && day <= range.end) return season;
  }
  return 'the_integrated_man';
}

export const dailyPathContentSchema = z.object({
  id: z.string().min(1),
  dayNumber: z.number().int().min(1).max(90),
  title: z.string().min(1),
  season: pathSeasonSchema,
  archetype: archetypeSchema,
  openingLine: z.string().min(1),
  teachingBody: z.string().min(1),
  command: z.string().min(1),
  practice: z.string().min(1),
  forgeChallenge: z.string().min(1),
  journalPrompt: z.string().min(1),
  eveningAccount: z.string().min(1),
  seal: z.string().min(1),
  relatedStudyIds: z.array(z.string()).default([]),
  relatedPrincipleIds: z.array(z.string()).default([]),
  milestoneRiteId: z.string().nullable().default(null),
  safetyGuardrail: z.string().nullable().default(null),
});
export type DailyPathContent = z.infer<typeof dailyPathContentSchema>;

export const dailyPathContentsSchema = z.array(dailyPathContentSchema).min(1);
