import { useId } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export interface HaloProps {
  /** The glow color (typically a surface tone's base). */
  color: string;
  /** Diameter of the glow in px. */
  size: number;
  /** Peak opacity at the center (0–1). */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * A soft radial glow — the Pause "aura" technique generalized for hero art.
 * Purely decorative; render it behind a symbol. Static (no animation), so it is
 * safe under Reduce Motion.
 */
export function Halo({ color, size, intensity = 0.18, style }: HaloProps) {
  // SVG gradient ids must be unique and free of `:` (which useId() emits).
  const id = `halo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = size / 2;
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={intensity} />
            <Stop offset="70%" stopColor={color} stopOpacity={intensity * 0.22} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
