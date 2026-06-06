/**
 * Centralized user-facing copy. All durable UI strings live here so the voice
 * stays consistent and is reviewable in one place against the content rules in
 * CLAUDE.md. Screens import from here rather than hardcoding text.
 */
export const copy = {
  app: {
    name: 'Retain',
    tagline: 'The energy is the ally. The compulsion is the adversary.',
  },
  tabs: {
    path: 'Path',
    forge: 'Forge',
    journal: 'Journal',
    codex: 'Codex',
    progress: 'Progress',
  },
  actions: {
    begin: 'Begin',
    continue: 'Continue',
    back: 'Back',
    acknowledge: 'I understand',
    save: 'Save',
    done: 'Done',
    pause: 'Pause',
    openSettings: 'Settings',
    viewSafety: 'Safety & disclaimer',
  },
  path: {
    eyebrow: 'The Path',
    title: 'Walk today with intention',
    description:
      'Your daily ground. See where you stand, set the tone, and take one deliberate step.',
    points: [
      'Your current streak and a word of intention for today',
      'A principle to carry with you',
      'Quick reach for Pause, Forge, and the Journal',
    ],
  },
  forge: {
    eyebrow: 'The Forge',
    title: 'Transmute the current',
    description: 'Give the energy somewhere worthy to go. Choose a direction and begin.',
    categories: [
      { name: 'Body', example: 'Train, walk, stretch, cold exposure, breathwork.' },
      { name: 'Mind', example: 'Study, read, plan, solve, deep work.' },
      { name: 'Spirit', example: 'Pray, meditate, sit in silence, gratitude.' },
      { name: 'Order', example: 'Clean your space, prepare food, remove temptation.' },
      { name: 'Creation', example: 'Write, build, draw, practice a skill.' },
      { name: 'Brotherhood', example: 'Call a friend, serve someone, speak honestly.' },
    ],
  },
  journal: {
    eyebrow: 'The Journal',
    title: 'Reflect in private',
    description: 'A confidential place to notice patterns, mark insights, and meet urges honestly.',
    empty: 'Nothing here yet. Your first reflection will appear once you write it.',
    points: [
      'Reflections, gratitude, urge notes, and insights',
      'Optional mood and energy markers',
      'Stored only on this device',
    ],
  },
  codex: {
    eyebrow: 'The Codex',
    title: 'Study the practice',
    description: 'Teachings on transmutation, mindset, and building a life that needs no escape.',
    points: [
      'Short readings you can finish in a few minutes',
      'Principle, practice, science, and mindset',
      'Perspectives to return to, never medical claims',
    ],
  },
  progress: {
    eyebrow: 'Progress',
    title: 'See how far you have come',
    description: 'A private view of your streaks, recoveries, and the rhythm of your practice.',
    points: [
      'Current and best streak',
      'Resets framed as learning, not as a scoreboard',
      'Reflections logged over time',
    ],
  },
  pause: {
    eyebrow: 'Pause',
    title: 'Ride the wave',
    description:
      'An urge is a wave — it rises, peaks, and passes. Breathe with it. You do not have to act.',
    breatheIn: 'Breathe in',
    hold: 'Hold',
    breatheOut: 'Breathe out',
    reassurance: 'This will pass. You are doing the work right now.',
    points: [
      'A guided breath to ride the urge out',
      'A reminder of why you started',
      'A soft landing — record it later in the Journal if you wish',
    ],
  },
  settings: {
    eyebrow: 'Settings',
    title: 'Your space',
    description: 'Adjust the practice to fit your life. Everything stays on this device.',
    points: ['Haptics and gentle reminders', 'Review the safety note', 'No account, ever'],
  },
  safety: {
    eyebrow: 'Safety',
    title: 'Before you begin',
    description: 'A short, honest note about what this app is — and what it is not.',
  },
} as const;

export type Copy = typeof copy;
