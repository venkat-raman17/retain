import type { Study } from '../../schemas';

/**
 * Studies present wisdom traditions as philosophical/historical inspiration only.
 * Every Study carries a guardrail. No medical claims, no religious authority, no
 * esoteric or partnered sexual technique (see docs/CONTENT_SAFETY.md).
 */
export const studies: readonly Study[] = [
  {
    id: 'brahmacharya-vow-and-attention',
    title: 'Brahmacharya: The Vow and the Conservation of Attention',
    lineage: 'brahmacharya',
    summary: 'An old idea that energy conserved is energy available — for a life, not just a moment.',
    historicalFrame:
      'In the yogic traditions of India, brahmacharya — often rendered "conduct of Brahman" — is described less as bare abstinence and more as the conscious conservation and wise use of vital energy, sometimes called ojas. It is paired with mastery of the senses: a steady attention that is not pulled apart by every impulse. The aim was a life of clarity and purpose, with the energy directed toward one’s highest aims.',
    retainPrinciple:
      'The energy is the ally. Conserve attention so you have something to direct — toward the body, the work, and the people you love.',
    practice:
      'Pick one gate today — a feed, a habit, an hour — and do not feed it. Notice the energy that remains.',
    reflectionPrompt: 'Where did my attention want to leak today, and what did I do with it instead?',
    guardrail:
      'This is philosophical inspiration, not medical advice. Retain does not teach religious authority or esoteric sexual technique.',
  },
  {
    id: 'guarding-the-gates-sense-restraint',
    title: 'Guarding the Gates: Sense Restraint and the First Spark',
    lineage: 'buddhist_sense_restraint',
    summary: 'The battle is usually won or lost at the moment of contact, not deep in the fire.',
    historicalFrame:
      'In Buddhist practice, indriya-samvara — "guarding the sense doors" of eye, ear, nose, tongue, body, and mind — is the discipline of watching the instant a sense impression lands, before craving or aversion can take hold. It is not a hatred of the senses; it is a calm vigilance at the threshold, so the mind is not swept away by the first spark.',
    retainPrinciple:
      'Guard the gates. The first victory is often looking away — meeting the spark with awareness instead of feeding it.',
    practice:
      'When a trigger appears today, name it at the gate: "seeing," "wanting." Let the naming create a gap, and step into the gap.',
    reflectionPrompt: 'What was the very first spark today, and what happened in the second after it?',
    guardrail:
      'This is philosophical inspiration, not a religious obligation or medical claim. The practice here is awareness, pause, and discipline.',
  },
  {
    id: 'the-inner-forge-transmutation',
    title: 'The Inner Forge: Transmutation Across Traditions',
    lineage: 'western_alchemy',
    summary: 'A single metaphor recurs across cultures: refine the raw into the noble.',
    historicalFrame:
      'Very different traditions reach for the same image. Daoist inner alchemy speaks of refining essence into energy and energy into spirit. Tibetan contemplative practice describes an "inner fire" raised and circulated with breath and attention. Western alchemy — later read by Jung as a kind of "Western yoga" — treated turning lead into gold as a symbol for transforming the raw self into the realized one. Retain borrows the metaphor of refinement, not the metaphysics or the techniques.',
    retainPrinciple:
      'Refine the fire. Raw desire, given a worthy channel, becomes strength, focus, and creation.',
    practice:
      'The next time the fire rises, choose a forge — body, mind, spirit, order, creation, or brotherhood — and pour ten real minutes into it.',
    reflectionPrompt: 'What did I turn the fire into today?',
    guardrail:
      'This is symbolic and philosophical inspiration, not medical claims and not esoteric or partnered sexual technique. Retain teaches pause, reflection, and discipline.',
  },
] as const;
