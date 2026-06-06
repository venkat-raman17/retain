import type { DailyPathContent } from '../../schemas';

/**
 * Days 61–90: Arcs 7–9 (Brotherhood & Service, Shadow & Return, The Crown).
 * Structured draft entries — correct titles, arcs, themes, archetypes.
 * Full content to be written before v1 ship.
 */

function draft(
  id: string,
  dayNumber: number,
  arcNumber: number,
  arcTitle: string,
  title: string,
  theme: string,
  archetype: DailyPathContent['archetype'],
  openingLine: string,
  secretContentType: DailyPathContent['secretContentType'],
  crownFragment: string | null = null,
  milestoneRiteId: string | null = null,
): DailyPathContent {
  const season = arcNumber === 7
    ? 'brotherhood_and_service' as const
    : arcNumber === 8
      ? 'the_integrated_man' as const
      : 'the_integrated_man' as const;
  return {
    id, dayNumber, arcNumber, arcTitle, title, theme,
    season, archetype,
    openingLine,
    teachingBody: `[Draft] This chamber opens on Day ${dayNumber}. The teaching on "${title}" will be written here — philosophically grounded, non-medical, non-shaming. Theme: ${theme}.`,
    secretContentType,
    secretTitle: secretContentType === 'crown_fragment' ? 'Crown Fragment'
      : secretContentType === 'ancient_key' ? 'Ancient Key'
      : secretContentType === 'archetype_trial' ? `The ${archetype.charAt(0).toUpperCase() + archetype.slice(1)}'s Trial`
      : secretContentType === 'forge_assignment' ? 'Forge Assignment'
      : secretContentType === 'night_warning' ? 'Night Warning'
      : secretContentType === 'lapse_medicine' ? 'Lapse Medicine'
      : 'Hidden Teaching',
    secretBody: `[Draft] The secret for Day ${dayNumber} will be written here.`,
    command: `[Draft] Today's command will be written here.`,
    practice: `[Draft] Today's practice will be written here.`,
    forgeChallenge: `[Draft] Today's Forge challenge will be written here.`,
    journalPrompt: `[Draft] Today's journal prompt will be written here.`,
    eveningAccount: `[Draft] Tonight's account will be written here.`,
    seal: `[Draft] The seal for Day ${dayNumber} will be written here.`,
    crownFragment,
    contentStatus: 'draft',
    relatedStudyIds: [],
    relatedPrincipleIds: [],
    milestoneRiteId,
    safetyGuardrail: null,
  };
}

