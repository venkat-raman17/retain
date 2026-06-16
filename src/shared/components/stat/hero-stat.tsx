import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

import { useCountUp } from '../motion';
import { AppText, type TextColor } from '../text';

export interface HeroStatProps {
  label: string;
  value: string;
  /** Token color for the value (ignored if `valueColorHex` is set). */
  color?: TextColor;
  /** Arbitrary color (e.g. a surface tone's `text`) overriding `color`. */
  valueColorHex?: string;
  align?: 'left' | 'center';
}

/**
 * A single emphasized stat with a count-up value — larger and standalone (no
 * card), for use inside hero/section bands. Distinct from the 4-up `AppStatCard`.
 */
export function HeroStat({ label, value, color = 'energy', valueColorHex, align = 'left' }: HeroStatProps) {
  const numeric = /^\d+$/.test(value) ? Number.parseInt(value, 10) : null;
  return (
    <View style={align === 'center' ? styles.center : styles.left}>
      {numeric !== null ? (
        <CountUpValue value={numeric} color={color} colorHex={valueColorHex} />
      ) : (
        <AppText variant="display" color={color} style={valueColorHex ? { color: valueColorHex } : undefined}>
          {value}
        </AppText>
      )}
      <AppText variant="caption" color="muted" uppercase>
        {label}
      </AppText>
    </View>
  );
}

function CountUpValue({ value, color, colorHex }: { value: number; color: TextColor; colorHex?: string }) {
  const display = useCountUp(value);
  return (
    <AppText variant="display" color={color} style={colorHex ? { color: colorHex } : undefined}>
      {display.toString()}
    </AppText>
  );
}

const styles = StyleSheet.create({
  left: { gap: theme.spacing.xs, alignItems: 'flex-start' },
  center: { gap: theme.spacing.xs, alignItems: 'center' },
});
