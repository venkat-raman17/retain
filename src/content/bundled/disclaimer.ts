import type { Disclaimer } from '../schemas';

/**
 * Non-medical disclaimer. Retain makes no medical claims and is not a treatment.
 * Increment `version` if the wording materially changes so the app can ask for
 * re-acknowledgement.
 */
export const disclaimer: Disclaimer = {
  version: 1,
  title: 'A note before you begin',
  paragraphs: [
    'Retain is a practice and reflection app for personal growth. It is not medical or mental-health care, not therapy, and not a substitute for professional support.',
    'Nothing here diagnoses, treats, or claims to cure any condition. The ideas are philosophical and practical perspectives, offered for self-mastery — take what serves you and leave the rest.',
    'If you are struggling in a way that feels beyond a daily practice, please reach out to a qualified professional or people you trust. Asking for support is a sign of strength.',
  ],
  supportNote:
    'You are the one doing this work, and you deserve patience. Go at a pace that respects your life.',
};
