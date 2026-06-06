import { z } from 'zod';

export const principleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});
export type Principle = z.infer<typeof principleSchema>;

export const principlesSchema = z.array(principleSchema).min(1);
