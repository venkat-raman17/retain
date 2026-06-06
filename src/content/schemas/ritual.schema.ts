import { z } from 'zod';

export const RITUAL_TIMES = ['morning', 'evening', 'anytime'] as const;
export const ritualTimeSchema = z.enum(RITUAL_TIMES);
export type RitualTime = z.infer<typeof ritualTimeSchema>;

export const ritualSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  time: ritualTimeSchema,
  intention: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
});
export type Ritual = z.infer<typeof ritualSchema>;

export const ritualsSchema = z.array(ritualSchema).min(1);
