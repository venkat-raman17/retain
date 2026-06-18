import { useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import {
  AppCard,
  AppEmptyState,
  AppHero,
  AppScreen,
  AppText,
  EmberSigil,
  FadeInRise,
  PressableScale,
  SealArt,
  type SealArtSource,
  SectionBand,
  symbolStroke,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import { usePath } from '@/features/path/hooks/use-path';
import { isMilestoneDay } from '@/features/progress/domain/progression';

import type { DayQuestResult } from '../domain/quest-evaluation';
import { useTrialsOverview } from '../hooks/use-trials-overview';

/** Seal for a day: the rite medallion on milestone days, the arc seal otherwise. */
function daySeal(dayNumber: number, arcNumber: number | null): SealArtSource {
  return isMilestoneDay(dayNumber)
    ? { kind: 'rite', day: dayNumber }
    : { kind: 'arc', arcNumber: arcNumber ?? 1 };
}

function requiredProgress(quest: DayQuestResult): { done: number; total: number } {
  const required = quest.objectives.filter((o) => !o.optional);
  return { done: required.filter((o) => o.complete).length, total: required.length };
}

export function TrialsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentDay, isRunning, refresh: refreshPath } = usePath();
  const day = currentDay > 0 ? currentDay : 1;
  const { quests, refresh } = useTrialsOverview(day, 12);

  const tone = useSurfaceTone({ kind: 'semantic', name: 'primary' });

  useFocusEffect(
    useCallback(() => {
      refreshPath();
      refresh();
    }, [refreshPath, refresh]),
  );

  const openDay = (dayNumber: number) =>
    router.push({ pathname: '/chamber', params: { day: dayNumber.toString() } });

  const numericQuests = quests.filter(
    (q): q is DayQuestResult & { trial: { dayNumber: number } } =>
      typeof q.trial.dayNumber === 'number',
  );
  const [today, ...recent] = numericQuests;

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={tone}
          eyebrow={copy.trials.eyebrow}
          title={copy.trials.title}
          subtitle={copy.trials.subtitle}
          art={<EmberSigil size={84} color={tone.text} strokeWidth={symbolStroke(84)} />}
        />

        {!isRunning ? (
          <AppEmptyState
            title={copy.trials.locked}
            message={copy.path.notStarted.body}
          />
        ) : null}

        {/* Today's trial — the focal card */}
        {today ? (
          <SectionBand tone={tone}>
            <View style={styles.todayHead}>
              <AppText variant="caption" uppercase style={{ color: tone.text }}>
                {copy.trials.today}
              </AppText>
              <AppText variant="caption" color={today.cleared ? 'energy' : 'muted'}>
                {today.cleared
                  ? copy.trials.cleared
                  : `${requiredProgress(today).done}/${requiredProgress(today).total}`}
              </AppText>
            </View>
            <PressableScale onPress={() => openDay(today.trial.dayNumber)}>
              <View style={styles.todayBody}>
                <SealArt
                  source={daySeal(today.trial.dayNumber, today.trial.arcNumber)}
                  size={56}
                  color={today.cleared ? colors.gold : tone.base}
                />
                <View style={styles.todayText}>
                  <AppText variant="subheading" color="primary">
                    {today.trial.name}
                  </AppText>
                  <AppText variant="caption" color="muted">
                    {`Day ${today.trial.dayNumber} · +${today.trial.rewardEmbers} ${copy.path.stats.embers}`}
                  </AppText>
                </View>
              </View>
            </PressableScale>
            {today.objectives
              .filter((o) => !o.optional)
              .map((obj) => (
                <View key={obj.id} style={styles.objectiveRow}>
                  <AppText variant="caption" color={obj.complete ? 'energy' : 'muted'}>
                    {obj.complete ? '✓' : '·'}
                  </AppText>
                  <AppText
                    variant="caption"
                    color={obj.complete ? 'primary' : 'muted'}
                    style={styles.objectiveLabel}
                  >
                    {obj.label}
                  </AppText>
                </View>
              ))}
          </SectionBand>
        ) : null}

        {/* Recent days — a gallery of sigils, earned ones in gold */}
        {recent.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="muted" uppercase>
              {copy.trials.recent}
            </AppText>
            <View style={styles.gallery}>
              {recent.map((quest, index) => {
                const earned = quest.cleared;
                const { done, total } = requiredProgress(quest);
                return (
                  <FadeInRise key={quest.trial.id} index={Math.min(index, 8)}>
                    <PressableScale onPress={() => openDay(quest.trial.dayNumber)}>
                      <AppCard tone={earned ? 'raised' : 'overlay'} style={styles.dayRow}>
                        <SealArt
                          source={daySeal(quest.trial.dayNumber, quest.trial.arcNumber)}
                          size={36}
                          color={earned ? colors.gold : colors.textMuted}
                        />
                        <View style={styles.dayRowText}>
                          <AppText variant="label" color={earned ? 'primary' : 'secondary'}>
                            {`Day ${quest.trial.dayNumber} · ${quest.trial.name}`}
                          </AppText>
                          <AppText variant="caption" color={earned ? 'energy' : 'muted'}>
                            {earned ? copy.trials.cleared : `${done}/${total} ${copy.trials.objectivesLabel}`}
                          </AppText>
                        </View>
                        <AppText variant="caption" color="muted">
                          {copy.trials.open}
                        </AppText>
                      </AppCard>
                    </PressableScale>
                  </FadeInRise>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  section: { gap: theme.spacing.md },
  todayHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  todayBody: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  todayText: { flex: 1, gap: 2 },
  objectiveRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs },
  objectiveLabel: { flex: 1 },
  gallery: { gap: theme.spacing.sm },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  dayRowText: { flex: 1, gap: 2 },
});
