import type { FC } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { ProceduralSigil, sigilSeedFromKey } from './procedural-sigil';

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };
type SymbolFC = FC<SymbolProps>;

/** Monk — narrow arched doorway with inner dot. Silence and sacred attention. */
export const MonkSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 9 20 L 9 10 A 3 3 0 0 1 15 10 L 15 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={15} r={1.5} fill={color} />
  </Svg>
);

/** Warrior — pentagon shield split by diagonal. Strength through discipline. */
export const WarriorSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 5 5 L 19 5 L 19 14 L 12 20 L 5 14 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M 7 7 L 17 17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Craftsman — L-square with chisel mark. Mastery through making. */
export const CraftsmanSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 5 19 L 5 7 L 9 7 M 5 19 L 17 19 L 17 15 M 14 10 L 8 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** King — three pillars of ascending height. Authority earned in self-command. */
export const KingSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 8 20 L 8 15 M 12 20 L 12 8 M 16 20 L 16 15 M 8 15 L 16 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Lover — open circle enclosing an eye. Desire observed without enslavement. */
export const LoverSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Open circle, gap at right */}
    <Path
      d="M 15 4 A 9 9 0 1 0 15 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Eye inside */}
    <Path
      d="M 5 12 C 5 9 19 9 19 12 C 19 15 5 15 5 12 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={2} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={12} cy={12} r={0.8} fill={color} />
  </Svg>
);

/** Pilgrim — winding path to a star. The journey over the destination. */
export const PilgrimSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 4 20 C 4 16 14 16 10 12 C 7 9 16 9 20 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 4-point star at destination */}
    <Path
      d="M 20 5 L 20 2 M 20 5 L 23 5 M 20 5 L 20 8 M 20 5 L 17 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Sage — eye above open page. Wisdom only given; never kept. */
export const SageSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Eye at top */}
    <Path
      d="M 4 9 C 4 5 20 5 20 9 C 20 13 4 13 4 9 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={9} r={2} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={12} cy={9} r={0.8} fill={color} />
    {/* Open book below */}
    <Path
      d="M 5 17 L 19 17 M 5 21 L 19 21 M 12 17 L 12 21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Brother — two linked rings. Obligation that strengthens. */
export const BrotherSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={9} cy={12} r={5} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={15} cy={12} r={5} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Guardian — arched gate with locked bar. The gatekeeper of the inner room. */
export const GuardianSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 7 20 L 7 10 A 5 4 0 0 1 17 10 L 17 20 M 7 20 L 17 20 M 7 14 L 17 14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={14} r={1.5} fill={color} />
  </Svg>
);

/** Builder — four stacked stones in a cairn. Rising from the foundation. */
export const BuilderSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={18} width={18} height={3} rx={0.5} stroke={color} strokeWidth={strokeWidth} />
    <Rect x={5} y={14} width={14} height={3} rx={0.5} stroke={color} strokeWidth={strokeWidth} />
    <Rect x={8} y={10} width={8} height={3} rx={0.5} stroke={color} strokeWidth={strokeWidth} />
    <Rect x={10} y={6} width={4} height={3} rx={0.5} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Healer — circle enclosing a leaf with stem. Restoration through returning. */
export const HealerSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 12 17 C 9 15 9 9 12 7 C 15 9 15 15 12 17 Z M 12 7 L 12 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Sovereign — cross within a ring. Dominion over all four directions of self. */
export const SovereignSigil: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 12 3 L 12 21 M 3 12 L 21 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

const ARCHETYPE_SIGIL_MAP: Record<string, SymbolFC> = {
  monk: MonkSigil,
  warrior: WarriorSigil,
  craftsman: CraftsmanSigil,
  king: KingSigil,
  lover: LoverSigil,
  pilgrim: PilgrimSigil,
  sage: SageSigil,
  brother: BrotherSigil,
  guardian: GuardianSigil,
  builder: BuilderSigil,
  healer: HealerSigil,
  sovereign: SovereignSigil,
};

/**
 * Lookup component — renders the curated sigil for a known archetype id, or a
 * deterministic {@link ProceduralSigil} for any other key (the 90 per-day
 * archetype slugs have no hand-drawn mark, so they get a generated one).
 */
export function ArchetypeSigil({
  archetype,
  size,
  color,
  strokeWidth,
}: SymbolProps & { archetype: string }) {
  const Sigil = ARCHETYPE_SIGIL_MAP[archetype];
  if (Sigil) return <Sigil size={size} color={color} strokeWidth={strokeWidth} />;
  return <ProceduralSigil seed={sigilSeedFromKey(archetype)} size={size} color={color} strokeWidth={strokeWidth} />;
}
