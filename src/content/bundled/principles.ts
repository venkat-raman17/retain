import type { Principle } from '../schemas';

/**
 * The creed of the app, surfaced in onboarding and on the Path. This is the
 * philosophical spine: aspirational, never punitive. Edit with care — the voice
 * here sets the tone for everything (see CLAUDE.md content rules).
 */
export const principles: readonly Principle[] = [
  {
    id: 'energy-is-ally',
    title: 'The energy is an ally',
    body: 'What rises in you is life force — vitality, drive, creative fire. It is not the problem to be solved. It is the fuel to be directed.',
  },
  {
    id: 'compulsion-is-enemy',
    title: 'The compulsion is the adversary',
    body: 'The pull toward the automatic, the numbing, the empty repetition — that is what you train against. Not the body. Not desire. The pattern.',
  },
  {
    id: 'you-are-not-the-enemy',
    title: 'You are never the enemy',
    body: 'You are the one doing the work, and the one worth the work. Speak to yourself the way you would speak to a younger brother you believe in.',
  },
  {
    id: 'lapse-is-a-lesson',
    title: 'A lapse is a lesson',
    body: 'A reset is information, not a verdict. It shows you a trigger, a moment, an hour. You meet it with curiosity, learn from it, and continue.',
  },
  {
    id: 'desire-is-honored',
    title: 'Desire is honored, not denied',
    body: 'Attraction, longing, and the wish for closeness are human and good. The practice is not to hate desire, but to stop letting it run on autopilot.',
  },
] as const;
