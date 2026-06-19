import { type FC, type ReactNode, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import type { Achievement } from '@/content/schemas';
import type { EarnedAchievement } from '@/db';
import { copy } from '@/content';
import { useProgressSummary } from '@/features/progress/hooks/use-progress-summary';
import { MILESTONE_DAYS, isMilestoneDay } from '@/features/progress/domain/progression';
import { usePath } from '@/features/path/hooks/use-path';
import { useTrialsOverview } from '@/features/quest';
import type { DayQuestResult } from '@/features/quest';
import type {
  ForgeCategoryCount,
  PathArc,
  PracticeRhythm,
  RecordData,
  TriggerCount,
  WeeklyPattern,
} from '@/features/progress/services/progress-service';
import type { TrendSeries } from '@/features/progress/domain/trends';
import {
  AppBarSeries,
  type BarDatum,
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
  FORGE_GLYPHS,
  GateSigil,
  PillarsSigil,
  PressableScale,
  SealArt,
  type SealArtSource,
  SectionBand,
  symbolStroke,
  TRIGGER_GLYPHS,
  useCountUp,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import { useHonors } from '../hooks/use-honors';

// ─── Trial helpers (the day-quest surface, merged into the Hall) ───────────────

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

type InsightColor = 'accent' | 'energy' | 'calm' | 'secondary';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="caption" color="muted" uppercase style={styles.sectionLabel}>
      {children}
    </AppText>
  );
}

function InsightRow({
  label,
  value,
  valueColor = 'accent',
}: {
  label: string;
  value: string;
  valueColor?: InsightColor;
}) {
  return (
    <View style={styles.insightRow}>
      <AppText variant="body" color="secondary">
        {label}
      </AppText>
      <AppText variant="body" color={valueColor}>
        {value}
      </AppText>
    </View>
  );
}

// ─── Arc progress ─────────────────────────────────────────────────────────────

function ArcCard({ arc }: { arc: PathArc }) {
  const { colors } = useTheme();
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.arc.label}</SectionLabel>
      {!arc.started ? (
        <AppText variant="body" color="muted">
          {copy.record.arc.notStarted}
        </AppText>
      ) : (
        <View style={styles.cardBody}>
          <AppText variant="heading" color="primary">
            {`Day ${arc.currentDay} of ${arc.totalDays}`}
          </AppText>
          <View style={styles.arcTimeline}>
            <View style={[styles.arcDot, { backgroundColor: colors.ember }]} />
            <View style={[styles.arcTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.arcFill, { flex: arc.progress, backgroundColor: colors.ember }]} />
              <View style={{ flex: Math.max(0, 1 - arc.progress) }} />
            </View>
            <View
              style={[
                styles.arcDot,
                {
                  borderColor: arc.complete ? colors.ember : colors.borderStrong,
                  borderWidth: 1.5,
                  backgroundColor: arc.complete ? colors.ember : 'transparent',
                },
              ]}
            />
          </View>
          <View style={styles.arcDates}>
            <View>
              <AppText variant="caption" color="muted" uppercase>
                {copy.record.arc.began}
              </AppText>
              <AppText variant="body" color="secondary">
                {arc.startDateISO ? formatDate(arc.startDateISO) : '—'}
              </AppText>
            </View>
            <View style={styles.arcDateRight}>
              <AppText variant="caption" color="muted" uppercase>
                {copy.record.arc.crown}
              </AppText>
              <AppText variant="body" color="energy">
                {arc.endDateISO ? formatDate(arc.endDateISO) : '—'}
              </AppText>
            </View>
          </View>
          <AppText variant="body" color={arc.complete ? 'calm' : 'muted'}>
            {arc.complete
              ? copy.record.arc.complete
              : `${arc.daysRemaining} ${arc.daysRemaining === 1 ? copy.record.arc.remainingOne : copy.record.arc.remaining}`}
          </AppText>
        </View>
      )}
    </AppCard>
  );
}

