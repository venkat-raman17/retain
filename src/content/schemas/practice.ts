import { z } from 'zod';

export const PRACTICE_CATEGORIES = ['breath', 'movement', 'focus', 'cold', 'visualization'] as const;
export const practiceCategorySchema = z.enum(PRACTICE_CATEGORIES);
export type PracticeCategory = z.infer<typeof practiceCategorySchema>;

/** A Forge practice: a concrete exercise for transmuting energy into focus. */
export const practiceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: practiceCategorySchema,
  durationMinutes: z.number().int().min(1).max(120),
  intention: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
});
export type Practice = z.infer<typeof practiceSchema>;

export const practicesSchema = z.array(practiceSchema).min(1);
