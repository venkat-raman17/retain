import { type ReactNode, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import type { Achievement } from '@/content/schemas';
import type { EarnedAchievement } from '@/db';
import { copy } from '@/content';
import { useProgressSummary } from '@/features/progress/hooks/use-progress-summary';
import { MILESTONE_DAYS } from '@/features/progress/domain/progression';
import type {
  PathArc,
  PracticeRhythm,
  RecordData,
  ReturnRecord,
} from '@/features/progress/services/progress-service';
import {
  AppCard,
  AppHero,
  AppScreen,
  AppText,
  ArcSeal,
  ArchetypeSigil,
  Bento,
  BentoItem,
  EmberSigil,
  GateSigil,
  PillarsSigil,
  SealArt,
  SectionBand,
  symbolStroke,
  useCountUp,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import { useHonors } from '../hooks/use-honors';

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

// ─── Return record ────────────────────────────────────────────────────────────

function ReturnCard({ returnRecord }: { returnRecord: ReturnRecord }) {
  const noReturns = returnRecord.lapsesStudied === 0 && returnRecord.returnsRecorded === 0;
  const postureColor: InsightColor =
    returnRecord.currentPosture === copy.record.return.postureReturning ? 'accent' : 'calm';
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.return.label}</SectionLabel>
      {noReturns ? (
        <AppText variant="body" color="muted" style={styles.framing}>
          {copy.record.return.empty}
        </AppText>
      ) : null}
      <View style={styles.cardBody}>
        <InsightRow
          label={copy.record.return.lapsesStudied}
          value={returnRecord.lapsesStudied.toString()}
          valueColor="secondary"
        />
        <InsightRow
          label={copy.record.return.returnsRecorded}
          value={returnRecord.returnsRecorded.toString()}
          valueColor="calm"
        />
        <InsightRow
          label={copy.record.return.averageReturn}
          value={returnRecord.averageReturnTime}
          valueColor="secondary"
        />
        <InsightRow
          label={copy.record.return.posture}
          value={returnRecord.currentPosture}
          valueColor={postureColor}
        />
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
  const { summary, refresh: refreshHonors } = useHonors();
  const { record, refresh: refreshRecord } = useProgressSummary();

  useFocusEffect(
    useCallback(() => {
      refreshHonors();
      refreshRecord();
    }, [refreshHonors, refreshRecord]),
  );

  const tone = useSurfaceTone({ kind: 'semantic', name: 'primary' });
  const embersDisplay = useCountUp(summary?.totalEmbers ?? 0, 1200);

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

        {/* Embers + arcs */}
        <SectionBand tone={tone}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <AppText variant="title" color="primary" align="center">
                {embersDisplay}
              </AppText>
              <AppText variant="caption" color="muted" align="center" uppercase>
                Embers
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <AppText variant="title" color="primary" align="center">
                {arcsCleared}
              </AppText>
              <AppText variant="caption" color="muted" align="center" uppercase>
                {arcsCleared === 1 ? 'Arc cleared' : 'Arcs cleared'}
              </AppText>
            </View>
          </View>
        </SectionBand>

        {/* Practice data */}
        {record ? (
          <>
            <ArcCard arc={record.arc} />
            <RhythmCard practiceRhythm={record.practiceRhythm} />
            <ReturnCard returnRecord={record.returnRecord} />
            <NextCommandCard record={record} />
          </>
        ) : null}

        {/* Milestone keys */}
        <AppCard tone="overlay">
          <AppText variant="caption" color="energy" uppercase>
            Milestone keys
          </AppText>
          <KeyRow completedDays={completedDays} />
          {completedDays.filter((d) =>
            MILESTONE_DAYS.includes(d as (typeof MILESTONE_DAYS)[number]),
          ).length === 0 ? (
            <AppText variant="caption" color="muted">
              Keys are earned at days 7, 14, 21, 30, 45, 60, 75, and 90.
            </AppText>
          ) : null}
        </AppCard>

        {/* Earned honors */}
        {earnedItems.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="energy" uppercase>
              {`Honors earned · ${earnedItems.length}`}
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
              No honors yet. Keep practicing — the first will come.
            </AppText>
          </AppCard>
        )}

        {/* Locked honors */}
        {lockedItems.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="muted" uppercase>
              {`Honors ahead · ${lockedItems.length}`}
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
              All honors earned.
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
  // stat band
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.1)' },
  // shared card internals
  sectionLabel: { marginBottom: theme.spacing.sm },
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
