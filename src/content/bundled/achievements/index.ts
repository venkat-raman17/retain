import type { Achievement } from '../../schemas/achievement.schema';

export const achievements: readonly Achievement[] = [
  {
    id: 'first-pause',
    title: 'The First Pause',
    description:
      'Earned when a man stops, observes the urge, and chooses — the founding act of the practice.',
    sealSource: 'semantic',
    sealId: 'support',
    criteria: { kind: 'pause_logged', params: { count: 1 } },
  },
  {
    id: 'first-forge',
    title: 'Fire Meets Form',
    description:
      'Earned when energy is directed into real action for the first time — proof the fire has a path.',
    sealSource: 'semantic',
    sealId: 'accent',
    criteria: { kind: 'forge_act_logged', params: { count: 1 } },
  },
  {
    id: 'the-covenant',
    title: 'The Covenant',
    description:
      'Earned on the first day of the practice — the day a man speaks a vow and means it.',
    sealSource: 'arc',
    sealId: '1',
    criteria: { kind: 'days_completed', params: { count: 1 } },
  },
  {
    id: 'gate-one',
    title: 'The Gate Held',
    description:
      'Arc 1 complete: ten days of standing for something, learning the difference between impulse and intent.',
    sealSource: 'arc',
    sealId: '1',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 1 } },
  },
  {
    id: 'gate-two',
    title: 'The Watch Kept',
    description:
      'Arc 2 complete: ten days guarding what enters, learning that the battle is won or lost at the gate.',
    sealSource: 'arc',
    sealId: '2',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 2 } },
  },
  {
    id: 'gate-three',
    title: 'The Body Returned',
    description:
      'Arc 3 complete: thirty days in, the body has become an ally trained enough to carry the vow.',
    sealSource: 'arc',
    sealId: '3',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 3 } },
  },
  {
    id: 'gate-four',
    title: 'The Assent Trained',
    description:
      'Arc 4 complete: forty days of practicing the pause between impression and action — impressions do not command.',
    sealSource: 'arc',
    sealId: '4',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 4 } },
  },
  {
    id: 'gate-five',
    title: 'The Kingdom Ordered',
    description:
      'Arc 5 complete: fifty days with reason and spirit in their rightful place, governing appetite without crushing it.',
    sealSource: 'arc',
    sealId: '5',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 5 } },
  },
  {
    id: 'gate-six',
    title: 'The Forge Lit',
    description:
      'Arc 6 complete: sixty days of transmutation — the fire directed into work, craft, and creation.',
    sealSource: 'arc',
    sealId: '6',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 6 } },
  },
  {
    id: 'gate-seven',
    title: 'The Brotherhood Kept',
    description:
      'Arc 7 complete: seventy days, and a man has not disappeared — others know he is here and trust his word.',
    sealSource: 'arc',
    sealId: '7',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 7 } },
  },
  {
    id: 'gate-eight',
    title: 'The Shadow Named',
    description:
      'Arc 8 complete: eighty days of looking at what the lapse protected — and not flinching from what was found.',
    sealSource: 'arc',
    sealId: '8',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 8 } },
  },
  {
    id: 'gate-nine',
    title: 'The Crown Integrated',
    description:
      'Arc 9 complete: ninety days — the fire carried with responsibility, the rite complete, the Long Path open.',
    sealSource: 'arc',
    sealId: '9',
    criteria: { kind: 'arc_cleared', params: { arcNumber: 9 } },
  },
  {
    id: 'the-return',
    title: 'The Return',
    description:
      'The man who returns has the stronger practice — earning this honor is an act of command, not a mark of failure.',
    sealSource: 'archetype',
    sealId: 'healer',
    criteria: { kind: 'return_recorded', params: { count: 1 } },
  },
  {
    id: 'the-watcher',
    title: 'The Watcher',
    description:
      'Earned after ten pauses logged — the inner witness is trained, and the gap between urge and action is real.',
    sealSource: 'archetype',
    sealId: 'guardian',
    criteria: { kind: 'pause_logged', params: { count: 10 } },
  },
  {
    id: 'fire-balance',
    title: 'Fire in All Forms',
    description:
      'Earned when forge acts span all six categories — the fire has been given to body, mind, spirit, order, creation, and brotherhood.',
    sealSource: 'semantic',
    sealId: 'accent',
    criteria: { kind: 'forge_all_categories', params: {} },
  },
  {
    id: 'ten-days',
    title: 'Ten Days Standing',
    description:
      'Earned at ten consecutive days on the path — long enough to know the vow is real.',
    sealSource: 'arc',
    sealId: '1',
    criteria: { kind: 'days_completed', params: { count: 10 } },
  },
  {
    id: 'thirty-days',
    title: 'Thirty Days Forged',
    description:
      'Earned at thirty days on the path — a month of the fire held, the body shifting, the practice taking root.',
    sealSource: 'arc',
    sealId: '3',
    criteria: { kind: 'days_completed', params: { count: 30 } },
  },
  {
    id: 'the-scribe',
    title: 'The Scribe',
    description:
      'Earned after ten journal entries — a man who writes what he sees knows his patterns and cannot be ambushed by them.',
    sealSource: 'archetype',
    sealId: 'sage',
    criteria: { kind: 'journal_entries', params: { count: 10 } },
  },
  {
    id: 'gates-kept',
    title: 'Gates Kept',
    description:
      'Earned after seven boundary check-ins held — seven quiet victories won before the test ever arrived.',
    sealSource: 'arc',
    sealId: '2',
    criteria: { kind: 'boundary_kept', params: { count: 7 } },
  },
  {
    id: 'the-crown',
    title: 'The Crown',
    description:
      'Earned when the crown is received — not a reward for perfection, but recognition that a man has been formed enough to carry fire with responsibility.',
    sealSource: 'arc',
    sealId: '9',
    criteria: { kind: 'crown_received', params: {} },
  },
] as const;