// ─── Practice rhythm ──────────────────────────────────────────────────────────

function RhythmItem({ label, value }: { label: string; value: number }) {
  const display = useCountUp(value);
  return (
    <View style={styles.rhythmItem}>
      <AppText variant="display" color="energy" numberOfLines={1} adjustsFontSizeToFit>
        {display.toString()}
      </AppText>
      <AppText variant="caption" color="muted" uppercase numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

function RhythmCard({ practiceRhythm }: { practiceRhythm: PracticeRhythm }) {
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.rhythm.label}</SectionLabel>
      <View style={styles.rhythmGrid}>
        <RhythmItem label={copy.record.rhythm.activeDays} value={practiceRhythm.activeDaysThisWeek} />
        <RhythmItem label={copy.record.rhythm.urges} value={practiceRhythm.urgesThisWeek} />
        <RhythmItem label={copy.record.rhythm.journal} value={practiceRhythm.journalEntriesThisWeek} />
        <RhythmItem label={copy.record.rhythm.forge} value={practiceRhythm.forgeActsThisWeek} />
      </View>
      <AppText variant="caption" color="muted" style={styles.rhythmNote}>
        {copy.record.rhythm.note}
      </AppText>
    </AppCard>
  );
}

// ─── Trends (the fire, and how the days feel, over time) ───────────────────────

type TrendCopy = {
  label: string;
  caption: string;
  easing: string;
  steady: string;
  rising: string;
  empty: string;
};

/**
 * A trend over recent weeks. `kind: 'count'` charts a frequency (urges met) and
 * normalizes to the busiest week; `kind: 'average'` charts a 1–5 mean (mood) on a
 * fixed 0–5 scale. Reads as felt experience, never a clinical claim, and a hard
 * week is framed as a cue, never a failure.
 */
function TrendCard({
  series,
  text,
  kind,
  color,
}: {
  series: TrendSeries;
  text: TrendCopy;
  kind: 'count' | 'average';
  color?: string;
}) {
  if (!series.hasEnoughData) {
    return (
      <AppCard tone="overlay">
        <SectionLabel>{text.label}</SectionLabel>
        <AppText variant="body" color="muted">
          {text.empty}
        </AppText>
      </AppCard>
    );
  }

  const max = kind === 'count' ? Math.max(1, ...series.buckets.map((b) => b.count)) : 5;
  const data: BarDatum[] = series.buckets.map((b) => {
    const hasData = kind === 'count' ? b.count > 0 : b.average !== null;
    const raw = kind === 'count' ? b.count : (b.average ?? 0);
    const value = kind === 'count' ? b.count : b.average;
    return {
      label: b.label,
      fill: max > 0 ? raw / max : 0,
      valueLabel: hasData && value !== null ? value.toString() : '',
      hasData,
    };
  });
  const headline = text[series.direction ?? 'steady'];

  return (
    <AppCard tone="overlay">
      <SectionLabel>{text.label}</SectionLabel>
      <AppText variant="body" color="secondary" style={styles.framing}>
        {headline}
      </AppText>
      <AppBarSeries data={data} color={color} accessibilityLabel={`${text.label}. ${text.caption}.`} />
      <AppText variant="caption" color="muted" style={styles.rhythmNote}>
        {text.caption}
      </AppText>
    </AppCard>
  );
}

// ─── The mirror: reveal, fire map, forge balance, weekly pattern ───────────────

function RevealCard({ reveal }: { reveal: RecordData['reveal'] }) {
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.reveal.label}</SectionLabel>
      {reveal ? (
        <View style={styles.cardBody}>
          <AppText variant="title" color="primary">
            {reveal.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {reveal.body}
          </AppText>
        </View>
      ) : (
        <AppText variant="body" color="muted">
          {copy.record.reveal.empty}
        </AppText>
      )}
    </AppCard>
  );
}

