import type { JournalPrompt } from '../../schemas';

/** Journal prompts, grouped by type. Lapse prompts never shame the user. */
export const journalPrompts: readonly JournalPrompt[] = [
  // Morning
  { id: 'm-build', type: 'morning', text: 'What am I building today?' },
  { id: 'm-test', type: 'morning', text: 'Where might the fire test me today?' },
  { id: 'm-discipline', type: 'morning', text: 'What is one act of discipline I will complete?' },

  // Evening
  { id: 'e-command', type: 'evening', text: 'Where did I command myself today?' },
  { id: 'e-leak', type: 'evening', text: 'Where did I leak energy, and what fed it?' },
  { id: 'e-learn', type: 'evening', text: 'What did I learn today, without shame?' },

  // Urge
  { id: 'u-trigger', type: 'urge', text: 'What triggered this — and what am I actually seeking?' },
  { id: 'u-cost', type: 'urge', text: 'What would obeying this cost me tomorrow?' },
  { id: 'u-become', type: 'urge', text: 'What could this energy become if I direct it?' },

  // Lapse
  { id: 'l-before', type: 'lapse', text: 'What happened just before, and what state was I in?' },
  { id: 'l-lie', type: 'lapse', text: 'What lie did the urge tell me in the moment?' },
  { id: 'l-next', type: 'lapse', text: 'What is my next clean action, starting now?' },
];
