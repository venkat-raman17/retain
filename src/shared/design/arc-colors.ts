/**
 * Arc tones — one identity color per 10-day arc of the 90-day rite.
 *
 * The 90 days move through nine formation arcs (see `content/bundled/arcs`). Each
 * arc carries a single muted, earthen tone so the Path/home surface visibly
 * shifts as a man advances through the rite: ash stillness at the Gate, copper at
 * the Forge, lit gold at the Crown. The progression is deliberate —
 *
 *   1 Gate            ash stone      — identity, stillness
 *   2 Guard the Gates cold steel     — the watch
 *   3 The Body        warm clay      — the body returns
 *   4 Assent          slate teal     — the witness
 *   5 Inner Kingdom   muted amethyst — the throne
 *   6 The Forge       copper ember   — the fire at work
 *   7 Brotherhood     muted moss     — connection, service
 *   8 Shadow & Return deep wine-rust — the wound looked at
 *   9 The Crown       lit gold       — integration
 *
 * These are *base* hues only. Components never paint them raw — they resolve them
 * to theme-safe wash / text / border / gradient via `useSurfaceTone`. Kept in the
 * design layer (not content) so they stay identical across all four runtime
 * themes, mirroring `sharedArchetype`. Arc content carries no color field; the
 * mapping is keyed by `arcNumber` (1–9).
 */
export const ARC_TONE: Record<number, string> = {
  1: '#7A7468',
  2: '#5F7A82',
  3: '#9A6A4A',
  4: '#5F6E68',
  5: '#6E5E82',
  6: '#B86A3C',
  7: '#6B7053',
  8: '#8A4A47',
  9: '#C7A867',
};

/** Ash stone — the Gate tone, used when an arc number is out of range. */
const FALLBACK_ARC_TONE = '#7A7468';

/** Arc tone for a given arc number (1–9), with a safe fallback. */
export function arcTone(arcNumber: number): string {
  return ARC_TONE[arcNumber] ?? FALLBACK_ARC_TONE;
}
