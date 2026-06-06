import type { FC } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };
type SymbolFC = FC<SymbolProps>;

const ring = (color: string, sw: number) => (
  <Circle cx={16} cy={16} r={13} stroke={color} strokeWidth={sw} />
);

/** Day 7 — the first gate crossed. */
export const Day7Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Path
      d="M 11 26 L 11 14 A 5 5 0 0 1 21 14 L 21 26 M 16 14 L 16 26"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Day 14 — two complete cycles. */
export const Day14Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Circle cx={16} cy={16} r={8} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Day 21 — the triangle of three weeks. */
export const Day21Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Path
      d="M 16 8 L 23 22 L 9 22 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Day 30 — the first month. Axis marks across two rings. */
export const Day30Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Circle cx={16} cy={16} r={7} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 16 9 L 16 13 M 16 23 L 16 19 M 9 16 L 13 16 M 23 16 L 19 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Day 45 — the halfway forge mark. Diamond of transmutation. */
export const Day45Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Path
      d="M 16 8 L 24 16 L 16 24 L 8 16 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Day 60 — two months of practice. Nested rings with vertical marks. */
export const Day60Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Circle cx={16} cy={16} r={8} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 16 8 L 16 12 M 16 24 L 16 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Day 75 — crown pillars rising above the ring. */
export const Day75Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Path
      d="M 8 16 L 8 11 M 16 16 L 16 8 M 24 16 L 24 11 M 8 16 L 24 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Day 90 — the crown. Ninety days completed. */
export const Day90Medallion: SymbolFC = ({ size = 32, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {ring(color, strokeWidth)}
    <Path
      d="M 4 22 L 4 14 L 10 18 L 16 8 L 22 18 L 28 14 L 28 22 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RITE_MEDALLION_MAP: Partial<Record<number, SymbolFC>> = {
  7: Day7Medallion,
  14: Day14Medallion,
  21: Day21Medallion,
  30: Day30Medallion,
  45: Day45Medallion,
  60: Day60Medallion,
  75: Day75Medallion,
  90: Day90Medallion,
};

/** Lookup component — renders the medallion for the given milestone day. */
export function RiteMedallion({
  day,
  size,
  color,
  strokeWidth,
}: SymbolProps & { day: number }) {
  const Medallion = RITE_MEDALLION_MAP[day];
  if (!Medallion) return null;
  return <Medallion size={size} color={color} strokeWidth={strokeWidth} />;
}
