import type { FC } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type SymbolProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Path tab — gate with center path line. The daily gate to cross. */
export const GateSigil: FC<SymbolProps> = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 7 20 L 7 8 M 17 20 L 17 8 M 7 8 L 17 8 M 12 8 L 12 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Forge tab — diamond with ember core. The fire shaped into form. */
export const EmberSigil: FC<SymbolProps> = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 12 3 L 21 12 L 12 21 L 3 12 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={2} fill={color} />
  </Svg>
);

/** Journal tab — inscribed tablet. The record of reflection. */
export const TabletSigil: FC<SymbolProps> = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={7} y={4} width={10} height={16} rx={1.5} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 9.5 9 L 14.5 9 M 9.5 12 L 14.5 12 M 9.5 15 L 12.5 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Codex tab — twin pillars with arch. The archive of formation. */
export const PillarsSigil: FC<SymbolProps> = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 8 20 L 8 11 M 16 20 L 16 11 M 8 11 A 4 4 0 0 1 16 11 M 6 20 L 18 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Hall tab — a columned hall with pediment and steps. Where the honors are kept. */
export const HallSigil: FC<SymbolProps> = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 3 8 L 12 3 L 21 8 M 5 8 L 5 17 M 12 8 L 12 17 M 19 8 L 19 17 M 4 17 L 20 17 M 3 20 L 21 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Progress/Record tab — hand mirror. Revealing the pattern. */
export const MirrorSigil: FC<SymbolProps> = ({ size = 24, color = '#888', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={11} r={7} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M 12 18 L 12 22 M 9.5 22 L 14.5 22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
