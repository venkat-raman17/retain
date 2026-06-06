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
      'In the yogic traditions of India, brahmacharya — often rendered "conduct of Brahman" — is described less as bare abstinence and more as the conscious conservation and wise use of vital energy, sometimes called ojas. It is paired with mastery of the senses: a steady attention that is not pulled apart by every impulse. The aim was a life of clarity and purpose, with the energy directed toward one\'s highest aims.',
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
  {
    id: 'daoist-inner-alchemy-essence-to-spirit',
    title: 'Daoist Inner Alchemy: The Refinement of Essence into Spirit',
    lineage: 'daoist_inner_alchemy',
    summary: 'From the Chinese traditions: vital essence is not scattered but refined and circulated.',
    historicalFrame:
      "In classical Daoism, particularly the tradition of neidan (inner alchemy), the body is understood as a sacred laboratory. Jing — vital essence — is the raw fuel. Through breath, attention, and subtle practices, jing is refined into qi (vital energy), and qi into shen (spirit or radiant awareness). This is the internal counterpart to external alchemy; the \"philosopher's stone\" is not external but the perfected integration of body, energy, and consciousness.",
    retainPrinciple:
      'What is refined rises. Essence that is scattered is lost; essence that is gathered and refined becomes the force of clarity and presence.',
    practice:
      'Today, notice the moment desire or excitement arises in the body. Breathe into that sensation as if drawing it upward. Do not force; let breath and awareness gently circulate it.',
    reflectionPrompt: 'When energy rose in my body today, what happened when I met it with breath and attention instead of immediate action?',
    guardrail:
      'This is philosophical and historical inspiration. Retain does not teach esoteric techniques, respiratory practices as medical treatment, or claims about energy channels.',
  },
  {
    id: 'tibetan-inner-fire-heat-discipline',
    title: 'The Inner Fire: Heat, Breath, and the Transformation of Difficulty',
    lineage: 'tibetan_inner_fire',
    summary: 'In Tibetan practice, difficulty itself becomes fuel for the fire that burns confusion.',
    historicalFrame:
      'Tibetan Buddhist practitioners, particularly in the Anuttarayoga tantras, speak of tummo — an "inner heat" cultivated through visualization, breathing, and rigorous mental discipline. It is not physical warmth but a metaphor for the clarity and warmth of presence that arises when all energy is gathered in a single point of awareness. The practice is one of transmutation: the very emotions and energies that usually scatter the mind become, through discipline and clear seeing, the fuel for enlightenment.',
    retainPrinciple:
      'Heat burns through confusion. The urge, the restlessness, the resistance — all are fuel. Gather it with awareness and it becomes clarity.',
    practice:
      'When you feel the stirring of desire, anxiety, or restlessness, sit for three breaths. Feel the sensation fully; do not push it away. Then imagine drawing that energy inward, gathering it into steady focus.',
    reflectionPrompt: 'What did I burn through today — and what clarity came on the other side?',
    guardrail:
      'This is philosophical inspiration, not medical advice or esoteric technique. Retain teaches conscious awareness and redirection, not breathing exercises as treatment.',
  },
  {
    id: 'stoic-discipline-apatheia-freedom',
    title: 'Stoic Discipline: The Freedom That Comes From Within',
    lineage: 'stoic_command',
    summary: 'The Stoics taught: master your assent, and nothing outside you will shake your peace.',
    historicalFrame:
      'The Stoics — particularly Epictetus and Marcus Aurelius — taught a clear division: some things are within your power (your judgments, your effort, your will), and some are not (your body, your reputation, external events). The practice is to withdraw your attachment from what you cannot control and to invest all your will in what you can: your choice, your focus, your character. Apatheia — often mistranslated as "apathy" — is not numbness but freedom from the compulsion of irrational desire.',
    retainPrinciple:
      'Master what is yours: choice. The urge will come; you decide what to do with it. That decision is entirely your own.',
    practice:
      'When an impulse arises, pause and ask: "Is this my choice, or am I being carried?" Then deliberately choose your next step — even if it is to pause a moment longer.',
    reflectionPrompt: 'Today, where did I have command of my choice? Where did I give it away?',
    guardrail:
      'This is philosophical inspiration from classical Stoicism. Retain does not teach suppression or shame, but rather the dignity of conscious choice.',
  },
  {
    id: 'monastic-watchfulness-guarding-heart',
    title: 'Monastic Watchfulness: Guarding the Heart Against Distraction',
    lineage: 'monastic_watchfulness',
    summary: 'Across traditions, monastics teach: the heart is guarded at the threshold of attention.',
    historicalFrame:
      'Christian desert fathers, Buddhist monastics, and practitioners across traditions speak of nepsis and samadhi — a constant, gentle vigilance of the mind. Not harshness or self-punishment, but a tender and sustained attentiveness to what is arising in consciousness. The teaching is that a single unguarded moment of attention can unravel weeks of practice, while a single moment of mindful return can weave the whole back together. Watchfulness is not paranoia; it is love for one\'s own spiritual life.',
    retainPrinciple:
      'Guard your peace gently. A single unguarded gate can drain the work of days; a single return can gather it back.',
    practice:
      'At three moments today — morning, midday, evening — simply pause and notice: "Where is my attention right now? Is it where I want it?" If not, gently return it.',
    reflectionPrompt: 'When did I guard my attention today, and when did it slip? What brought me back?',
    guardrail:
      'This is philosophical inspiration, not religious obligation or shame-based practice. Watchfulness is an act of self-respect, not self-punishment.',
  },
  {
    id: 'sufi-purification-nafs-refinement',
    title: 'Sufi Purification: Disciplining the Ego and Refining the Self',
    lineage: 'sufi_purification',
    summary: 'The Sufi path teaches: refine the self through discipline, service, and surrender.',
    historicalFrame:
      "In Sufi Islam, tazkiyah — \"purification\" or \"development of the soul\" — is the central practice. The nafs, often translated as ego or the lower self, is not destroyed but transformed and refined. Through structured discipline, remembrance, service to others, and radical honesty, the nafs that was driven by compulsion and appetite becomes the nafs that is attuned to the sacred. This is not shame but elevation; the goal is not to hate the body or desire, but to align them with higher purpose.",
    retainPrinciple:
      'Refine the self. What was raw becomes noble not by destruction but by direction toward the sacred — toward meaning, service, and the highest in yourself.',
    practice:
      'Choose one act of service or discipline today: show up honestly with someone, do a task that demands focus, or sit in honesty about what you truly want beneath the impulse.',
    reflectionPrompt: 'Today, where did I elevate my desire toward something higher than itself?',
    guardrail:
      'This is philosophical and spiritual inspiration, not religious dogma or medical claim. The practice is self-refinement through honesty and intention, not asceticism or shame.',
  },
  {
    id: 'greco-roman-pneuma-vital-spirit',
    title: 'Greco-Roman Pneuma: The Vital Spirit and the Virtues',
    lineage: 'greco_roman_pneuma',
    summary: 'The ancients understood: vital spirit is the substance of excellence, guarded through discipline.',
    historicalFrame:
      'In Greek and Roman philosophy, pneuma — vital breath or spirit — was understood as the animating force that made a human being alive and capable of virtue. The philosophers taught that this vital energy could be scattered through indulgence or gathered and refined through discipline. The goal was not asceticism for its own sake but the cultivation of arete — excellence or human flourishing — which required the integrated strength of body, mind, and character. The warrior, the athlete, the sage all understood this.',
    retainPrinciple:
      'Gather your spirit. Excellence — in strength, in mind, in character — begins with gathering the energy that makes you alive.',
    practice:
      'Today, choose one practice that demands full presence: hard physical work, a skill you are building, or a conversation in which you show up entirely. Pour your vitality into it.',
    reflectionPrompt: 'When I brought my full presence to something today, how did it feel? How did I change?',
    guardrail:
      'This is historical and philosophical inspiration from classical sources. Retain does not make medical or performance claims; the practice is the cultivation of focused presence and discipline.',
  },
  {
    id: 'kabbalistic-repair-channeling-desire',
    title: 'Kabbalistic Repair: Channeling Desire Toward the Sacred',
    lineage: 'kabbalistic_repair',
    summary: 'The Jewish mystical tradition teaches: nothing is wasted if directed toward tikkun — repair and wholeness.',
    historicalFrame:
      'In Kabbalah, the concept of tikkun olam — repairing or perfecting the world — is paired with the understanding that desire and sexuality are not inherently profane but sacred when directed toward the right intention. Rather than viewing the body as an obstacle, Kabbalists teach that the body\'s desires, when refined and redirected toward spiritual purpose and marital covenant, participate in cosmic wholeness. The practice is one of elevation and integration, not denial.',
    retainPrinciple:
      'Channel desire toward wholeness. What rises in you is not evil; it is energy seeking a worthy container. Find that container and pour it there.',
    practice:
      'When energy or desire arises today, pause and ask: "What am I actually hungry for? What is this reaching toward?" Let that deeper hunger guide you toward something whole and true.',
    reflectionPrompt: 'Today, what did I really want beneath the surface urge? Did I feed that deeper hunger?',
    guardrail:
      'This is philosophical inspiration from Jewish mysticism. Retain does not teach religious doctrine or make claims about spiritual status or cosmic consequences.',
  },
  {
    id: 'warrior-athlete-discipline-excellence',
    title: 'Warrior and Athlete: Sublimation Through Discipline and Excellence',
    lineage: 'warrior_athlete_discipline',
    summary: 'Across cultures, warriors and athletes teach the same thing: raw power becomes excellence through structured discipline.',
    historicalFrame:
      'Ancient warriors, athletes, and martial traditions understood a fundamental principle: raw physical drive and aggression do not make a warrior or an athlete; they make a liability. True strength comes from discipline, focus, and the channeling of raw energy into skill, timing, and strategic thinking. The Olympic athlete trained for years not to indulge the body\'s hunger for ease but to refine it into performance. The warrior cultivated calm amid chaos. Both understood that the body\'s raw energy, without the mind\'s discipline and direction, leads to exhaustion and defeat.',
    retainPrinciple:
      'Power becomes excellence through discipline. The fire in your body is not your enemy; it is fuel. Channel it into strength, focus, and the mastery of your craft.',
    practice:
      'Today, when energy or intensity arises, do not dissipate it or suppress it. Pour it into something that demands your excellence: work that matters, a skill you are building, or a goal that calls for your full presence.',
    reflectionPrompt: 'Today, what would have been wasted became powerful. What did I do with the raw energy that arose?',
    guardrail:
      'This is philosophical inspiration from ancient and modern martial/athletic traditions. Retain does not make medical or performance enhancement claims; the practice is the cultivation of discipline and excellence through focused effort.',
  },
] as const;