/** Distribution tiles — reuses the Forge screen idiom (glyph + label + count). */
function CountTiles({
  items,
  glyphs,
}: {
  items: { key: string; label: string; count: number }[];
  glyphs: Record<string, FC<{ size?: number; color?: string; strokeWidth?: number }>>;
}) {
  const { colors } = useTheme();
  return (
    <Bento>
      {items.map((item) => {
        const Glyph = glyphs[item.key];
        const active = item.count > 0;
        return (
          <BentoItem key={item.key}>
            <AppCard tone={active ? 'raised' : 'overlay'} style={styles.countTile}>
              {Glyph ? (
                <Glyph
                  size={24}
                  color={active ? colors.primary : colors.textMuted}
                  strokeWidth={symbolStroke(24)}
                />
              ) : null}
              <AppText variant="label" color={active ? 'primary' : 'muted'} numberOfLines={1}>
                {item.label}
              </AppText>
              <AppText variant="caption" color={active ? 'energy' : 'muted'}>
                {item.count.toString()}
              </AppText>
            </AppCard>
          </BentoItem>
        );
      })}
    </Bento>
  );
}

function FireMapCard({ triggerCounts }: { triggerCounts: TriggerCount[] }) {
  const total = triggerCounts.reduce((sum, t) => sum + t.count, 0);
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.fireMap.label}</SectionLabel>
      {total === 0 ? (
        <AppText variant="body" color="muted">
          {copy.record.fireMap.empty}
        </AppText>
      ) : (
        <CountTiles
          glyphs={TRIGGER_GLYPHS}
          items={triggerCounts.map((t) => ({ key: t.triggerType, label: t.label, count: t.count }))}
        />
      )}
    </AppCard>
  );
}

function ForgeBalanceCard({
  forgeCategoryCounts,
  forgeBalance,
}: {
  forgeCategoryCounts: ForgeCategoryCount[];
  forgeBalance: string | null;
}) {
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.forge.label}</SectionLabel>
      {forgeBalance ? (
        <>
          <AppText variant="body" color="secondary" style={styles.framing}>
            {forgeBalance}
          </AppText>
          <CountTiles
            glyphs={FORGE_GLYPHS}
            items={forgeCategoryCounts.map((c) => ({ key: c.category, label: c.label, count: c.count }))}
          />
        </>
      ) : (
        <AppText variant="body" color="muted">
          {copy.record.forge.empty}
        </AppText>
      )}
    </AppCard>
  );
}

/** This week's pattern — only the rows that have something to say. */
function WeeklyPatternCard({ pattern }: { pattern: WeeklyPattern }) {
  const rows: { label: string; value: string }[] = [];
  if (pattern.mostCommonTriggerLabel)
    rows.push({ label: copy.record.pattern.trigger, value: pattern.mostCommonTriggerLabel });
  if (pattern.strongestUrgeHourLabel)
    rows.push({ label: copy.record.pattern.hour, value: pattern.strongestUrgeHourLabel });
  if (pattern.mostCommonResponse)
    rows.push({ label: copy.record.pattern.response, value: pattern.mostCommonResponse });
  if (pattern.strongestForgeCategoryLabel)
    rows.push({ label: copy.record.pattern.forge, value: pattern.strongestForgeCategoryLabel });

  if (rows.length === 0) return null;

  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.rhythm.note}</SectionLabel>
      <View style={styles.cardBody}>
        {rows.map((row) => (
          <InsightRow key={row.label} label={row.label} value={row.value} valueColor="accent" />
        ))}
      </View>
    </AppCard>
  );
}

// ─── Next command ─────────────────────────────────────────────────────────────

