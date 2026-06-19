export type { SymbolProps } from './nav-icons';
export { GateSigil, EmberSigil, TabletSigil, PillarsSigil, MirrorSigil } from './nav-icons';

export {
  SpineGlyph,
  EyeGlyph,
  FlameCircleGlyph,
  GridGlyph,
  SparkGlyph,
  LinkedRingsGlyph,
  FORGE_GLYPHS,
} from './forge-glyphs';

export {
  LustGlyph,
  LonelinessGlyph,
  BoredomGlyph,
  StressGlyph,
  FatigueGlyph,
  HabitGlyph,
  EscapismGlyph,
  AngerGlyph,
  UnknownGlyph,
  TRIGGER_GLYPHS,
} from './trigger-glyphs';

export {
  Arc1Seal,
  Arc2Seal,
  Arc3Seal,
  Arc4Seal,
  Arc5Seal,
  Arc6Seal,
  Arc7Seal,
  Arc8Seal,
  Arc9Seal,
  ArcSeal,
} from './arc-seals';

export { DaySigil, daySigilParams } from './day-sigil';
export type { DaySigilParams, DaySigilProps, DayAccentStyle } from './day-sigil';

export {
  MonkSigil,
  WarriorSigil,
  CraftsmanSigil,
  KingSigil,
  LoverSigil,
  PilgrimSigil,
  SageSigil,
  BrotherSigil,
  GuardianSigil,
  BuilderSigil,
  HealerSigil,
  SovereignSigil,
  ArchetypeSigil,
} from './archetype-sigils';

export {
  Day7Medallion,
  Day14Medallion,
  Day21Medallion,
  Day30Medallion,
  Day45Medallion,
  Day60Medallion,
  Day75Medallion,
  Day90Medallion,
  RiteMedallion,
} from './rite-medallions';

export {
  NoJournalSymbol,
  NoForgeSymbol,
  NoRecordSymbol,
  NoRitesSymbol,
  NoPathSymbol,
} from './empty-state-symbols';

export { RitualDivider } from './ritual-divider';
export { ScreenCrest } from './screen-crest';

/** Scale strokeWidth inversely with display size so visual stroke weight is consistent. */
export function symbolStroke(displaySize: number, base = 1.5): number {
  return base * (24 / displaySize);
}
