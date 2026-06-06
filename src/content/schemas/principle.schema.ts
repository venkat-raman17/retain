import { z } from 'zod';

export const principleSchema = z.object({
  id: z.string().min(1),
  /** The principle as a short statement (used as a title/headline). */
  title: z.string().min(1),
  /** A short elaboration. */
  body: z.string().min(1),
});
export type Principle = z.infer<typeof principleSchema>;

export const principlesSchema = z.array(principleSchema).min(1);
