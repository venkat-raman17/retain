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

export const SECRET_CONTENT_TYPES = [
  'hidden_teaching',
  'ancient_key',
  'archetype_trial',
  'forge_assignment',
  'night_warning',
  'lapse_medicine',
  'crown_fragment',
] as const;
export const secretContentTypeSchema = z.enum(SECRET_CONTENT_TYPES);
export type SecretContentType = z.infer<typeof secretContentTypeSchema>;

export const CONTENT_STATUSES = ['final', 'draft'] as const;
export const contentStatusSchema = z.enum(CONTENT_STATUSES);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

/**
 * One day's complete formation unit. Every day unlocks like a sealed chamber:
 * the teaching, command, and practice are visible; the secret is revealed on
 * the day itself; future days show only their title and arc (locked silhouette).
 */
export const dailyPathContentSchema = z.object({
  id: z.string().min(1),
  dayNumber: z.number().int().min(1).max(90),
  title: z.string().min(1),
  season: pathSeasonSchema,
  /** 1–9, matching the nine 10-day arcs. */
  arcNumber: z.number().int().min(1).max(9).default(1),
  arcTitle: z.string().default(''),
  theme: z.string().default(''),
  archetype: archetypeSchema,
  /** Second-person investiture: "Today you walk as the {Archetype}…". */
  invocation: z.string().default(''),
  /** Why THIS archetype today + how it bends the day's command/practice. */
  archetypeExpression: z.string().default(''),
  openingLine: z.string().min(1),
  teachingBody: z.string().min(1),
  /** The secret revealed only on the day. */
  secretContentType: secretContentTypeSchema.default('hidden_teaching'),
  secretTitle: z.string().default(''),
  secretBody: z.string().default(''),
  command: z.string().min(1),
  practice: z.string().min(1),
  forgeChallenge: z.string().min(1),
  journalPrompt: z.string().min(1),
  eveningAccount: z.string().min(1),
  seal: z.string().min(1),
  /** A phrase or concept added to the user's Codex on completion. */
  crownFragment: z.string().nullable().default(null),
  /** 'draft' entries are structural placeholders awaiting full writing. */
  contentStatus: contentStatusSchema.default('final'),
  /** A bundled public-domain lineage passage tied to this day's theme/archetype. */
  lineagePassageId: z.string().nullable().default(null),
  relatedStudyIds: z.array(z.string()).default([]),
  relatedPrincipleIds: z.array(z.string()).default([]),
  milestoneRiteId: z.string().nullable().default(null),
  safetyGuardrail: z.string().nullable().default(null),
});
export type DailyPathContent = z.infer<typeof dailyPathContentSchema>;
/**
 * Pre-parse shape of a day entry: fields with a Zod `.default(...)` are optional
 * here. Bundled day arrays are typed with this so newly-added fields can be
 * authored incrementally (arc by arc) while the loader's `.parse()` fills
 * defaults and validates. A test enforces the fields are actually authored.
 */
export type DailyPathContentInput = z.input<typeof dailyPathContentSchema>;

export const dailyPathContentsSchema = z.array(dailyPathContentSchema).min(1);
