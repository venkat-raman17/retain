import type { FC } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };
type SymbolFC = FC<SymbolProps>;

/** Body — vertebrae spine. Physical practice and grounding. */
export const SpineGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 12 4 L 12 20 M 9 8 L 15 8 M 9 12 L 15 12 M 9 16 L 15 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Mind — eye with iris. Focused attention and inner sight. */
export const EyeGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 4 12 C 4 6 20 6 20 12 C 20 18 4 18 4 12 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={3.5} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={12} cy={12} r={1.5} fill={color} />
  </Svg>
);

/** Spirit — flame within still circle. Energy held in stillness. */
export const FlameCircleGlyph: SymbolFC = ({
  size = 24,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 12 17 C 10 14 10 11 12 8 C 14 11 14 14 12 17 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.15}
    />
  </Svg>
);

/** Order — cross within a square. Aligned action and structure. */
export const GridGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={5} y={5} width={14} height={14} rx={1} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 12 5 L 12 19 M 5 12 L 19 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Creation — diagonal stroke with burst. The act of making. */
export const SparkGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 5 19 L 17 7 M 17 7 L 20 4 M 17 7 L 21 8 M 17 7 L 19 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Brotherhood — two linked rings. Bound purpose and service. */
export const LinkedRingsGlyph: SymbolFC = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={9} cy={12} r={5} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={15} cy={12} r={5} stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const FORGE_GLYPHS: Record<string, SymbolFC> = {
  body: SpineGlyph,
  mind: EyeGlyph,
  spirit: FlameCircleGlyph,
  order: GridGlyph,
  creation: SparkGlyph,
  brotherhood: LinkedRingsGlyph,
};
