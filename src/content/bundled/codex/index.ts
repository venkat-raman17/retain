import type { CodexDay } from '../../schemas';

/** Seven days of the Daily Codex — a week-long arc through the principles. */
export const codexDays: readonly CodexDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'The Ally',
    theme: 'The energy is the ally.',
    teaching:
      'Begin by changing the relationship. The drive you feel is not a flaw to be ashamed of — it is the raw vitality that builds bodies, works, and lives. The practice is not to kill it but to lead it.',
    practice: 'When the fire rises today, name it silently: "ally." Then choose where it goes.',
    reflectionPromptId: 'm-build',
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'The Adversary',
    theme: 'The compulsion is the enemy.',
    teaching:
      'Separate the energy from the compulsion. The energy is clean; the compulsion is the worn groove that wants the easy discharge. You train against the groove, not against yourself.',
    practice: 'Notice one automatic reach today. Pause for three breaths before you follow it.',
    reflectionPromptId: 'u-trigger',
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'The Gates',
    theme: 'Guard the gates.',
    teaching:
      'Most battles are won or lost at the eyes and the hours. Decide in advance what you will not feed and when you will not be alone with the screen. The first victory is often looking away.',
    practice: 'Set one boundary for tonight before the temptation hour arrives.',
    reflectionPromptId: null,
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'The Hold',
    theme: 'Hold the fire.',
    teaching:
      'To pause is to hold a charge without spending it. It feels like pressure because it is power. Breathe, and let the body remember that you are the one who leads.',
    practice: 'Practice one deliberate pause today — sixty seconds of stillness with a strong urge.',
    reflectionPromptId: 'u-become',
  },
  {
    id: 'day-5',
    dayNumber: 5,
    title: 'The Forge',
    theme: 'Refine the fire.',
    teaching:
      'Held energy must move or it sours. Give it a worthy channel: train, build, study, serve. This is transmutation — not suppression, but direction.',
    practice: 'Turn one urge into a Forge Act today. Record what you built.',
    reflectionPromptId: null,
  },
  {
    id: 'day-6',
    dayNumber: 6,
    title: 'The Return',
    theme: 'A lapse is information, not identity.',
    teaching:
      'If you fall, you are not your fall. Stand up, clean the wound, and read the lesson without drama. The streak resets; the man does not start from zero.',
    practice: 'Write one honest line about a past slip — what it taught you, not what it proves.',
    reflectionPromptId: 'l-next',
  },
  {
    id: 'day-7',
    dayNumber: 7,
    title: 'The Pause',
    theme: 'The pause is where manhood begins.',
    teaching:
      'A week in, the lesson distills to one move: the pause. In the gap between impulse and action, you are free. Everything else is built on that gap.',
    practice: 'Rest in the practice today. Notice how many pauses you already have in you.',
    reflectionPromptId: 'e-command',
  },
] as const;
