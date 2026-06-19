import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ArcSeal, ArchetypeSigil, DaySigil, RiteMedallion, symbolStroke } from '../symbols';
import { Halo } from './halo';

/** Which bundled symbol family to render, plus its lookup key. */
export type SealArtSource =
  | { kind: 'arc'; arcNumber: number }
  | { kind: 'archetype'; archetype: string }
  | { kind: 'rite'; day: number }
  | { kind: 'day'; day: number; archetype: string; arcNumber: number; accentColor?: string }
  | { kind: 'crown' };

export interface SealArtProps {
  source: SealArtSource;
  /** Symbol diameter in px. */
  size?: number;
  /** Stroke/fill color for the symbol. */
  color: string;
  /** Render a soft glow behind the symbol. */
  halo?: boolean;
  /** Glow color (defaults to `color`). */
  haloColor?: string;
  style?: StyleProp<ViewStyle>;
}

function renderSymbol(source: SealArtSource, size: number, color: string, stroke: number): ReactNode {
  switch (source.kind) {
    case 'arc':
      return <ArcSeal arcNumber={source.arcNumber} size={size} color={color} strokeWidth={stroke} />;
    case 'archetype':
      return <ArchetypeSigil archetype={source.archetype} size={size} color={color} strokeWidth={stroke} />;
    case 'rite':
      return <RiteMedallion day={source.day} size={size} color={color} strokeWidth={stroke} />;
    case 'day':
      return (
        <DaySigil
          day={source.day}
          archetype={source.archetype}
          arcNumber={source.arcNumber}
          size={size}
          color={color}
          accentColor={source.accentColor}
          strokeWidth={stroke}
        />
      );
    case 'crown':
      return <DaySigil day={91} archetype="sovereign" arcNumber={9} crown size={size} color={color} strokeWidth={stroke} />;
    default:
      return null;
  }
}

/**
 * Large-format renderer for the bundled seal/sigil library. Picks the right
 * lookup component (arc seal, archetype sigil, rite medallion), scales the stroke
 * for the size via `symbolStroke`, and optionally lays a `Halo` behind it. Used by
 * `AppHero` and standalone (Codex, Crown, Chamber).
 */
export function SealArt({ source, size = 120, color, halo = false, haloColor, style }: SealArtProps) {
  const stroke = symbolStroke(size);
  const footprint = halo ? Math.round(size * 1.5) : size;
  return (
    <View style={[styles.wrap, { width: footprint, height: footprint }, style]}>
      {halo ? (
        <Halo color={haloColor ?? color} size={footprint} style={StyleSheet.absoluteFill} />
      ) : null}
      {renderSymbol(source, size, color, stroke)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
