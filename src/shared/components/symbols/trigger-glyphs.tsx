import type { FC } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };
type SymbolFC = FC<SymbolProps>;

/** Lust — rising flame. The heat of desire. */
export const LustGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 12 20 C 8 17 8 12 10 8 C 11 5 12 3 12 3 C 13 5 14 9 16 12 C 17 16 16 19 12 20 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.1}
    />
  </Svg>
);

/** Loneliness — isolated dot inside large ring. The ache of separateness. */
export const LonelinessGlyph: SymbolFC = ({
  size = 24,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={12} cy={12} r={1.5} fill={color} />
  </Svg>
);

/** Boredom — empty square. The hollow of unstimulated time. */
export const BoredomGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={5} y={5} width={14} height={14} rx={1} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Stress — compressed parallel lines. Pressure without release. */
export const StressGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 5 10.5 L 19 10.5 M 5 12 L 19 12 M 5 13.5 L 19 13.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Fatigue — resting half-moon bowl. The body sinking. */
export const FatigueGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 3 12 A 9 9 0 0 1 21 12 M 3 12 L 21 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Habit — circular loop with arrow. The groove of automatic response. */
export const HabitGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 18 12 A 6 6 0 1 0 12 18 M 12 18 L 9 16 M 12 18 L 15 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Escapism — broken arrow pointing outward. The pull toward exit. */
export const EscapismGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 4 12 L 10 12 M 14 12 L 20 12 M 20 12 L 16 9 M 20 12 L 16 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Anger — sharp jagged burst. The heat without direction. */
export const AngerGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 12 20 L 7 13 L 10 13 L 6 6 L 12 12 L 18 6 L 14 13 L 17 13 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Unknown — question mark inside circle. The unnamed urge. */
export const UnknownGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 8 10 C 8 7 16 7 16 10 C 16 13 12 13 12 14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={18} r={1.5} fill={color} />
  </Svg>
);

export const TRIGGER_GLYPHS: Record<string, SymbolFC> = {
  lust: LustGlyph,
  loneliness: LonelinessGlyph,
  boredom: BoredomGlyph,
  stress: StressGlyph,
  fatigue: FatigueGlyph,
  habit: HabitGlyph,
  escapism: EscapismGlyph,
  anger: AngerGlyph,
  unknown: UnknownGlyph,
};
