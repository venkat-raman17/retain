import { z } from 'zod';

export const ACHIEVEMENT_CRITERIA_KINDS = [
  'days_completed',
  'arc_cleared',
  'arcs_cleared',
  'pause_logged',
  'forge_act_logged',
  'forge_all_categories',
  'return_recorded',
  'boundary_kept',
  'crown_received',
  'embers_earned',
] as const;
export type AchievementCriteriaKind = (typeof ACHIEVEMENT_CRITERIA_KINDS)[number];

export const achievementCriteriaSchema = z.object({
  kind: z.enum(ACHIEVEMENT_CRITERIA_KINDS),
  params: z.record(z.string(), z.number()),
});
export type AchievementCriteria = z.infer<typeof achievementCriteriaSchema>;

const sealSourceSchema = z.enum(['arc', 'archetype', 'semantic']);

export const achievementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  sealSource: sealSourceSchema,
  sealId: z.string().min(1),
  criteria: achievementCriteriaSchema,
});
export type Achievement = z.infer<typeof achievementSchema>;

export const achievementsSchema = z.array(achievementSchema).min(1);
