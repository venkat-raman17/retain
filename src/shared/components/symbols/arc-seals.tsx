import type { FC } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };
type SymbolFC = FC<SymbolProps>;

/** Arc 1 — The Gate: doorway with path line. Enter the first day. */
export const Arc1Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 7 21 L 7 9 M 17 21 L 17 9 M 7 9 L 17 9 M 12 9 L 12 21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Arc 2 — Guard the Gates: barred gate with lock mark. Hold the threshold. */
export const Arc2Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 7 21 L 7 9 M 17 21 L 17 9 M 7 9 L 17 9 M 7 15 L 17 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={15} r={2} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Arc 3 — The Body Returns: vertebrae spine. Physical practice awakens. */
export const Arc3Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 12 3 L 12 21 M 8 7 L 16 7 M 8 11 L 16 11 M 8 15 L 16 15 M 8 19 L 16 19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Arc 4 — Discipline of Absence: empty bowl, open at top. The space of restraint. */
export const Arc4Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 3 12 A 9 9 0 0 1 21 12 M 3 12 L 21 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Arc 5 — The Inner Kingdom: square within square. The governed interior. */
export const Arc5Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={4} y={4} width={16} height={16} stroke={color} strokeWidth={strokeWidth} rx={1} />
    <Rect x={8} y={8} width={8} height={8} stroke={color} strokeWidth={strokeWidth} rx={0.5} />
    <Path
      d="M 12 4 L 12 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Arc 6 — The Forge: diamond with inner flame. Fire forged into action. */
export const Arc6Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 12 3 L 21 12 L 12 21 L 3 12 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M 12 16 C 10.5 14 10.5 11 12 9 C 13.5 11 13.5 14 12 16 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.2}
    />
  </Svg>
);

/** Arc 7 — Brotherhood and Service: twin pillars beneath an arch. Bound purpose. */
export const Arc7Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 8 21 L 8 10 M 16 21 L 16 10 M 8 10 A 4 4 0 0 1 16 10 M 5 21 L 11 21 M 13 21 L 19 21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Arc 8 — The Shadow and the Return: split circle with return arrow. Return to center. */
export const Arc8Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 12 3 L 12 21 M 19 12 L 12 12 M 16 9 L 12 12 M 16 15 L 12 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Arc 9 — The Crown: three pillars with crown-base ring. Sovereignty earned. */
export const Arc9Seal: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 3 19 L 3 13 L 8 17 L 12 9 L 16 17 L 21 13 L 21 19 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={19} r={2.5} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

const ARC_SEAL_MAP: Record<number, SymbolFC> = {
  1: Arc1Seal,
  2: Arc2Seal,
  3: Arc3Seal,
  4: Arc4Seal,
  5: Arc5Seal,
  6: Arc6Seal,
  7: Arc7Seal,
  8: Arc8Seal,
  9: Arc9Seal,
};

/** Lookup component — renders the seal for the given arcNumber (1–9). */
export function ArcSeal({
  arcNumber,
  size,
  color,
  strokeWidth,
}: SymbolProps & { arcNumber: number }) {
  const Seal = ARC_SEAL_MAP[arcNumber] ?? Arc1Seal;
  return <Seal size={size} color={color} strokeWidth={strokeWidth} />;
}
