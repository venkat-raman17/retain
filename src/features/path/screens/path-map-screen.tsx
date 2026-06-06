import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { arcs, getDailyPathContent } from '@/content';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';

import { useDailyPath } from '../hooks/use-daily-path';
import type { DayStatus } from '../services/daily-path-service';

function DayDot({ status, onPress }: { status: DayStatus; onPress: () => void }) {
  const locked = status.unlockState === 'locked';
  const today = status.unlockState === 'available_today';

  return (
    <Pressable
      disabled={locked}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${status.dayNumber}${locked ? ', locked' : ''}`}
      style={[
        styles.dot,
        today ? styles.dotToday : null,
        locked ? styles.dotLocked : styles.dotOpen,
      ]}
    >
      <AppText
        variant="caption"
        color={today ? 'energy' : 'secondary'}
        numberOfLines={1}
        style={locked ? styles.dotLockedText : undefined}
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

  const openDay = (day: number) =>
    router.push({ pathname: '/chamber', params: { day: day.toString() } });

  const current = dayStatuses.find((d) => d.unlockState === 'available_today');
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
        <AppHeader
          title="The 90-Day Path"
          subtitle="Nine arcs. Ninety chambers. One opens each day."
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

        {/* Arc-grouped compact grid — phases, not 90 full cards */}
        {arcs.map((arc) => {
          const arcDays = dayStatuses.filter(
            (d) => d.dayNumber >= arc.dayStart && d.dayNumber <= arc.dayEnd,
          );
          return (
            <View key={arc.id} style={styles.arc}>
              <AppText variant="caption" color="accent" uppercase>
                {`Arc ${arc.arcNumber} · Days ${arc.dayStart}–${arc.dayEnd}`}
              </AppText>
              <AppText variant="subheading">{arc.title}</AppText>
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
  dotLockedText: { color: theme.colors.textMuted },
  dotOpen: { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border },
  dotLocked: { backgroundColor: theme.colors.backgroundRaised, borderColor: theme.colors.border },
  dotToday: { backgroundColor: theme.colors.primarySurface, borderColor: theme.colors.primary, borderWidth: 2 },
});
