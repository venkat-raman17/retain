import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { daySeed } from '@/shared/lib';

import { ProceduralSigil } from './procedural-sigil';

/** A 48-unit canvas so the archetype sigil (24) has room for orbiting accents. */
const VB = 48;
const C = VB / 2;
/** Radii for up to three arc-banded rings (outer → inner). */
const RING_RADII = [21, 16.5, 12] as const;
/** Where the day's accent marks orbit. */
const ACCENT_RADIUS = 21;

export type DayAccentStyle = 'tick' | 'dot' | 'diamond';

export interface DaySigilParams {
  /** 1–3 concentric rings, banded by arc (progression reads outward → fuller). */
  rings: number;
  /** 5–12 accent marks on the outer ring. */
  accentCount: number;
  /** Rotation of the accent ring, 0–359°. */
  accentRotation: number;
  /** Which mark to draw at each accent position. */
  markStyle: DayAccentStyle;
}

const ACCENT_STYLES: readonly DayAccentStyle[] = ['tick', 'dot', 'diamond'];

/**
 * Deterministic visual parameters for a day's sigil. Pure: `(day, arcNumber)` →
 * a fixed param set, with no `Math.random`, so day N always looks the same and
 * no two days look identical. `crown` forces the fullest, climactic form.
 */
export function daySigilParams(day: number, arcNumber: number, crown = false): DaySigilParams {
  if (crown) {
    return { rings: 3, accentCount: 12, accentRotation: 15, markStyle: 'diamond' };
  }
  const seed = daySeed(day);
  return {
    rings: Math.min(3, Math.max(1, Math.ceil(arcNumber / 3))),
    accentCount: 5 + (seed % 8), // 5–12
    accentRotation: seed % 360,
    markStyle: ACCENT_STYLES[Math.trunc(seed / 360) % ACCENT_STYLES.length] ?? 'tick',
  };
}

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };

function accentMark(style: DayAccentStyle, x: number, y: number, color: string, sw: number, i: number) {
  const key = `a${i}`;
  switch (style) {
    case 'dot':
      return <Circle key={key} cx={x} cy={y} r={1.1} fill={color} />;
    case 'diamond':
      return (
        <Path
          key={key}
          d={`M ${x} ${y - 1.6} L ${x + 1.6} ${y} L ${x} ${y + 1.6} L ${x - 1.6} ${y} Z`}
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    default: {
      // 'tick' — a short radial stroke pointing outward from the ring.
      const ux = (x - C) / ACCENT_RADIUS;
      const uy = (y - C) / ACCENT_RADIUS;
      return (
        <Line
          key={key}
          x1={C + ux * (ACCENT_RADIUS - 1.6)}
          y1={C + uy * (ACCENT_RADIUS - 1.6)}
          x2={C + ux * (ACCENT_RADIUS + 1.8)}
          y2={C + uy * (ACCENT_RADIUS + 1.8)}
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );
    }
  }
}

export interface DaySigilProps extends SymbolProps {
  /** 1–90 (or 91 for crown via the `crown` flag). Seeds the per-day accents AND the centered focal glyph. */
  day: number;
  /** Retained for source compatibility; the focal glyph is now seeded by `day`, not the archetype. */
  archetype?: string;
  /** 1–9 — bands the ring count. Ignored when `crown`. */
  arcNumber: number;
  /** Optional second color for the orbiting accents (defaults to `color`). */
  accentColor?: string;
  /** Render the climactic crown form (3 rings, full accents). */
  crown?: boolean;
}

/**
 * The per-day composite mark: arc-banded concentric rings + a per-day ring of
 * accents + the day's archetype sigil at the center. Deterministic and
 * single-/dual-color, so it composes through `SealArt` like the other symbols
 * while making every day visibly distinct.
 */
export function DaySigil({
  day,
  arcNumber,
  size = 96,
  color = '#888',
  accentColor,
  strokeWidth,
  crown = false,
}: DaySigilProps) {
  const { rings, accentCount, accentRotation, markStyle } = daySigilParams(day, arcNumber, crown);
  // Target a consistent ~1.5px visual stroke regardless of display size.
  const ringStroke = strokeWidth ? strokeWidth * (VB / 24) : (1.5 * VB) / size;
  const innerSize = Math.round(size * 0.52);
  const innerStroke = (1.5 * 24) / innerSize;
  const accents = Array.from({ length: accentCount }, (_, i) => {
    const angle = ((accentRotation + (i * 360) / accentCount) * Math.PI) / 180;
    const x = C + Math.cos(angle) * ACCENT_RADIUS;
    const y = C + Math.sin(angle) * ACCENT_RADIUS;
    return accentMark(markStyle, x, y, accentColor ?? color, ringStroke, i);
  });
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} fill="none" style={StyleSheet.absoluteFill}>
        {RING_RADII.slice(0, rings).map((r, i) => (
          <Circle key={`r${i}`} cx={C} cy={C} r={r} stroke={color} strokeWidth={ringStroke} opacity={i === 0 ? 1 : 0.6} />
        ))}
        {accents}
      </Svg>
      <ProceduralSigil seed={daySeed(day)} size={innerSize} color={color} strokeWidth={innerStroke} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
