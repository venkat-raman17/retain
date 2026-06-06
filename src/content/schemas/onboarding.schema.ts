import { z } from 'zod';

export const onboardingStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  affirmation: z.string().min(1).optional(),
});
export type OnboardingStep = z.infer<typeof onboardingStepSchema>;

export const onboardingSchema = z.array(onboardingStepSchema).min(1);
