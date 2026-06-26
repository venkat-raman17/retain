import { type ReactNode, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import type { Achievement } from '@/content/schemas';
import type { EarnedAchievement } from '@/db';
import { copy } from '@/content';
import { MILESTONE_DAYS, isMilestoneDay } from '@/features/progress/domain/progression';
import { usePath } from '@/features/path/hooks/use-path';
import { useTrialsOverview } from '@/features/quest';
import type { DayQuestResult } from '@/features/quest';
import {
  AppCard,
  AppEmptyState,
  AppHero,
  AppScreen,
  AppText,
  ArcSeal,
  ArchetypeSigil,
  Bento,
  BentoItem,
  EmberSigil,
  FadeInRise,
  GateSigil,
  PillarsSigil,
  PressableScale,
  SealArt,
  type SealArtSource,
  SectionBand,
  symbolStroke,
  useCountUp,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import { useHonors } from '../hooks/use-honors';

// ─── Trial helpers (the day-quest surface) ─────────────────────────────────────

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

function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="caption" color="muted" uppercase style={styles.sectionLabel}>
      {children}
    </AppText>
  );
}

// ─── Achievement seal ─────────────────────────────────────────────────────────

function achievementSeal(achievement: Achievement, size: number, color: string): ReactNode {
  const stroke = symbolStroke(size);
  const { sealSource, sealId } = achievement;
  if (sealSource === 'arc') {
    const arcNum = parseInt(sealId, 10);
    if (!isNaN(arcNum)) {
      return <ArcSeal arcNumber={arcNum} size={size} color={color} strokeWidth={stroke} />;
    }
  }
  if (sealSource === 'archetype') {
    return <ArchetypeSigil archetype={sealId} size={size} color={color} strokeWidth={stroke} />;
  }
  if (sealId === 'primary') return <GateSigil size={size} color={color} strokeWidth={stroke} />;
  if (sealId === 'support') return <PillarsSigil size={size} color={color} strokeWidth={stroke} />;
  return <EmberSigil size={size} color={color} strokeWidth={stroke} />;
}

// ─── Honor tile ───────────────────────────────────────────────────────────────

