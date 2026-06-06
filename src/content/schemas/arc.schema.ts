import { z } from 'zod';

/**
 * Nine 10-day arcs that structure the 90-day rite of passage. Each arc is a
 * distinct formation phase with its own question and theme.
 */
export const arcSchema = z.object({
  id: z.string().min(1),
  arcNumber: z.number().int().min(1).max(9),
  title: z.string().min(1),
  dayStart: z.number().int().min(1),
  dayEnd: z.number().int().min(1),
  centralQuestion: z.string().min(1),
  description: z.string().min(1),
  completionCopy: z.string().min(1),
});
export type Arc = z.infer<typeof arcSchema>;

export const arcsSchema = z.array(arcSchema).length(9);
