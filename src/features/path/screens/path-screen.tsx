import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import {
  AppButton,
  AppCard,
  AppHero,
  AppIconButton,
  AppQuoteBlock,
  AppScreen,
  AppStatCard,
  AppText,
  FadeInRise,
  PathPulse,
  SealArt,
  SectionBand,
} from '@/shared/components';
import { theme, type ArchetypeTone } from '@/shared/design';
import { useDayTheme, useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';
import { Routes } from '@/navigation';
import { ThemePickerModal } from '@/features/settings';

import { usePath } from '../hooks/use-path';
import { usePathProgress } from '../hooks/use-path-progress';
import { useDailyPath } from '../hooks/use-daily-path';
import { useDailyBrief } from '../hooks/use-daily-brief';
import { useDayQuest } from '@/features/quest/hooks/use-day-quest';
import { useHonors } from '@/features/honors/hooks/use-honors';

export function PathScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentDay, isRunning, vow, loading, beginPath, profile, refresh: refreshPath } = usePath();
  const { summary, refresh: refreshProgress } = usePathProgress();
  const { isCrownUnlocked: checkCrownUnlocked } = useDailyPath();
  const { brief, refresh: refreshBrief } = useDailyBrief();
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  const day = currentDay > 0 ? currentDay : 1;
  const { quest, refresh: refreshQuest } = useDayQuest(day);
  const { summary: honorsSummary, refresh: refreshHonors } = useHonors();

  const stationSeal =
    honorsSummary?.station?.sealSource === 'arc'
      ? { kind: 'arc' as const, arcNumber: parseInt(honorsSummary.station.sealId, 10) }
      : null;

  useFocusEffect(
    useCallback(() => {
      refreshPath();
      refreshProgress();
      refreshBrief();
      refreshQuest();
      refreshHonors();
    }, [refreshPath, refreshProgress, refreshBrief, refreshQuest, refreshHonors]),
  );

  const isCrownUnlocked = profile ? checkCrownUnlocked(profile, currentDay) : false;

  // While the path runs, the home takes TODAY'S archetype as its identity — its
  // per-day color, mark, and invocation — so the opening page leads with "who you
  // are today." Before start / on the Long Path it falls back to the arc tone.
  const arcNumber = isRunning && brief ? brief.arcNumber : 1;
  const archetypeLed = Boolean(isRunning && brief && !brief.isLongPath && brief.archetype);
  const arcSurfaceTone = useSurfaceTone({ kind: 'arc', arcNumber });
  const dayTone = useDayTheme({ day, archetype: (brief?.archetype ?? 'monk') as ArchetypeTone, arcNumber });
  const tone = archetypeLed ? dayTone : arcSurfaceTone;

  const hasMilestone = Boolean(brief?.milestoneRiteId);

  const openChamber = () =>
    router.push({ pathname: '/chamber', params: { day: day.toString() } });

  return (
    <AppScreen
      scroll
      vignette
      footer={
        <AppButton
          label={copy.path.feelTheFire}
          variant="support"
          fullWidth
          onPress={() => router.push(Routes.pause)}
        />
      }
    >
      <View style={styles.container}>
        {/* Theme picker + Settings — quiet controls above the hero. */}
        <View style={styles.topBar}>
          <AppIconButton accessibilityLabel="Choose theme" onPress={() => setThemePickerOpen(true)} size={36}>
            <View style={styles.paletteIcon}>
              {[colors.primary, colors.textSecondary, colors.textMuted].map((c, i) => (
                <View key={i} style={[styles.paletteDot, { backgroundColor: c }]} />
              ))}
            </View>
          </AppIconButton>
          <AppIconButton accessibilityLabel="Settings" onPress={() => router.push(Routes.settings as never)} size={36}>
            <AppText variant="caption" color="muted" style={styles.gearIcon}>{'⚙'}</AppText>
          </AppIconButton>
        </View>

        {!isRunning && !loading ? (
          <>
            <AppHero
              tone={tone}
              align="center"
              eyebrow={copy.path.notStarted.eyebrow}
              title={copy.path.notStarted.title}
              subtitle={copy.path.notStarted.subtitle}
              art={<SealArt source={{ kind: 'arc', arcNumber: 1 }} size={92} color={tone.text} />}
            />
            <AppCard tone="overlay" style={styles.section}>
              {vow ? <AppQuoteBlock quote={vow} attribution={copy.path.vowAttribution} /> : null}
              <AppText variant="body" color="secondary">
                {copy.path.notStarted.body}
              </AppText>
              <AppButton label={copy.path.notStarted.begin} onPress={() => void beginPath()} />
            </AppCard>
          </>
        ) : (
          <>
            {/* Living hero — leads with today's archetype (per-day mark + invocation)
                during initiation; the 9-arc pulse sits below. On the Long Path the
                crown seal marks the rite as complete. */}
            <AppHero
              tone={tone}
              align="center"
              eyebrow={
                archetypeLed && brief?.archetypeName
                  ? `Day ${currentDay} · ${brief.archetypeName}`
                  : (brief?.greeting ?? `Day ${currentDay}`)
              }
              title={brief?.arcTitle || `Day ${currentDay}`}
              subtitle={archetypeLed ? (brief?.invocation ?? undefined) : undefined}
              halo={brief?.isLongPath ?? false}
              art={
                brief?.isLongPath ? (
                  <SealArt source={{ kind: 'crown' }} size={132} color={colors.gold} />
                ) : archetypeLed && brief?.archetype ? (
                  <SealArt
                    source={{
                      kind: 'day',
                      day: currentDay,
                      archetype: brief.archetype,
                      arcNumber,
                      accentColor: tone.base,
                    }}
                    size={120}
                    color={tone.text}
                  />
                ) : undefined
              }
            >
              {!brief?.isLongPath ? (
                <PathPulse currentDay={currentDay} arcTitle={brief?.arcTitle} litColor={tone.base} size={208} />
              ) : null}
            </AppHero>

            {/* Long Path touchpoint — the day's single beat for a crowned man. */}
            {brief?.isLongPath && brief.longPathTouchpoint ? (
              <SectionBand tone={tone}>
                <AppText variant="caption" uppercase style={{ color: tone.text }}>
                  {copy.daily.longPathTouchpoint}
                </AppText>
                <AppText variant="subheading">{brief.longPathTouchpoint}</AppText>
              </SectionBand>
            ) : null}

            {/* Quest dock — today's trial name + objective progress */}
            {quest ? (
              <QuestDock quest={quest} toneText={tone.text} toneBase={tone.base} onPress={openChamber} />
            ) : null}

            {/* Vow — set in the arc tone. */}
            {vow ? (
              <SectionBand tone={tone}>
                <AppQuoteBlock quote={vow} attribution={copy.path.vowAttribution} />
                {honorsSummary?.station ? (
                  <View style={styles.stationRow}>
                    {stationSeal ? (
                      <SealArt source={stationSeal} size={28} color={tone.base} />
                    ) : null}
                    <AppText variant="caption" style={{ color: tone.text }} uppercase>
                      {`${copy.path.stationLabel} · ${honorsSummary.station.title}`}
                    </AppText>
                  </View>
                ) : null}
              </SectionBand>
            ) : null}

            {/* Crown unlock banner */}
            {isCrownUnlocked ? (
              <AppCard tone="raised" border="gold">
                <AppText variant="caption" color="energy" uppercase>
                  {copy.path.crown.label}
                </AppText>
                <AppText variant="body" color="secondary">
                  {copy.path.crown.body}
                </AppText>
                <AppButton label={copy.path.crown.action} onPress={() => router.push(Routes.crown)} />
              </AppCard>
            ) : null}

            {/* Time-of-day focus — changes morning → night. */}
            {brief?.focus ? (
              <FadeInRise index={0}>
                <FocusCard
                  label={brief.focus.label}
                  body={brief.focus.body}
                  eyebrowColor={tone.text}
                  onPress={openChamber}
                />
              </FadeInRise>
            ) : (
              <AppCard tone="overlay">
                <AppText variant="body" color="secondary" align="center">
                  {copy.path.longPathComplete}
                </AppText>
              </AppCard>
            )}

            {/* Today's teaching — the rotating daily codex, surfaced from the library. */}
            {brief?.teaching ? (
              <FadeInRise index={1}>
                <AppCard tone="overlay" onPress={() => router.push(Routes.codex)}>
                  <AppText variant="caption" uppercase style={{ color: tone.text }}>
                    {brief.teaching.eyebrow}
                  </AppText>
                  <AppText variant="subheading">{brief.teaching.title}</AppText>
                  <AppText variant="body" color="secondary" numberOfLines={3}>
                    {brief.teaching.body}
                  </AppText>
                </AppCard>
              </FadeInRise>
            ) : null}

            {/* Primary action — the center of the daily experience. Hidden on Long Path (no chambers 91+). */}
            {!brief?.isLongPath ? (
              <>
                {hasMilestone ? (
                  <AppText variant="caption" color="energy" align="center">
                    {copy.path.milestoneHint}
                  </AppText>
                ) : null}
                <AppButton label={copy.path.openChamber} fullWidth onPress={openChamber} />
              </>
            ) : null}

            {/* Compact stat band — Day lives in the pulse; lead with practice and
                return (a lapse never reads as zero), not the streak. Embers (the
                game currency) lives in the Hall. */}
            {summary ? (
              <View style={styles.statsGrid}>
                <AppStatCard label={copy.path.stats.practiceDays} value={summary.totalPracticeDays.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.returns} value={summary.returnsRecorded.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.urges} value={summary.urgesObserved.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.forge} value={summary.forgeActs.toString()} style={styles.stat} />
              </View>
            ) : null}

            {/* Secondary actions */}
            <AppButton label={copy.path.logForge} variant="secondary" fullWidth onPress={() => router.push(Routes.forge)} />
            <AppButton label={copy.path.viewMap} variant="ghost" fullWidth onPress={() => router.push(Routes.pathMap)} />

            {/* Record a lapse — quiet, never shaming */}
            <AppButton label={copy.path.recordLapse} variant="ghost" fullWidth onPress={() => router.push(Routes.lapse)} />
          </>
        )}
      </View>

      <ThemePickerModal visible={themePickerOpen} onClose={() => setThemePickerOpen(false)} />
    </AppScreen>
  );
}

