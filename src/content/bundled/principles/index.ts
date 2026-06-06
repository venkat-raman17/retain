import type { Principle } from '../../schemas';

/**
 * The ten principles — the creed of the practice. Aspirational, never punitive
 * (see docs/CONTENT_SAFETY.md). Edit with care; this voice sets the tone.
 */
export const principles: readonly Principle[] = [
  {
    id: 'energy-is-ally',
    title: 'The energy is the ally.',
    body: 'What rises in you is life force — vitality, drive, creative fire. It is fuel to be directed, not an enemy to be crushed.',
  },
  {
    id: 'compulsion-is-enemy',
    title: 'The compulsion is the enemy.',
    body: 'The pull toward the automatic and the numbing is what you train against — not the body, not desire, but the pattern.',
  },
  {
    id: 'man-is-never-enemy',
    title: 'The man is never the enemy.',
    body: 'You are the one doing the work and the one worth the work. Speak to yourself as you would to a younger brother you believe in.',
  },
  {
    id: 'shame-weakens-command',
    title: 'Shame weakens command.',
    body: 'Contempt feels like discipline but drains it. Self-respect is what keeps a man in the practice long enough to grow.',
  },
  {
    id: 'lapse-is-information',
    title: 'A lapse is information, not identity.',
    body: 'A reset shows you a trigger and an hour. You read it, learn from it, and continue. It is data, never a verdict.',
  },
  {
    id: 'guard-the-gates',
    title: 'Guard the gates.',
    body: 'The fire is fed first by attention. The first victory is often looking away before the spark becomes a blaze.',
  },
  {
    id: 'hold-the-fire',
    title: 'Hold the fire.',
    body: 'To pause is to hold the charge without discharging it. The holding itself is the training — the rep that builds command.',
  },
  {
    id: 'refine-the-fire',
    title: 'Refine the fire.',
    body: 'Held energy is meant to move. Pour it into the body, the work, the craft, the people you serve. Raw desire becomes strength through action.',
  },
  {
    id: 'return-to-order',
    title: 'Return to order.',
    body: 'After a storm, restore the room, the breath, the plan. Order outside steadies the man inside.',
  },
  {
    id: 'pause-is-where-manhood-begins',
    title: 'The pause is where manhood begins.',
    body: 'You are not the urge. You are the one who chooses. In the gap between impulse and action, a man is made.',
  },
] as const;
