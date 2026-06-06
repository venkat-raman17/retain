import type { Ritual } from '../../schemas';

export const rituals: readonly Ritual[] = [
  {
    id: 'morning-ignition',
    title: 'Morning Ignition',
    time: 'morning',
    intention: 'Choose command before the world chooses for you.',
    steps: [
      'Sit upright before reaching for the phone.',
      'Take ten slow breaths and feel the body wake.',
      'Name your vow once, aloud or inwardly.',
      'Name one thing you will build today.',
    ],
  },
  {
    id: 'evening-account',
    title: 'Evening Account',
    time: 'evening',
    intention: 'Account for the day without shame, and prepare the next.',
    steps: [
      'Recall one place you commanded yourself today.',
      'Recall one place energy leaked, and what fed it.',
      'Name one thing to repair or guard tomorrow.',
      'Set the phone to sleep outside arm’s reach.',
    ],
  },
  {
    id: 'temptation-hour-reset',
    title: 'Temptation-Hour Reset',
    time: 'anytime',
    intention: 'Break the spell when the urge peaks.',
    steps: [
      'Stand up and leave the room.',
      'Splash cold water on the face, or step outside.',
      'Breathe out longer than you breathe in, ten times.',
      'Choose one clean action and begin it now.',
    ],
  },
] as const;
