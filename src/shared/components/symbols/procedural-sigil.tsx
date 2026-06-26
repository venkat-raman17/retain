import type { FC } from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

/**
 * ProceduralSigil — a deterministic line-art glyph generated from a numeric seed.
 *
 * The app's per-day archetypes (90 of them) each need their own focal mark, which
 * is far more than the hand-drawn set covers. This generator produces a clean,
 * varied glyph — an outer N-gon plus one of a few inner motifs — fully determined
 * by the seed (no `Math.random`), so the same seed always renders the same mark
 * and different seeds read as visibly different. It draws on the same 24×24,
 * stroke-based canvas as the curated sigils so it composes identically.
 */

type SymbolProps = { size?: number; color?: string; strokeWidth?: number };

/** Deterministic numeric seed from a string or number key (FNV-1a; no randomness). */
export function sigilSeedFromKey(key: string | number): number {
  if (typeof key === 'number') return Math.trunc(Math.abs(key)) >>> 0;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const C = 12;

/** Path string for a regular polygon centered at (12,12). */
function polygonPath(points: number, radius: number, rotationDeg: number): string {
  const rot = (rotationDeg * Math.PI) / 180 - Math.PI / 2;
  let d = '';
  for (let i = 0; i < points; i++) {
    const a = rot + (i * 2 * Math.PI) / points;
    const x = C + Math.cos(a) * radius;
    const y = C + Math.sin(a) * radius;
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

export const ProceduralSigil: FC<SymbolProps & { seed: number }> = ({
  seed,
  size = 24,
  color = '#888',
  strokeWidth = 1.5,
}) => {
  const s = seed >>> 0;
  const points = 3 + (s % 6); // 3–8 sided outer form
  const rotation = s % 360;
  const motif = Math.trunc(s / 6) % 4; // inner motif selector

  const spokes =
    motif === 2
      ? Array.from({ length: points }, (_, i) => {
          const a = (rotation * Math.PI) / 180 - Math.PI / 2 + (i * 2 * Math.PI) / points;
          return (
            <Line
              key={`s${i}`}
              x1={C}
              y1={C}
              x2={C + Math.cos(a) * 8}
              y2={C + Math.sin(a) * 8}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })
      : null;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={polygonPath(points, 8, rotation)}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {motif === 0 ? <Circle cx={C} cy={C} r={2} fill={color} /> : null}
      {motif === 1 ? (
        <Path
          d={polygonPath(points, 4, rotation + 180 / points)}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      ) : null}
      {spokes}
      {motif === 3 ? <Circle cx={C} cy={C} r={3.6} stroke={color} strokeWidth={strokeWidth} /> : null}
    </Svg>
  );
};