function QuestDock({
  quest,
  toneText,
  toneBase,
  onPress,
}: {
  quest: import('@/features/quest/domain/quest-evaluation').DayQuestResult;
  toneText: string;
  toneBase: string;
  onPress: () => void;
}) {
  const completed = quest.objectives.filter((o) => o.complete).length;
  const total = quest.objectives.filter((o) => !o.optional).length;
  const allClear = quest.cleared;
  return (
    <AppCard tone="overlay" onPress={onPress}>
      <View style={styles.questHeader}>
        <AppText variant="caption" uppercase style={{ color: toneText }}>
          {allClear ? copy.trials.today + ' · ' + copy.trials.cleared : copy.trials.today}
        </AppText>
        <AppText variant="caption" color={allClear ? 'energy' : 'muted'}>
          {`${completed}/${total}`}
        </AppText>
      </View>
      <View style={styles.questTitleRow}>
        <SealArt source={{ kind: 'arc', arcNumber: quest.trial.arcNumber ?? 1 }} size={26} color={toneBase} />
        <AppText variant="label" color="primary" style={styles.questTitle}>{quest.trial.name}</AppText>
      </View>
      {quest.objectives.filter((o) => !o.optional).map((obj) => (
        <View key={obj.id} style={styles.questObjective}>
          <AppText variant="caption" color={obj.complete ? 'energy' : 'muted'}>
            {obj.complete ? '✓' : '·'}
          </AppText>
          <AppText
            variant="caption"
            color={obj.complete ? 'primary' : 'muted'}
            style={styles.questLabel}
          >
            {obj.label}
          </AppText>
        </View>
      ))}
      {allClear ? (
        <AppText variant="caption" color="energy">
          {`+${quest.trial.rewardEmbers} Embers earned`}
        </AppText>
      ) : null}
    </AppCard>
  );
}

function FocusCard({
  label,
  body,
  eyebrowColor,
  onPress,
}: {
  label: string;
  body: string;
  eyebrowColor: string;
  onPress: () => void;
}) {
  return (
    <AppCard tone="overlay" onPress={onPress}>
      <AppText variant="caption" uppercase style={{ color: eyebrowColor }}>
        {label}
      </AppText>
      <AppText variant="body" color="secondary" numberOfLines={3}>
        {body}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', gap: theme.spacing.xs },
  gearIcon: { fontSize: 16, lineHeight: 20 },
  section: { gap: theme.spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  stat: { flexBasis: '47%', flexGrow: 1, minWidth: 0 },
  stationRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  paletteIcon: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  paletteDot: { width: 5, height: 5, borderRadius: 2.5 },
  questHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questTitleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  questTitle: { flex: 1 },
  questObjective: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs },
  questLabel: { flex: 1 },
});
