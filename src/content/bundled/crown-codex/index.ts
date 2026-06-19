import type { CrownCodexItemInput } from '../../schemas/crown-codex.schema';

/**
 * Post-90 Long Path content. Unlocked after the Crown is received.
 * This content is evergreen — not daily unlocks, but permanent reference material
 * for the man who has completed the rite and carries the fire into ordinary days.
 */
export const crownCodex: readonly CrownCodexItemInput[] = [
  {
    id: 'crown-you-are-not-done',
    title: 'You Are Not Done',
    category: 'what_next',
    body:
      'Ninety days does not produce a finished man. It produces a formed man. The difference matters. A finished man has nowhere to go. A formed man has a shape — a vow, a discipline, a practice — and continues to be shaped by it.\n\nThe crown is not a graduation. It is a commission. You have proven you can be formed. Now you must decide what to build with that shape.',
    practice: 'Write one sentence: what does the crowned man intend to build in the year ahead?',
    reflectionPrompt: 'What would it mean to live from this practice for the rest of my life — not perfectly, but honestly?',
    seal: 'A crowned man has a shape. A formed man has work.',
  },
  {
    id: 'crown-beware-spiritual-pride',
    title: 'Beware Spiritual Pride',
    category: 'warning',
    body:
      'There is a particular danger after a long streak: the man mistakes his discipline for superiority. He looks at others who have not walked the path and feels contempt. He begins to preach. He identifies himself with his practice rather than being shaped by it.\n\nThis is spiritual pride, and it is a subtle lapse. The practice exists to serve others through you — not to give you a reason to look down on anyone.\n\nThe energy is the ally. The man who hordes it for the sake of feeling superior has also wasted it.',
    practice: 'Find someone to serve today without mentioning your practice.',
    reflectionPrompt: 'Has the discipline made me more or less open to others? Honest answer.',
    seal: 'The crown is not a throne over others.',
  },
  {
    id: 'crown-keep-the-gates',
    title: 'Keep the Gates',
    category: 'long_path',
    body:
      'The Long Path does not mean the gates no longer matter. The impulse does not retire because you have walked ninety days. The gates — the eyes, the phone, the isolating hour — remain. What changes is the quality of your attention at the gate.\n\nA crowned man guards his gates with experience, not effort. He has seen the pattern often enough to recognize it early. He does not need to white-knuckle it at midnight. He set the gate in the morning.',
    practice: 'Review your boundaries. Which still hold? Which have weakened? Strengthen one today.',
    reflectionPrompt: 'What gate have I left open that I know I should close?',
    seal: 'The gate is kept before the battle begins.',
  },
  {
    id: 'crown-build-rule-of-life',
    title: 'Build a Rule of Life',
    category: 'maintenance',
    body:
      'Monastic traditions have always recognized that virtue requires structure. A rule of life is not a list of prohibitions — it is a rhythm: times of silence, times of work, times of service, times of rest. The rhythm makes the vow sustainable across years, not just across ninety days.\n\nYour rule of life is personal. It might be: no phone before the morning rite, training three days a week, one honest conversation per week, one act of service per month. Small, durable commitments that form a container.',
    practice: 'Write three elements of your personal rule of life that you intend to keep permanently.',
    reflectionPrompt: 'Which rhythm, if I kept it for a year, would most transform my ordinary days?',
    seal: 'The rule holds what willpower cannot.',
  },
  {
    id: 'crown-serve-younger-men',
    title: 'Serve Younger Men',
    category: 'service',
    body:
      'A man who has walked the path alone has one use for the discipline: himself. A man who walks the path and then turns to offer his hand to someone younger has turned the fire into something that multiplies.\n\nYou do not need to preach. You do not need to start a movement. You need to be honest about the struggle, visible in the practice, and available when another man needs a word of truth rather than empty validation.',
    practice: 'Is there a younger man in your life who is struggling quietly? Reach out.',
    reflectionPrompt: 'What would I have wanted someone to say to me at the beginning?',
    seal: 'Strength shared is strengthened.',
  },
  {
    id: 'crown-fire-never-leaves',
    title: 'The Fire Never Leaves',
    category: 'long_path',
    body:
      'Do not believe that the desire goes away. The fire is not tamed by ninety days. What changes is your relationship to it — you no longer experience it only as compulsion. You experience it as energy that requires direction.\n\nOn the Long Path, the fire is still there. The gate still needs to be kept. The practice still needs to be practiced. The difference is that you know how, and you have proof that you can.',
    practice: 'When desire rises today, name it clearly and give it a Forge Act within five minutes.',
    reflectionPrompt: 'How has my relationship to desire changed? Be specific.',
    seal: 'The fire that cannot be extinguished can be given a worthy vessel.',
  },
  {
    id: 'crown-how-to-begin-again',
    title: 'How to Begin Again',
    category: 'return',
    body:
      'Even crowned men lapse. Not because the crown is false, but because the practice is for life — and life includes failure.\n\nAfter the Crown, a lapse is not a return to Day 1. The crown is not stripped. The Long Path records it as a repair event. You acknowledge what happened, you name the lesson, you repair one thing, and you continue.\n\nThe crown is not lost in one weak hour. But it must be honored by honest repair.',
    practice: 'If you have lapsed recently: write the lesson in one sentence and name one repair.',
    reflectionPrompt: 'What does returning without shame look like at this stage of the practice?',
    seal: 'The crown is kept by repair, not by perfection.',
  },
  {
    id: 'crown-quiet-power',
    title: 'Quiet Power',
    category: 'long_path',
    body:
      'The man who has been crowned is not loud about it. He does not need to announce the practice, wear it like a badge, or use it to shame others. The power is quiet precisely because it has somewhere to go.\n\nHis energy is in his work, his body, his presence, and his relationships. The fire is not in his speech; it is in what he builds. Others may not know what he has done, but they will notice what he is becoming.',
    practice: 'Do one thing today that costs you quietly and serves someone else without recognition.',
    reflectionPrompt: 'Where is the fire going in my life right now — toward production, or toward display?',
    seal: 'The crowned man carries the fire quietly.',
  },
  {
    id: 'crown-long-path',
    title: 'The Long Path',
    category: 'long_path',
    body:
      'After ninety days, the question is not "how long can I hold?" It is "how do I live this way permanently?" The Long Path is the answer.\n\nThe Long Path does not count days the same way. It counts practice days — days when you engaged the vow, kept the gate, forged the energy, and returned to order after disorder. A single week of genuine practice in the Long Path is worth more than a streak without roots.\n\nThis is the life you have begun to build. Continue it.',
    practice: 'Set one intention for the next ninety days of the Long Path.',
    reflectionPrompt: 'What does my life look like in one year if I keep this practice honestly?',
    seal: 'The Long Path is not harder than the first ninety days. It is deeper.',
  },
  {
    id: 'crown-strength-without-contempt',
    title: 'Strength Without Contempt',
    category: 'warning',
    body:
      'The practice builds real strength. That strength can quietly become contempt if it is not watched — contempt for those who have not done the work, contempt for the body and its desires, contempt for ordinary life.\n\nStrength that has no tenderness is not integrated strength. The crowned man has earned something. What he has earned is the capacity to be genuinely kind — not soft, but genuinely kind — because he is no longer afraid of the fire inside him.',
    practice: 'Speak one generous and honest word to someone who does not have what you have built.',
    reflectionPrompt: 'Is there anyone I have looked down on because of this practice? Be honest.',
    seal: 'Strength without contempt is the measure of integration.',
  },
];
