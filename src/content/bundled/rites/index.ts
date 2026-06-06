import type { Rite } from '../../schemas';

/**
 * Milestone rites — ceremonial passages, not badges. Each marks a real threshold.
 * They are remembered, not collected.
 */
export const rites: readonly Rite[] = [
  {
    id: 'rite-day-7',
    title: 'The First Gate',
    milestoneDay: 7,
    ceremonialPassage:
      'Seven days.\n\nYou have proven that the pause is real — that the gap between impulse and action is not a theory but a place you can stand. The gate behind you is the one that separated intention from practice. You have crossed it.',
    selfAuditQuestions: [
      'What surprised me about this week?',
      'Which gate was hardest to guard?',
      'What did I turn the fire into, even once?',
      'Where did I feel the practice strengthening?',
    ],
    vowRenewal:
      'I do not require perfection to continue.\nI require honesty and one more step.\nThe Path is mine to walk.',
    forgeChallenge:
      'Today, complete one act of discipline before any pleasure — train, study, clean, build, or serve — and mark the day as begun.',
    seal: 'The gate is real. The man who guards it is being made.',
  },
  {
    id: 'rite-day-14',
    title: 'The Gatekeeper',
    milestoneDay: 14,
    ceremonialPassage:
      'Fourteen days.\n\nYou have lived long enough in this practice to know the specific shape of your temptation. Not temptation in the abstract — yours. The hour it arrives, the mood it needs, the gate it enters through. That knowledge is the beginning of real power.',
    selfAuditQuestions: [
      'Which trigger has appeared most often?',
      'Which gate has been hardest to hold?',
      'What small ritual protected me most?',
      'Where did I look away too late, and what would earlier have looked like?',
    ],
    vowRenewal:
      'I know my gates.\nI know my hours.\nI will guard them with structure, not willpower alone.',
    forgeChallenge:
      'Build one new boundary today based on what these two weeks have taught you. Name it, write it, and begin keeping it tonight.',
    seal: 'The man who knows his gates is already a step ahead of the fire.',
  },
  {
    id: 'rite-day-21',
    title: 'The Forge Opens',
    milestoneDay: 21,
    ceremonialPassage:
      'Twenty-one days.\n\nThe first three weeks are the hardest — the body has its old arguments, the habits have their momentum, and the compulsion speaks with a practiced voice. You heard all of it. You paused anyway. Now the practice is no longer a decision you make each morning. It is a thing you have.',
    selfAuditQuestions: [
      'What has the body taught me about when I am most vulnerable?',
      'What has improved that I did not expect?',
      'What did I build or accomplish that came from redirected energy?',
      'What does the Forge mean to me now — what am I transmuting it into?',
    ],
    vowRenewal:
      'The fire is mine to direct.\nI do not waste it.\nI do not fear it.\nI forge with it.',
    forgeChallenge:
      'Complete your most demanding Forge act yet. Longer, harder, or more meaningful than anything in the past three weeks. Mark it.',
    seal: 'Twenty-one days of choosing direction over compulsion. The Forge is open.',
  },
  {
    id: 'rite-day-30',
    title: 'The Oath Renewed',
    milestoneDay: 30,
    ceremonialPassage:
      'Thirty days.\n\nThirty days is not the summit. It is the proof that the man can live by a chosen word. The fire has risen. The body has argued. The old patterns have spoken. Yet here you are. That is not luck. That is character — practiced into being.',
    selfAuditQuestions: [
      'What has become easier?',
      'What still hunts me?',
      'Which boundary saved me most?',
      'Which boundary must be strengthened?',
      'What did I build with the fire this month?',
    ],
    vowRenewal:
      'I do not worship the streak.\nI honor the practice.\nI return to command.\nThe oath is not a sentence. It is a spine.',
    forgeChallenge:
      'Complete one difficult act before any pleasure today — train, clean, build, study, serve, or repair. Let the day be authored.',
    seal: 'The oath is not a sentence. It is a spine.',
  },
  {
    id: 'rite-day-45',
    title: 'The Inner Throne',
    milestoneDay: 45,
    ceremonialPassage:
      'Forty-five days.\n\nYou have crossed the midpoint of the first season and entered the inner order. You know your appetites by name now. You have discovered that reason does not shout — it governs quietly, if given the throne. The question is no longer whether you can pause. The question is who rules your interior kingdom.',
    selfAuditQuestions: [
      'Where has appetite asked for what spirit or reason actually needed?',
      'Where has courage — the spirited part — carried you beyond what appetite allowed?',
      'What would it mean to live by reason without losing fire?',
      'What does inner order feel like on a well-lived day?',
    ],
    vowRenewal:
      'Appetite has force.\nSpirit has courage.\nReason must give direction.\nI choose the governor within.',
    forgeChallenge:
      'For one full day, pause before every significant action and ask: "Which part of me is speaking?" Then choose from reason.',
    seal: 'The inner kingdom is not won. It is daily governed.',
  },
  {
    id: 'rite-day-60',
    title: 'The Quiet Strength',
    milestoneDay: 60,
    ceremonialPassage:
      'Sixty days.\n\nTwo months of choosing the forge over the waste. You have been tested in every mood — rested, hungry, tired, alone, elated, disappointed. The practice has met them all. What is being built inside you is not a streak. It is a character trait: the quiet expectation that you will choose command when it matters.',
    selfAuditQuestions: [
      'How has my relationship with desire changed?',
      'What have I built or become that I could not have without this practice?',
      'Where does the fire go most reliably now?',
      'What would I tell myself at day one?',
    ],
    vowRenewal:
      'I do not transmute from perfection.\nI transmute from practice.\nThe question is not only what I avoided.\nThe question is what I built.',
    forgeChallenge:
      'Name the most significant thing you have created, repaired, or strengthened in sixty days. Write it, and give it another thirty minutes of real work today.',
    seal: 'The quiet strength is the kind no one gives you. It is only ever earned.',
  },
  {
    id: 'rite-day-75',
    title: "The Brother's Hand",
    milestoneDay: 75,
    ceremonialPassage:
      'Seventy-five days.\n\nYou have kept a practice largely in silence, on a device, inside your own discipline. That is right and necessary. But now the practice is asking you to extend — not inward further, but outward: toward the men who are still standing in the fire with no map, no pause, no tools. Brotherhood is not softness. It is one of the strongest acts a man can make.',
    selfAuditQuestions: [
      'Where has isolation made the urge louder?',
      'Who in my life is fighting something similar, alone?',
      'What has my practice cost in terms of honest connection?',
      'Where could I extend strength instead of keeping it private?',
    ],
    vowRenewal:
      'I do not practice only for myself.\nStrength that stays secret serves no one.\nI am becoming the kind of man others can point to.',
    forgeChallenge:
      'Reach one man with honesty today — a call, a message, a presence — not to perform your discipline, but to be genuinely present with someone else\'s struggle.',
    seal: 'Isolation makes the urge louder. Brotherhood gives the man back his name.',
  },
  {
    id: 'rite-day-90',
    title: 'The Crown of Command',
    milestoneDay: 90,
    ceremonialPassage:
      'Ninety days.\n\nA season held. Steel is tempered by heat and time — not by avoiding the fire, but by standing in it and keeping your shape. You have stood in the heat. You have made mistakes, returned, and continued. You are not the same man who began.\n\nThe crown is not an ending. It is the day you discover the practice is no longer a discipline you maintain — it is the kind of man you are becoming.',
    selfAuditQuestions: [
      'Who have I become that day one could not have imagined?',
      'What has the practice cost me that was worth the price?',
      'What fires have I directed well, and which still need more skill?',
      'What does the next season of the practice look like?',
    ],
    vowRenewal:
      'I do not stop here.\nI do not rest on the count.\nThe practice does not end at ninety days.\nIt begins to become who I am.',
    forgeChallenge:
      'Choose your most ambitious Forge act to date — something that reflects who you have become, not who you were. Complete it today.',
    seal: 'The crown of command is not a destination. It is a direction you choose every morning.',
  },
] as const;