function NextCommandCard({ record }: { record: RecordData }) {
  return (
    <AppCard border="ember">
      <SectionLabel>{copy.record.command.label}</SectionLabel>
      <View style={styles.cardBody}>
        <AppText variant="title" color="primary">
          {record.nextCommand.title}
        </AppText>
        <AppText variant="body" color="secondary">
          {record.nextCommand.body}
        </AppText>
      </View>
    </AppCard>
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

function KeyRow({ completedDays }: { completedDays: number[] }) {
  const { colors } = useTheme();
  const completedSet = new Set(completedDays);
  const anyKey = MILESTONE_DAYS.some((d) => completedSet.has(d));
  if (!anyKey) return null;
  return (
    <View style={styles.keyRow}>
      {MILESTONE_DAYS.map((day) => {
        const earned = completedSet.has(day);
        return (
          <View key={day} style={styles.keyItem}>
            <SealArt
              source={{ kind: 'rite', day }}
              size={32}
              color={earned ? colors.gold : colors.textMuted}
            />
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

export function HallScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { summary, refresh: refreshHonors } = useHonors();
  const { record, refresh: refreshRecord } = useProgressSummary();
  const { currentDay, isRunning } = usePath();
  const day = currentDay > 0 ? currentDay : 1;
  const { quests, refresh: refreshQuests } = useTrialsOverview(day, 12);

  useFocusEffect(
    useCallback(() => {
      refreshHonors();
      refreshRecord();
      refreshQuests();
    }, [refreshHonors, refreshRecord, refreshQuests]),
  );

  const tone = useSurfaceTone({ kind: 'semantic', name: 'primary' });
  const embersDisplay = useCountUp(summary?.totalEmbers ?? 0, 1200);

  const numericQuests = quests.filter(
    (q): q is DayQuestResult & { trial: { dayNumber: number } } =>
      typeof q.trial.dayNumber === 'number',
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

        {/* ── Practice & recovery — what the record reveals comes first ────────── */}
        {record ? (
          <>
            <ArcCard arc={record.arc} />
            <RhythmCard practiceRhythm={record.practiceRhythm} />
            <TrendCard series={record.urgeTrend} text={copy.record.urgeTrend} kind="count" />
            <TrendCard
              series={record.moodTrend}
              text={copy.record.moodTrend}
              kind="average"
              color={colors.calm}
            />
            <RevealCard reveal={record.reveal} />
            <FireMapCard triggerCounts={record.triggerCounts} />
            <ForgeBalanceCard
              forgeCategoryCounts={record.forgeCategoryCounts}
              forgeBalance={record.forgeBalance}
            />
            <WeeklyPatternCard pattern={record.weeklyPattern} />
            <NextCommandCard record={record} />
          </>
        ) : null}

        {/* ── The honors hall — milestones, embers, trials (demoted below practice) ── */}
        <SectionLabel>{copy.honorsHall.label}</SectionLabel>

        {/* Embers + arcs */}
        <SectionBand tone={tone}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <AppText variant="title" color="primary" align="center">
                {embersDisplay}
              </AppText>
              <AppText variant="caption" color="muted" align="center" uppercase>
                {copy.path.stats.embers}
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
          <KeyRow completedDays={completedDays} />
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
                    {`Day ${todayTrial.trial.dayNumber} · +${todayTrial.trial.rewardEmbers} ${copy.path.stats.embers}`}
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
  // shared card internals
  sectionLabel: { marginBottom: theme.spacing.sm },
  countTile: { gap: theme.spacing.xs, alignItems: 'flex-start' },
  cardBody: { gap: theme.spacing.sm },
  framing: { marginBottom: theme.spacing.md },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  // arc
  arcTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
  },
  arcDot: { width: 9, height: 9, borderRadius: 5 },
  arcTrack: {
    flex: 1,
    height: 6,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  arcFill: { borderRadius: 3 },
  arcDates: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  arcDateRight: { alignItems: 'flex-end' },
  // rhythm
  rhythmGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  rhythmItem: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
  rhythmNote: { marginTop: theme.spacing.sm, textAlign: 'center' },
  // keys
  keyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  keyItem: { alignItems: 'center', gap: 2, width: 36 },
  // honors
  honorTile: { gap: theme.spacing.xs, alignItems: 'center' },
  honorSeal: { marginBottom: theme.spacing.xs },
  honorTitle: { fontWeight: '600' },
});
