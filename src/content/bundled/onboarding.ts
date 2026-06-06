import type { OnboardingStep } from '../schemas';

export const onboardingSteps: readonly OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Retain',
    body: 'This is a quiet space for practicing retention, transmuting energy, and building self-mastery. No accounts, no tracking, no noise — everything stays on your device.',
    affirmation: 'I am here to build, not to punish.',
  },
  {
    id: 'the-frame',
    title: 'The frame',
    body: 'The energy is an ally. The compulsion is the adversary. You are neither — you are the one learning to direct the current.',
    affirmation: 'My energy is fuel I choose to direct.',
  },
  {
    id: 'how-it-works',
    title: 'How the practice works',
    body: 'Walk the Path each day. Forge your energy into focus. Reach for Pause when an urge rises. Reflect in the Journal. Study the Codex. Progress is yours to see, privately.',
    affirmation: 'Small, steady acts compound into mastery.',
  },
  {
    id: 'on-lapses',
    title: 'If you reset',
    body: 'A reset is not a failing — it is data. You note what happened, learn from it, and continue from exactly where you stand. The streak resets; your growth does not.',
    affirmation: 'I recover with honesty and keep walking.',
  },
];
