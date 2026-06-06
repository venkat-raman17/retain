import { z } from 'zod';

/**
 * A milestone rite — a passage, not a badge. Marks a threshold the man has
 * crossed. Each rite includes a self-audit, a vow renewal, and a forge challenge.
 */
export const riteSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  milestoneDay: z.number().int().min(1),
  ceremonialPassage: z.string().min(1),
  selfAuditQuestions: z.array(z.string().min(1)).min(1),
  vowRenewal: z.string().min(1),
  forgeChallenge: z.string().min(1),
  seal: z.string().min(1),
});
export type Rite = z.infer<typeof riteSchema>;

export const ritesSchema = z.array(riteSchema).min(1);
