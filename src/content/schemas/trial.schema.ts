import { z } from 'zod';

export const OBJECTIVE_KINDS = [
  'reveal_secret',
  'forge_act',
  'log_pause',
  'boundary_checkin',
] as const;
export type ObjectiveKind = (typeof OBJECTIVE_KINDS)[number];

export const TRIAL_TIERS = ['foundation', 'discipline', 'mastery', 'sovereign'] as const;
export type TrialTier = (typeof TRIAL_TIERS)[number];

export const trialObjectiveSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(OBJECTIVE_KINDS),
  label: z.string().min(1),
  optional: z.boolean().default(false),
});
export type TrialObjective = z.infer<typeof trialObjectiveSchema>;

export const trialSchema = z.object({
  id: z.string().min(1),
  dayNumber: z.union([z.number().int().min(1).max(90), z.literal('crown')]),
  arcNumber: z.number().int().min(1).max(9).nullable(),
  name: z.string().min(1),
  tier: z.enum(TRIAL_TIERS),
  objectives: z.array(trialObjectiveSchema).min(1).max(4),
  rewardEmbers: z.number().int().min(1),
  rewardKeyId: z.string().nullable(),
  flavor: z.string().min(1),
});
export type Trial = z.infer<typeof trialSchema>;

export const trialsSchema = z.array(trialSchema).min(91);
