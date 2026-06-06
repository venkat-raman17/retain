import { z } from 'zod';

/** A single day of the Daily Codex. */
export const codexDaySchema = z.object({
  id: z.string().min(1),
  dayNumber: z.number().int().min(1),
  title: z.string().min(1),
  theme: z.string().min(1),
  teaching: z.string().min(1),
  practice: z.string().min(1),
  reflectionPromptId: z.string().min(1).nullable(),
});
export type CodexDay = z.infer<typeof codexDaySchema>;

export const codexSchema = z.array(codexDaySchema).min(1);
