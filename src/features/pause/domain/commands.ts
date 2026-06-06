/** The 10 pre-written command responses a user can choose during a pause. */
export const PAUSE_COMMANDS = [
  '20 push-ups',
  'Walk outside',
  'Cold water on face',
  'Clean your space',
  'Pray or meditate',
  'Journal the urge',
  'Study for 15 minutes',
  'Build something',
  'Call a brother',
  'Sit still and let it pass',
] as const;

export type PauseCommand = (typeof PAUSE_COMMANDS)[number];

export const TIMER_OPTIONS: { label: string; seconds: number }[] = [
  { label: '1 min', seconds: 60 },
  { label: '3 min', seconds: 180 },
  { label: '7 min', seconds: 420 },
];
