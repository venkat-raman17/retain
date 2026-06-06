# Content safety

Retain's content can genuinely help or genuinely harm depending on tone. This document is the
rulebook for **everything a user reads** — bundled content and UI copy alike. When writing or
reviewing copy, this overrides style preferences.

## The frame (memorize this)

> **The energy is the ally. The compulsion is the enemy. The man is never the enemy.**

Everything follows from that. Desire is honored, not denied. A lapse is information and an
invitation to return, never a verdict on the man.

## Voice

Aspirational · masculine but warm · mystical but not medical · direct but never cruel ·
practice-based, not prescription-based · monastic, serious, calm.

**Not**: gym-bro hype, drill-sergeant contempt, clinical/medical tone, purity policing,
grievance, or salesmanship.

## Hard prohibitions

1. **No medical claims.** Do not claim Retain increases testosterone, improves fertility, cures
   addiction, treats anxiety/depression, boosts attraction, or guarantees athletic/sexual
   performance. No diagnosis, treatment, or "cure" language of any kind.
2. **No shame mechanics.** No purity/impurity framing, no calling the man weak, dirty, a failure,
   or broken. No "start from zero," no scoreboard of disgrace.
3. **No misogyny / no grievance.** Never blame women, society, modernity, or sexuality. Retain
   builds men up; it does not recruit them into resentment.
4. **No explicit sexual-technique instruction.** No karezza/edging mechanics, no karmamudra, no
   partnered tantra, no sex magic, no occult sexual practice. Traditions are discussed at a high,
   philosophical level only.
5. **No religious-authority claims.** Lineages are framed as historical/philosophical/contemplative
   **inspiration**, not as doctrine the user must obey.

## Allowed vs disallowed copy

| Theme | ✅ Allowed | ❌ Disallowed |
| --- | --- | --- |
| A lapse | "A lapse ends a streak. It does not end the practice. Learn and return." | "You failed. Start from zero. You're weak." |
| The body/desire | "Desire is not evil. The body is not dirty." | "Stay pure. Don't be filthy." |
| Effort | "You paused. That is the rep." | "You defeated lust forever. You are pure now." |
| Benefit | "This practice trains command and attention." | "This raises your testosterone and cures your addiction." |
| Traditions | "In Daoist thought, energy is something to be refined — a useful metaphor for direction." | "Do this Daoist sexual technique to retain chi during intercourse." |
| Women | (not a topic; focus is on the man's practice) | "Modern women / society did this to you." |
| Crisis | "If this is beyond a daily practice, reach out to a professional or someone you trust." | "You don't need anyone — just discipline." |

## Lineages — framing rules

Supported lineages (Brahmacharya, Buddhist sense-restraint, Daoist inner alchemy, Tibetan inner
fire, Stoic command, monastic watchfulness, Sufi purification, Greco-Roman pneuma, Kabbalistic
repair, Western alchemy, warrior/athlete discipline) are always presented as **inspiration, not
proof**. Every Study/lineage entry must carry a **guardrail** line, e.g.:

- "This is philosophical inspiration, not medical advice."
- "Retain does not teach religious authority or esoteric sexual technique."
- "This practice is about pause, reflection, and discipline."

Convert guilt into **repair**. Convert desire into **direction**. Convert tradition into
**metaphor**.

## The disclaimer

Ship exactly one honest, plain disclaimer (`src/content/bundled/disclaimer.ts`), reachable from
onboarding and Settings. It states Retain is a philosophical self-mastery practice — **not
medical advice, not therapy, not a mental-health service** — and points anyone in crisis toward
professional help and trusted people, **without hardcoding a single country's hotline** (the app
is offline and global).

## Automated guard

`src/testing/content-safety.ts` scans all bundled content for a list of degrading/abusive terms,
and `src/content/content.test.ts` fails the build if any appear. The scanner blocks **contempt**,
not topics — anti-shame discussion is allowed. The scanner is a backstop, not a substitute for
reading copy against this document.

## Reviewer checklist

- [ ] No medical claim (testosterone/fertility/attraction/depression/anxiety/disease/performance).
- [ ] No shame, purity, or punishment language.
- [ ] No misogyny or grievance.
- [ ] No explicit sexual technique.
- [ ] Any tradition framed as inspiration, with a guardrail line.
- [ ] Lapse copy emphasizes recovery and return.
- [ ] Reads as if spoken to a younger brother you believe in.
