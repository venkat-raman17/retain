import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { arcs, getDailyPathContent } from '@/content';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppHero,
  AppScreen,
  AppText,
  ArcSeal,
  symbolStroke,
} from '@/shared/components';
import { arcTone, theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import { useDailyPath } from '../hooks/use-daily-path';
import type { DayStatus } from '../services/daily-path-service';

function DayDot({ status, onPress }: { status: DayStatus; onPress: () => void }) {
  const { colors } = useTheme();
  const locked = status.unlockState === 'locked';
  const today = status.unlockState === 'available_today';

  const stateStyle = today
    ? { backgroundColor: colors.primarySurface, borderColor: colors.primary, borderWidth: 2 }
    : locked
      ? { backgroundColor: colors.backgroundRaised, borderColor: colors.border }
      : { backgroundColor: colors.surfaceRaised, borderColor: colors.border };

  return (
    <Pressable
      disabled={locked}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${status.dayNumber}${locked ? ', locked' : ''}`}
      style={[styles.dot, stateStyle]}
    >
      <AppText
        variant="caption"
        color={today ? 'energy' : 'secondary'}
        numberOfLines={1}
        style={locked ? { color: colors.textMuted } : undefined}
      >
        {status.dayNumber}
      </AppText>
    </Pressable>
  );
}

export function PathMapScreen() {
  const router = useRouter();
  const { getDayStatusList } = useDailyPath();

  const [dayStatuses, setDayStatuses] = useState<DayStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDayStatusList()
      .then((list) => {
        if (active) {
          setDayStatuses(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [getDayStatusList]);

  const current = dayStatuses.find((d) => d.unlockState === 'available_today');
  const tone = useSurfaceTone({ kind: 'arc', arcNumber: current?.arcNumber ?? 1 });

  const openDay = (day: number) =>
    router.push({ pathname: '/chamber', params: { day: day.toString() } });

  const nextDay = current && current.dayNumber < 90 ? current.dayNumber + 1 : null;
  const nextContent = nextDay ? getDailyPathContent(nextDay) : null;

  if (loading) {
    return (
      <AppScreen scroll>
        <AppHeader title="The 90-Day Path" subtitle="Opening the map..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={tone}
          eyebrow="The Map"
          title="The 90-Day Path"
          subtitle="Nine arcs. Ninety chambers. One opens each day."
          art={<ArcSeal arcNumber={current?.arcNumber ?? 1} size={80} color={tone.text} strokeWidth={symbolStroke(80)} />}
        />

        {/* Current + next unlock */}
        {current ? (
          <AppCard tone="raised" border="gold">
            <AppText variant="caption" color="energy" uppercase>
              Current chamber
            </AppText>
            <AppText variant="subheading">
              {`Day ${current.dayNumber} — ${current.title}`}
            </AppText>
            <AppButton label="Open Today's Chamber" onPress={() => openDay(current.dayNumber)} />
            {nextContent ? (
              <AppText variant="caption" color="muted" style={styles.nextLine}>
                {`Next: Day ${nextDay} — ${nextContent.title} · opens when you reach it`}
              </AppText>
            ) : null}
          </AppCard>
        ) : null}

        {/* Arc-grouped compact grid — each arc tinted by its own tone */}
        {arcs.map((arc) => {
          const arcDays = dayStatuses.filter(
            (d) => d.dayNumber >= arc.dayStart && d.dayNumber <= arc.dayEnd,
          );
          return (
            <View key={arc.id} style={styles.arc}>
              <View style={styles.arcHead}>
                <View style={styles.flex}>
                  <AppText variant="caption" uppercase style={{ color: arcTone(arc.arcNumber) }}>
                    {`Arc ${arc.arcNumber} · Days ${arc.dayStart}–${arc.dayEnd}`}
                  </AppText>
                  <AppText variant="subheading">{arc.title}</AppText>
                </View>
                <ArcSeal arcNumber={arc.arcNumber} size={34} color={arcTone(arc.arcNumber)} strokeWidth={symbolStroke(34)} />
              </View>
              <AppText variant="caption" color="muted" style={styles.arcQuestion}>
                {arc.centralQuestion}
              </AppText>
              <View style={styles.dotGrid}>
                {arcDays.map((day) => (
                  <DayDot key={day.dayNumber} status={day} onPress={() => openDay(day.dayNumber)} />
                ))}
              </View>
            </View>
          );
        })}

        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" align="center">
            {'This chamber opens when the Path has prepared you for it. Walk today\'s fire first.'}
          </AppText>
        </AppCard>

        <AppButton label="Return" variant="ghost" fullWidth onPress={() => router.back()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  nextLine: { marginTop: theme.spacing.sm },
  arc: { gap: theme.spacing.xs },
  arcHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex: { flex: 1 },
  arcQuestion: { fontStyle: 'italic', marginBottom: theme.spacing.xs },
  dotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  dot: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
