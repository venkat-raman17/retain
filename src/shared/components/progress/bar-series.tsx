import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

import { AppText } from '../text';

export interface BarDatum {
  /** Short axis label under the bar, e.g. "Jun 2". */
  label: string;
  /** Bar height as a fraction 0..1 (the caller normalizes). */
  fill: number;
  /** Optional value shown above the bar, e.g. "4" or "3.2". */
  valueLabel?: string;
  /** Whether the bucket has data; empty buckets render a dim track. */
  hasData?: boolean;
}

export interface AppBarSeriesProps {
  data: BarDatum[];
  /** Bar color; defaults to the theme ember. */
  color?: string;
  /** Required summary for screen readers, e.g. "Urges met over the last six weeks." */
  accessibilityLabel: string;
  /** Track height in px. */
  height?: number;
}

/**
 * A small, quiet bar series for a short time-series (e.g. urges or mood per
 * week). Purely presentational — normalization and bucketing live in the domain
 * (`features/progress/domain/trends`). Empty buckets show as a dim track so a
 * zero week reads as real, not missing.
 */
export function AppBarSeries({ data, color, accessibilityLabel, height = 72 }: AppBarSeriesProps) {
  const { colors } = useTheme();
  const barColor = color ?? colors.ember;

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={styles.row}>
      {data.map((datum, index) => {
        const fill = Math.max(0, Math.min(1, datum.fill));
        const active = datum.hasData ?? datum.fill > 0;
        return (
          <View key={index} style={styles.col}>
            <AppText variant="caption" color={active ? 'energy' : 'muted'} numberOfLines={1}>
              {datum.valueLabel ?? ' '}
            </AppText>
            <View style={[styles.track, { height, backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.fill,
                  {
                    height: `${fill * 100}%`,
                    backgroundColor: active ? barColor : colors.borderStrong,
                  },
                ]}
              />
            </View>
            <AppText variant="caption" color="muted" numberOfLines={1}>
              {datum.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.xs },
  col: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
  track: {
    alignSelf: 'stretch',
    borderRadius: theme.radii.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: { width: '100%', borderRadius: theme.radii.sm },
});
