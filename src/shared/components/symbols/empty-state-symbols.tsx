import type { FC } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };
type SymbolFC = FC<SymbolProps>;

/** No Journal entries — blank tablet awaiting inscription. */
export const NoJournalSymbol: SymbolFC = ({
  size = 48,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Rect
      x={14}
      y={8}
      width={20}
      height={32}
      rx={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Single faint ruling — empty, waiting */}
    <Path
      d="M 18 20 L 30 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeOpacity={0.4}
    />
  </Svg>
);

/** No Forge acts — unlit ember diamond. The fire not yet directed. */
export const NoForgeSymbol: SymbolFC = ({
  size = 48,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      d="M 24 4 L 44 24 L 24 44 L 4 24 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* No inner flame — unlit */}
  </Svg>
);

/** No Record data — dark mirror. Nothing yet reflected. */
export const NoRecordSymbol: SymbolFC = ({
  size = 48,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={20} r={14} stroke={color} strokeWidth={strokeWidth} />
    {/* Handle */}
    <Path
      d="M 24 34 L 24 44 M 18 44 L 30 44"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Empty reflection arc — the dark mirror */}
    <Path
      d="M 16 16 A 11 11 0 0 1 32 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeOpacity={0.3}
    />
  </Svg>
);

/** No Rites reached — sealed ring with lock. The milestone not yet opened. */
export const NoRitesSymbol: SymbolFC = ({
  size = 48,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={22} r={15} stroke={color} strokeWidth={strokeWidth} />
    <Circle cx={24} cy={22} r={10} stroke={color} strokeWidth={strokeWidth} />
    {/* Lock mark at bottom of rings */}
    <Rect
      x={21}
      y={34}
      width={6}
      height={5}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M 21 34 A 3 3 0 0 1 27 34"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** No Path — closed gate. The threshold not yet stepped through. */
export const NoPathSymbol: SymbolFC = ({
  size = 48,
  color = '#888',
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Gate frame */}
    <Path
      d="M 10 42 L 10 18 L 38 18 L 38 42"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Gate bar — locked */}
    <Path
      d="M 10 30 L 38 30"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Lock ring on bar */}
    <Circle cx={24} cy={30} r={3} stroke={color} strokeWidth={strokeWidth} />
    {/* Base */}
    <Path
      d="M 7 42 L 41 42"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
