import type { SafetyContent } from '../../schemas';

/**
 * The single non-medical disclaimer and the crisis/help resources. Global and
 * offline: no single country's hotline is hardcoded (see docs/CONTENT_SAFETY.md).
 */
export const safetyContent: SafetyContent = {
  disclaimer: {
    version: 1,
    title: 'A note before you begin',
    paragraphs: [
      'Retain is a philosophical self-mastery, journaling, and discipline app. It is not medical advice, not therapy, and not a mental-health service.',
      'Retain does not diagnose, treat, cure, or prevent any condition, and it makes no claims about testosterone, fertility, attraction, disease, depression, anxiety, or athletic performance.',
      'The teachings draw on many traditions as philosophical and historical inspiration only — never as religious authority, medical fact, or sexual technique.',
      'Desire is not evil. The body is not dirty. The practice is about pause, reflection, and discipline.',
    ],
    supportNote:
      'You are the one doing this work, and you deserve patience. Go at a pace that respects your life.',
  },
  resources: {
    title: 'If you need more than a practice',
    intro:
      'Retain is a practice, not a lifeline. If you are in crisis, at risk of harming yourself or others, or struggling with compulsive behavior, please reach out now.',
    items: [
      'Contact your local emergency number immediately if you or anyone is in danger.',
      'Reach out to a licensed mental-health professional.',
      'If a crisis or support line is available in your country, contact it.',
      'Speak to someone you trust — today, not later. Asking for help is strength.',
    ],
  },
};