export const days61to90: readonly DailyPathContent[] = [
  // Arc 7: Brotherhood and Service (Days 61–70)
  draft('day-61', 61, 7, 'Brotherhood and Service', 'Do Not Disappear', 'isolation is the enemy, reaching out', 'brother', 'The man who disappears from his brothers has already lost one gate.', 'hidden_teaching'),
  draft('day-62', 62, 7, 'Brotherhood and Service', "The Brother's Hand", 'brotherhood, honest presence', 'brother', 'A brother does not need you to be strong. He needs you to be honest.', 'forge_assignment'),
  draft('day-63', 63, 7, 'Brotherhood and Service', 'Speak Before the Fall', 'accountability, honesty before crisis', 'brother', 'The time to speak is before the hour of weakness, not after.', 'archetype_trial'),
  draft('day-64', 64, 7, 'Brotherhood and Service', 'Pride Locks the Door', 'pride vs humility, asking for help', 'pilgrim', "Pride says: I don't need anyone. Humility says: I'll call before it costs me.", 'lapse_medicine'),
  draft('day-65', 65, 7, 'Brotherhood and Service', 'A Man Needs Witness', 'being seen, the regulated nervous system', 'brother', 'No man governs himself well in permanent isolation.', 'hidden_teaching'),
  draft('day-66', 66, 7, 'Brotherhood and Service', 'Serve Someone', 'service as Forge, outward attention', 'brother', "The man absorbed in another's need has less room for the compulsion.", 'night_warning'),
  draft('day-67', 67, 7, 'Brotherhood and Service', 'Repair One Bond', 'repair, honesty, relationship', 'healer', 'One honest repair is worth more than fifty avoided conversations.', 'forge_assignment'),
  draft('day-68', 68, 7, 'Brotherhood and Service', 'Leave Isolation', 'structural companionship, not solitary', 'brother', 'The cell is not the sanctuary. The cell is sometimes the problem.', 'ancient_key'),
  draft('day-69', 69, 7, 'Brotherhood and Service', 'Brotherhood Without Grievance', 'non-grievance brotherhood, building up', 'brother', 'Brotherhood is not complaint. It is the shared project of becoming stronger.', 'hidden_teaching'),
  draft('day-70', 70, 7, 'Brotherhood and Service', 'Strength Shared Is Strengthened', 'arc 7 milestone, strength multiplied by sharing', 'sovereign', 'Seventy days. The practice has begun to reach beyond the self.', 'crown_fragment', 'Strength shared is strengthened.', 'rite-day-75'),

  // Arc 8: The Shadow and the Return (Days 71–80)
  draft('day-71', 71, 8, 'The Shadow and the Return', 'The Shadow Speaks', 'shadow, Jungian recognition, naming darkness', 'sage', 'The shadow does not destroy the man who names it. It destroys the man who never does.', 'hidden_teaching'),
  draft('day-72', 72, 8, 'The Shadow and the Return', 'Shame Is Not Command', 'shame vs guilt, healing vs punishment', 'healer', 'Shame says you are the problem. Guilt says you did a wrong thing. Only one is useful.', 'lapse_medicine'),
  draft('day-73', 73, 8, 'The Shadow and the Return', 'The Pattern Beneath the Pattern', 'root patterns, second-layer work', 'sage', 'Behind the habit of the urge is usually a pattern that the urge is solving.', 'ancient_key'),
  draft('day-74', 74, 8, 'The Shadow and the Return', 'Anger Guards Grief', 'anger as protector, grief work', 'warrior', 'Beneath the anger is often a grief the man has not been permitted to feel.', 'hidden_teaching'),
  draft('day-75', 75, 8, 'The Shadow and the Return', 'The Wound Is Not the Throne', 'milestone, wound healed not worshiped', 'healer', "Seventy-five days. You have looked at the shadow. It is not the throne.", 'crown_fragment', 'The wound is not the throne.', 'rite-day-75'),
  draft('day-76', 76, 8, 'The Shadow and the Return', 'Return Without Theater', 'clean return, no drama, lapse medicine', 'pilgrim', 'The drama of the fall is not the fall. It is the next lapse in preparation.', 'lapse_medicine'),
  draft('day-77', 77, 8, 'The Shadow and the Return', 'Clean the Wound', 'repair vs worshiping the wound', 'healer', 'Clean it. Do not live in it.', 'forge_assignment'),
  draft('day-78', 78, 8, 'The Shadow and the Return', 'Study the Lapse', 'post-lapse analysis, intelligence gathering', 'sage', 'A lapse studied is information. A lapse repeated is a pattern waiting for attention.', 'archetype_trial'),
  draft('day-79', 79, 8, 'The Shadow and the Return', 'Build the Boundary', 'structural response to shadow learning', 'guardian', 'The boundary built after the lapse is stronger than the one built before it.', 'night_warning'),
  draft('day-80', 80, 8, 'The Shadow and the Return', 'The Pilgrim Continues', 'arc 8 milestone, eighty days', 'pilgrim', 'Eighty days. The shadow has been looked at. The path continues.', 'crown_fragment', 'The Pilgrim is not the man who never falls. He is the man who keeps the road.', 'rite-day-75'),

  // Arc 9: The Crown (Days 81–90)
  draft('day-81', 81, 9, 'The Crown', 'The Integrated Man', 'integration, all parts in order', 'sovereign', 'The integrated man does not suppress appetite. He governs it.', 'hidden_teaching'),
  draft('day-82', 82, 9, 'The Crown', 'Power Without Ego', 'mature power, quiet authority', 'king', 'The man who has to announce his strength does not yet own it.', 'ancient_key'),
  draft('day-83', 83, 9, 'The Crown', 'Desire With Direction', 'directed desire, permanent practice model', 'sovereign', 'The desire does not leave. The direction becomes stable.', 'crown_fragment', 'Desire with direction is not a problem. It is a life.',),
  draft('day-84', 84, 9, 'The Crown', 'The Crown Is Responsibility', 'leadership, the crown as burden and honor', 'king', 'The crown is not a reward for perfection. It is a commission for maturity.', 'forge_assignment'),
  draft('day-85', 85, 9, 'The Crown', 'The Long Path', 'preparing for post-90, what comes after', 'sovereign', 'Ninety days prepares the man. The Long Path is where he lives.', 'hidden_teaching'),
  draft('day-86', 86, 9, 'The Crown', 'Rule the Ordinary Day', 'ordinary life, daily sovereignty, no audience', 'king', 'The ordinary day is where the practice lives or dies.', 'archetype_trial'),
  draft('day-87', 87, 9, 'The Crown', 'Teach Without Preaching', 'witness, quiet example, not proselytizing', 'brother', 'The crowned man does not preach. He is present in a way that speaks.', 'hidden_teaching'),
  draft('day-88', 88, 9, 'The Crown', 'Carry the Fire Quietly', 'quiet strength, fire without announcement', 'sovereign', 'The fire that is used does not need to be displayed.', 'night_warning'),
  draft('day-89', 89, 9, 'The Crown', 'The Final Gate', 'penultimate day, last preparation', 'guardian', 'One more day of preparation. The crown is earned by what you do today, not tomorrow.', 'crown_fragment', 'The final gate is kept by the same discipline as the first.'),
  draft('day-90', 90, 9, 'The Crown', 'The Crown of Command', 'ninety-day milestone, crown received', 'sovereign', 'Ninety days does not make a man finished. It proves he can be formed.', 'crown_fragment', 'Ninety days proves the man can be formed. The crown is responsibility.', 'rite-day-90'),
];
