import type { DailyPathContent } from '../../schemas';

/**
 * Days 31–60: Arcs 4–6 (Discipline of Assent, The Inner Kingdom, The Forge).
 * These are structured draft entries — correct titles, arcs, themes, and schema,
 * with substantive placeholders. Full content to be written before v1 ship.
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
  const season = arcNumber === 4
    ? 'discipline_of_assent' as const
    : arcNumber === 5
      ? 'inner_order' as const
      : 'transmutation' as const;
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

export const days31to60: readonly DailyPathContent[] = [
  // Arc 4: The Discipline of Assent (Days 31–40)
  draft('day-31', 31, 4, 'The Discipline of Assent', 'The Urge Is an Impression', 'Stoic impression, assent, inner distance', 'sage', 'Not every voice that speaks within you deserves an answer.', 'ancient_key'),
  draft('day-32', 32, 4, 'The Discipline of Assent', 'Consent Is Yours', 'choice, prohairesis, the final authority', 'sovereign', 'The compulsion does not rule without your agreement.', 'hidden_teaching'),
  draft('day-33', 33, 4, 'The Discipline of Assent', 'Name the Voice', 'internal voices, pattern recognition', 'sage', 'The voice of compulsion has a style. Learn it.', 'lapse_medicine'),
  draft('day-34', 34, 4, 'The Discipline of Assent', 'The Space Between', 'the gap, pause as location', 'sovereign', 'The practice lives in the space between impulse and action.', 'forge_assignment'),
  draft('day-35', 35, 4, 'The Discipline of Assent', 'What Is in My Control?', 'Stoic control, dichotomy, inner citadel', 'warrior', "Control the controllable. Everything else is weather.", 'ancient_key'),
  draft('day-36', 36, 4, 'The Discipline of Assent', 'Do Not Add the Story', 'narrative, the second arrow, added suffering', 'healer', 'The urge is one thing. The story you add to it is another.', 'hidden_teaching'),
  draft('day-37', 37, 4, 'The Discipline of Assent', 'The Judgment Pause', 'withholding judgment, Stoic suspension', 'sage', 'Between the impression and the judgment, pause.', 'night_warning'),
  draft('day-38', 38, 4, 'The Discipline of Assent', 'One Clean Act', 'repair, simplicity, next right thing', 'pilgrim', 'When everything is unclear: one clean act.', 'archetype_trial'),
  draft('day-39', 39, 4, 'The Discipline of Assent', 'The Inner Witness', 'self-observation, examined life', 'sage', 'The examined man is harder to deceive.', 'hidden_teaching'),
  draft('day-40', 40, 4, 'The Discipline of Assent', 'Command Is Trained', 'arc 4 milestone, discipline earned', 'guardian', 'Forty days of practiced command. This is not theory anymore.', 'crown_fragment', 'Command is trained, not given.', 'rite-day-45'),

  // Arc 5: The Inner Kingdom (Days 41–50)
  draft('day-41', 41, 5, 'The Inner Kingdom', 'Appetite Is Not King', 'Platonic soul, inner order', 'king', 'Plato described the soul as a kingdom. The question is who holds the throne.', 'ancient_key'),
  draft('day-42', 42, 5, 'The Inner Kingdom', 'The Spirited Part', 'thumos, indignation, worthy courage', 'warrior', 'The spirited part is an ally — when reason gives it direction.', 'forge_assignment'),
  draft('day-43', 43, 5, 'The Inner Kingdom', 'Reason Must Rule', 'sovereignty, daily governance', 'sovereign', 'Reason does not rule by force. It rules by repetition.', 'hidden_teaching'),
  draft('day-44', 44, 5, 'The Inner Kingdom', 'The Inner Throne', 'integration, three parts aligned', 'sovereign', 'When appetite, spirit, and reason are aligned, the man is undivided.', 'archetype_trial'),
  draft('day-45', 45, 5, 'The Inner Kingdom', 'The King Returns', 'milestone day 45, inner order deepens', 'king', 'Forty-five days. The inner kingdom is taking shape.', 'crown_fragment', 'The undivided man is not desireless. He is ordered.', 'rite-day-45'),
  draft('day-46', 46, 5, 'The Inner Kingdom', 'Order Before Desire', 'structure first, then satisfaction', 'king', 'Desire follows structure. Structure does not follow desire.', 'night_warning'),
  draft('day-47', 47, 5, 'The Inner Kingdom', 'The Small Kingdom', 'local order, room, schedule, speech', 'king', 'The man who governs his room has practiced self-rule.', 'hidden_teaching'),
  draft('day-48', 48, 5, 'The Inner Kingdom', 'Speech, Room, Body, Time', 'four domains of daily governance', 'king', 'Govern the small domains. The large ones follow.', 'ancient_key'),
  draft('day-49', 49, 5, 'The Inner Kingdom', 'The Crown Begins Inside', 'inner preparation for Day 50', 'sovereign', 'The crown is not given. It is grown.', 'forge_assignment'),
  draft('day-50', 50, 5, 'The Inner Kingdom', 'The Throne Is Guarded', 'arc 5 milestone, halfway', 'sovereign', 'Fifty days. Halfway through the rite. The throne has been held.', 'crown_fragment', 'The throne is guarded daily, not won once.', 'rite-day-45'),

  // Arc 6: The Forge (Days 51–60)
  draft('day-51', 51, 6, 'The Forge', 'The Forge Opens', 'transmutation, the furnace lit', 'craftsman', 'The fire has been conserved. Now it must become something.', 'hidden_teaching'),
  draft('day-52', 52, 6, 'The Forge', 'Energy Seeking Form', 'desire as creative force, Daoist jing', 'builder', 'Raw desire does not ask to be suppressed. It asks to be shaped.', 'ancient_key'),
  draft('day-53', 53, 6, 'The Forge', 'Make Something Real', 'craft, production, thirty-minute rule', 'craftsman', 'Not planning to make. Making.', 'forge_assignment'),
  draft('day-54', 54, 6, 'The Forge', 'Craft Over Consumption', 'creation vs consumption, energy direction', 'craftsman', 'Every hour of consumption is an hour not forging.', 'archetype_trial'),
  draft('day-55', 55, 6, 'The Forge', 'Study Burns Fog', 'learning as Forge act, mind category', 'sage', 'The fire enters the mind through serious study.', 'hidden_teaching'),
  draft('day-56', 56, 6, 'The Forge', 'Work Receives the Fire', 'work as transmutation, body of labor', 'builder', 'The work that receives the fire becomes strong work.', 'forge_assignment'),
  draft('day-57', 57, 6, 'The Forge', 'Prayer Receives the Fire', 'contemplative practice, spirit category', 'monk', 'The fire poured into prayer does not diminish. It deepens.', 'ancient_key'),
  draft('day-58', 58, 6, 'The Forge', 'Service Receives the Fire', 'service as Forge act, brotherhood category', 'brother', 'The fire given to someone else\'s need becomes the best kind of strength.', 'hidden_teaching'),
  draft('day-59', 59, 6, 'The Forge', 'The Fire Needs a Vessel', 'container discipline, holding energy', 'guardian', 'Energy without a vessel is entropy. Choose the vessel.', 'night_warning'),
  draft('day-60', 60, 6, 'The Forge', 'Quiet Strength', 'arc 6 milestone, sixty days, quiet power', 'sovereign', 'Sixty days. The fire has been shaped. It does not need to announce itself.', 'crown_fragment', 'Quiet strength is the kind that lasts.', 'rite-day-60'),
];
