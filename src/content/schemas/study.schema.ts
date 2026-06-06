import { z } from 'zod';

/** Wisdom lineages, presented strictly as philosophical/historical inspiration. */
export const STUDY_LINEAGES = [
  'brahmacharya',
  'buddhist_sense_restraint',
  'daoist_inner_alchemy',
  'tibetan_inner_fire',
  'stoic_command',
  'monastic_watchfulness',
  'sufi_purification',
  'greco_roman_pneuma',
  'kabbalistic_repair',
  'western_alchemy',
  'warrior_athlete_discipline',
] as const;
export const studyLineageSchema = z.enum(STUDY_LINEAGES);
export type StudyLineage = z.infer<typeof studyLineageSchema>;

/**
 * A Study frames a tradition as inspiration, never as authority or medical
 * claim. The `guardrail` field is required so every Study carries its caveat
 * (see docs/CONTENT_SAFETY.md).
 */
export const studySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  lineage: studyLineageSchema,
  summary: z.string().min(1),
  historicalFrame: z.string().min(1),
  retainPrinciple: z.string().min(1),
  practice: z.string().min(1),
  reflectionPrompt: z.string().min(1),
  guardrail: z.string().min(1),
});
export type Study = z.infer<typeof studySchema>;

export const studiesSchema = z.array(studySchema).min(1);
