import type { Practice } from '../schemas';

/** Forge practices: concrete exercises for channeling energy into focus. */
export const practices: readonly Practice[] = [
  {
    id: 'box-breath',
    title: 'Box breathing',
    category: 'breath',
    durationMinutes: 4,
    intention: 'Settle the nervous system and reclaim the moment.',
    steps: [
      'Sit upright and relax your shoulders.',
      'Breathe in through the nose for a count of four.',
      'Hold gently for four.',
      'Exhale slowly for four, then hold for four.',
      'Repeat the square for four minutes.',
    ],
  },
  {
    id: 'cold-reset',
    title: 'Cold reset',
    category: 'cold',
    durationMinutes: 3,
    intention: 'Convert restlessness into alertness.',
    steps: [
      'Run water as cold as is comfortable for you.',
      'Breathe out slowly as you step in or splash the face and neck.',
      'Stay calm and keep the exhale long.',
      'Step out and notice the clarity that follows.',
    ],
  },
  {
    id: 'energy-walk',
    title: 'The energy walk',
    category: 'movement',
    durationMinutes: 15,
    intention: 'Move the current through the body and into the day.',
    steps: [
      'Leave the room and step outside if you can.',
      'Walk at a brisk, steady pace.',
      'Keep your posture tall and your gaze up.',
      'Let the restlessness become momentum.',
    ],
  },
  {
    id: 'single-task',
    title: 'One deep task',
    category: 'focus',
    durationMinutes: 25,
    intention: 'Pour the energy into one worthy aim.',
    steps: [
      'Choose a single task that matters to you.',
      'Silence and set aside the phone.',
      'Work with full attention for twenty-five minutes.',
      'When the timer ends, acknowledge the effort.',
    ],
  },
  {
    id: 'inner-fire',
    title: 'Inner fire visualization',
    category: 'visualization',
    durationMinutes: 6,
    intention: 'Picture the energy rising and being directed.',
    steps: [
      'Sit comfortably and close your eyes.',
      'Imagine a warm current at the base of the spine.',
      'On each inhale, draw it gently upward.',
      'On each exhale, send it toward a goal you hold.',
      'Finish by naming one thing you will build today.',
    ],
  },
];