function HonorTile({
  achievement,
  isEarned,
  earnedAt,
}: {
  achievement: Achievement;
  isEarned: boolean;
  earnedAt?: string;
}) {
  const { colors } = useTheme();
  const sealColor = isEarned ? colors.primary : colors.textMuted;
  const date = earnedAt
    ? new Date(earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;
  return (
    <AppCard tone={isEarned ? 'raised' : 'overlay'} style={styles.honorTile}>
      <View style={styles.honorSeal}>{achievementSeal(achievement, 40, sealColor)}</View>
      <AppText
        variant="caption"
        color={isEarned ? 'primary' : 'muted'}
        align="center"
        style={styles.honorTitle}
      >
        {achievement.title}
      </AppText>
      {isEarned && date ? (
        <AppText variant="caption" color="muted" align="center">
          {date}
        </AppText>
      ) : (
        <AppText variant="caption" color="muted" align="center" numberOfLines={2}>
          {achievement.description}
        </AppText>
      )}
    </AppCard>
  );
}

// ─── Milestone keys ───────────────────────────────────────────────────────────

function KeyRow({ completedDays, startDayOffset }: { completedDays: number[]; startDayOffset: number }) {
  const { colors } = useTheme();
  const completedSet = new Set(completedDays);
  // Hide milestone keys for days the man skipped at the start — he can never earn them.
  const keyDays = MILESTONE_DAYS.filter((d) => d > startDayOffset);
  const anyKey = keyDays.some((d) => completedSet.has(d));
  if (!anyKey) return null;
  return (
    <View style={styles.keyRow}>
      {keyDays.map((day) => {
        const earned = completedSet.has(day);
        return (
          <View key={day} style={styles.keyItem}>
            <SealArt source={{ kind: 'rite', day }} size={32} color={earned ? colors.gold : colors.textMuted} />
            <AppText variant="caption" color={earned ? 'energy' : 'muted'} align="center">
              {`${day}`}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * The Hall — rank, milestone keys, today's trial, the days behind you, and the
 * honors earned and ahead. The practice metrics live in the Record tab.
 */
export function HallScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { summary, refresh: refreshHonors } = useHonors();
  const { currentDay, isRunning } = usePath();
  const day = currentDay > 0 ? currentDay : 1;
  const startDayOffset = summary?.startDayOffset ?? 0;
  // Don't surface days the man skipped at the start (onboarding offset) in the gallery.
  const { quests, refresh: refreshQuests } = useTrialsOverview(
    day,
    Math.min(12, Math.max(1, day - startDayOffset)),
  );

  useFocusEffect(
    useCallback(() => {
      refreshHonors();
      refreshQuests();
    }, [refreshHonors, refreshQuests]),
  );

  const tone = useSurfaceTone({ kind: 'semantic', name: 'primary' });
  const embersDisplay = useCountUp(summary?.totalEmbers ?? 0, 1200);

  const numericQuests = quests.filter(
    (q): q is DayQuestResult & { trial: { dayNumber: number } } => typeof q.trial.dayNumber === 'number',
  );
  const [todayTrial, ...recentTrials] = numericQuests;

  const openDay = (dayNumber: number) =>
    router.push({ pathname: '/chamber', params: { day: dayNumber.toString() } });

  if (!summary) {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppHero tone={tone} eyebrow="The Hall" title="Loading…" />
        </View>
      </AppScreen>
    );
  }

  const { catalog, earned, station, arcsCleared, completedDays } = summary;
  const earnedMap = new Map<string, EarnedAchievement>(earned.map((e) => [e.achievementId, e]));
  const earnedItems = catalog.filter((a) => earnedMap.has(a.id));
  const lockedItems = catalog.filter((a) => !earnedMap.has(a.id));

  const stationSeal =
    station?.sealSource === 'arc'
      ? { kind: 'arc' as const, arcNumber: parseInt(station.sealId, 10) }
      : null;

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        {/* Station + rank */}
        <AppHero
          tone={tone}
          eyebrow="The Hall"
          title={station?.title ?? 'Initiate'}
          subtitle={station?.description}
          art={
            stationSeal ? (
              <SealArt source={stationSeal} size={92} color={tone.text} />
            ) : (
              <GateSigil size={92} color={tone.text} strokeWidth={symbolStroke(92)} />
            )
          }
        />

        <SectionLabel>{copy.honorsHall.label}</SectionLabel>

        {/* Embers + arcs */}
        <SectionBand tone={tone}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <AppText variant="title" color="primary" align="center">
                {embersDisplay}
              </AppText>
              <AppText variant="caption" color="muted" align="center" uppercase>
                {copy.honorsHall.embers}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <AppText variant="title" color="primary" align="center">
                {arcsCleared}
              </AppText>
              <AppText variant="caption" color="muted" align="center" uppercase>
                {arcsCleared === 1 ? copy.honorsHall.arcCleared : copy.honorsHall.arcsCleared}
              </AppText>
            </View>
          </View>
        </SectionBand>

        {/* Milestone keys */}
        <AppCard tone="overlay">
          <AppText variant="caption" color="energy" uppercase>
            {copy.honorsHall.keys}
          </AppText>
          <KeyRow completedDays={completedDays} startDayOffset={startDayOffset} />
          {completedDays.filter((d) =>
            MILESTONE_DAYS.includes(d as (typeof MILESTONE_DAYS)[number]),
          ).length === 0 ? (
            <AppText variant="caption" color="muted">
              {copy.honorsHall.keysHint}
            </AppText>
          ) : null}
        </AppCard>

        {/* Trials — today's quest + the days behind you */}
        {!isRunning ? (
          <AppEmptyState title={copy.trials.locked} message={copy.path.notStarted.body} />
        ) : null}

        {todayTrial ? (
          <SectionBand tone={tone}>
            <View style={styles.todayHead}>
              <AppText variant="caption" uppercase style={{ color: tone.text }}>
                {copy.trials.today}
              </AppText>
              <AppText variant="caption" color={todayTrial.cleared ? 'energy' : 'muted'}>
                {todayTrial.cleared
                  ? copy.trials.cleared
                  : `${requiredProgress(todayTrial).done}/${requiredProgress(todayTrial).total}`}
              </AppText>
            </View>
            <PressableScale onPress={() => openDay(todayTrial.trial.dayNumber)}>
              <View style={styles.todayBody}>
                <SealArt
                  source={daySeal(todayTrial.trial.dayNumber, todayTrial.trial.arcNumber)}
                  size={56}
                  color={todayTrial.cleared ? colors.gold : tone.base}
                />
                <View style={styles.todayText}>
                  <AppText variant="subheading" color="primary">
                    {todayTrial.trial.name}
                  </AppText>
                  <AppText variant="caption" color="muted">
                    {`Day ${todayTrial.trial.dayNumber} · +${todayTrial.trial.rewardEmbers} ${copy.honorsHall.embers}`}
                  </AppText>
                </View>
              </View>
            </PressableScale>
            {todayTrial.objectives
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

        {recentTrials.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="muted" uppercase>
              {copy.trials.recent}
            </AppText>
            <View style={styles.gallery}>
              {recentTrials.map((quest, index) => {
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
                            {earned
                              ? copy.trials.cleared
                              : `${done}/${total} ${copy.trials.objectivesLabel}`}
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

        {/* Earned honors */}
        {earnedItems.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="energy" uppercase>
              {`${copy.honorsHall.earned} · ${earnedItems.length}`}
            </AppText>
            <Bento>
              {earnedItems.map((a) => (
                <BentoItem key={a.id} span={1}>
                  <HonorTile achievement={a} isEarned earnedAt={earnedMap.get(a.id)?.earnedAt} />
                </BentoItem>
              ))}
            </Bento>
          </View>
        ) : (
          <AppCard tone="overlay">
            <AppText variant="caption" color="muted" align="center">
              {copy.honorsHall.none}
            </AppText>
          </AppCard>
        )}

        {/* Locked honors */}
        {lockedItems.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="muted" uppercase>
              {copy.honorsHall.ahead}
            </AppText>
            <Bento>
              {lockedItems.map((a) => (
                <BentoItem key={a.id} span={1}>
                  <HonorTile achievement={a} isEarned={false} />
                </BentoItem>
              ))}
            </Bento>
          </View>
        ) : earnedItems.length === catalog.length ? (
          <AppCard tone="raised" border="gold">
            <AppText variant="body" color="energy" align="center">
              {copy.honorsHall.all}
            </AppText>
          </AppCard>
        ) : null}
      </View>
    </AppScreen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  section: { gap: theme.spacing.md },
  // trials (today + recent gallery)
  todayHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  todayBody: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  todayText: { flex: 1, gap: 2 },
  objectiveRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs },
  objectiveLabel: { flex: 1 },
  gallery: { gap: theme.spacing.sm },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  dayRowText: { flex: 1, gap: 2 },
  // stat band
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.1)' },
  // labels
  sectionLabel: { marginBottom: theme.spacing.sm },
  // keys
  keyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  keyItem: { alignItems: 'center', gap: 2, width: 36 },
  // honors
  honorTile: { gap: theme.spacing.xs, alignItems: 'center' },
  honorSeal: { marginBottom: theme.spacing.xs },
  honorTitle: { fontWeight: '600' },
});
