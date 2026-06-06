import type { Arc } from '../../schemas/arc.schema';

export const arcs: readonly Arc[] = [
  {
    id: 'arc-1-the-vow',
    arcNumber: 1,
    title: 'The Vow',
    dayStart: 1,
    dayEnd: 10,
    centralQuestion: 'Who am I when the urge rises?',
    description:
      'The first arc is not about willpower. It is about identity. Before a man can govern desire, he must know himself well enough to stand for something. The vow is the line drawn between impulse and intention.',
    completionCopy:
      'You have spoken the vow and kept it for ten days. You know the difference between the compulsion and the self who chooses. Enter Arc 2.',
  },
  {
    id: 'arc-2-guard-the-gates',
    arcNumber: 2,
    title: 'Guard the Gates',
    dayStart: 11,
    dayEnd: 20,
    centralQuestion: 'What am I feeding before I fall?',
    description:
      'The battle is rarely won or lost in the moment of the urge. It is won or lost at the gate — the phone opened in bed, the eyes that linger, the boredom left unfed. This arc teaches structural discipline: guard what enters.',
    completionCopy:
      'You have kept the watch at the gates for ten days. You know which inputs feed what. Enter Arc 3.',
  },
  {
    id: 'arc-3-the-body',
    arcNumber: 3,
    title: 'The Body Must Be Included',
    dayStart: 21,
    dayEnd: 30,
    centralQuestion: 'Is my body trained enough to carry my vow?',
    description:
      'The spirit wants to hold. The body, untrained, overrules it. This arc makes the body an ally: through movement, breath, sleep, and physical discipline, the vow is given a physical container strong enough to hold fire.',
    completionCopy:
      'Thirty days. The body is learning to be on the side of the vow. Enter Arc 4 with a body that has been tested.',
  },
  {
    id: 'arc-4-discipline-of-assent',
    arcNumber: 4,
    title: 'The Discipline of Assent',
    dayStart: 31,
    dayEnd: 40,
    centralQuestion: 'Do I obey every voice that appears within me?',
    description:
      'The Stoics taught that between impression and action lies the assent — the moment of consent. This arc trains the pause at the level of thought: not fighting the impression, but learning not to follow it automatically.',
    completionCopy:
      'You have trained the inner witness for ten days. Impressions do not command you. Enter Arc 5.',
  },
  {
    id: 'arc-5-the-inner-kingdom',
    arcNumber: 5,
    title: 'The Inner Kingdom',
    dayStart: 41,
    dayEnd: 50,
    centralQuestion: 'Which part of me sits on the throne?',
    description:
      "Plato's republic of the soul: appetite, spirited will, and reason. When appetite rules, the king is starved. This arc installs reason and spirit in their rightful place — not by crushing appetite, but by governing it.",
    completionCopy:
      'Fifty days. The inner order is taking shape. Reason holds counsel. Enter Arc 6.',
  },
  {
    id: 'arc-6-the-forge',
    arcNumber: 6,
    title: 'The Forge',
    dayStart: 51,
    dayEnd: 60,
    centralQuestion: 'What am I building with the fire?',
    description:
      'Transmutation is not suppression. By this point the fire is real and the man is its steward. This arc is about production: what work, what craft, what creation receives the energy that would otherwise be discharged?',
    completionCopy:
      'Sixty days. You have forged with the fire. The work exists. Enter Arc 7.',
  },
  {
    id: 'arc-7-brotherhood',
    arcNumber: 7,
    title: 'Brotherhood and Service',
    dayStart: 61,
    dayEnd: 70,
    centralQuestion: 'Who becomes stronger because I am becoming stronger?',
    description:
      'A man who has walked sixty days in silence has something to offer. This arc moves the practice outward: toward honest connection, service, accountability, and the kind of loyalty that grows when men stop hiding.',
    completionCopy:
      'Seventy days. You have not disappeared. Others know you are here. Enter Arc 8.',
  },
  {
    id: 'arc-8-shadow-and-return',
    arcNumber: 8,
    title: 'The Shadow and the Return',
    dayStart: 71,
    dayEnd: 80,
    centralQuestion: 'What pattern am I ready to stop hiding from?',
    description:
      'The shadow is not the lapse. It is what the lapse protects. By day seventy, a man has enough practice to look at the wound honestly — the loneliness, the anger, the grief — and repair it without drama.',
    completionCopy:
      'Eighty days. You have looked at the shadow and not flinched. Enter Arc 9.',
  },
  {
    id: 'arc-9-the-crown',
    arcNumber: 9,
    title: 'The Crown',
    dayStart: 81,
    dayEnd: 90,
    centralQuestion: 'How does a crowned man live after the rite?',
    description:
      'The final arc is integration. The man has been tested in body, mind, attention, and shadow. The crown is not a reward for perfection. It is the recognition that a man has been formed enough to carry the fire with responsibility.',
    completionCopy:
      'Ninety days. You have walked the first rite. The crown is responsibility, not decoration. The Long Path begins here.',
  },
];
