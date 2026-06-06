import type { CodexEntry } from '../schemas';

/**
 * The Codex: bundled long-form teachings. Philosophical and practical, never
 * medical. No claims of treatment or cure — these are perspectives and practices.
 */
export const codexEntries: readonly CodexEntry[] = [
  {
    id: 'transmutation-basics',
    title: 'What transmutation actually means',
    category: 'principle',
    summary: 'Redirecting energy is a skill, not a suppression.',
    body: 'Transmutation is the deliberate redirection of sexual and creative energy toward a chosen aim — work, training, art, presence. It is not about clenching against desire. It is about giving the current a channel. When the energy has somewhere worthy to go, the compulsion loses its grip.',
    readMinutes: 4,
  },
  {
    id: 'urge-as-wave',
    title: 'The urge is a wave',
    category: 'mindset',
    summary: 'Urges crest and pass when you stop feeding them.',
    body: 'An urge is not a command. It rises, peaks, and falls — usually within minutes — if you neither fight it nor follow it. You can watch it like weather. Breathe, soften, and let it move through. Each time you ride one out, the next one carries less authority.',
    readMinutes: 3,
  },
  {
    id: 'why-not-shame',
    title: 'Why this practice refuses shame',
    category: 'mindset',
    summary: 'Self-respect outperforms self-attack, every time.',
    body: 'Harsh self-talk feels like discipline but works against it. A man who respects himself recovers faster, learns more, and stays in the practice longer. You are not here to win an argument with yourself. You are here to become someone you trust.',
    readMinutes: 3,
  },
  {
    id: 'building-the-day',
    title: 'Design the day, not the urge',
    category: 'practice',
    summary: 'Environment and routine do most of the work.',
    body: 'Willpower is unreliable when tired. Structure is not. Decide in advance how mornings begin, where the phone sleeps, what you do when restless. The strongest practice is built before the moment arrives, so that in the moment there is little to decide.',
    readMinutes: 5,
  },
];
