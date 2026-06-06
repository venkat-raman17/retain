import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Routes } from '@/navigation';
import { AppButton, AppCard, AppHeader, AppScreen, AppText } from '@/shared/components';
import { theme } from '@/shared/design';
import { usePath } from '@/features/path';

import { useProgressSummary } from '../hooks/use-progress-summary';
import type { ForgeCategoryCount, RecordData, TriggerCount } from '../services/progress-service';

// ─── Section components ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="caption" color="muted" uppercase style={styles.sectionLabel}>
      {children}
    </AppText>
  );
}

function InsightRow({ label, value, valueColor = 'accent' }: { label: string; value: string; valueColor?: 'accent' | 'energy' | 'calm' | 'secondary' }) {
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

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const fill = max > 0 ? count / max : 0;
  return (
    <View style={styles.barRow}>
      <AppText variant="body" color="secondary" style={styles.barLabel}>
        {label}
      </AppText>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { flex: fill }]} />
        <View style={{ flex: 1 - fill }} />
      </View>
      <AppText variant="body" color={count > 0 ? 'energy' : 'muted'} style={styles.barCount}>
        {count.toString()}
      </AppText>
    </View>
  );
}

// ─── Weekly pattern card ──────────────────────────────────────────────────────

function WeeklyPatternCard({ record }: { record: RecordData }) {
  const { weeklyPattern } = record;
  const hasWeekData =
    weeklyPattern.mostCommonTrigger !== null || weeklyPattern.strongestForgeCategory !== null;

  return (
    <AppCard tone="overlay">
      <SectionLabel>{"This week's pattern"}</SectionLabel>
      {hasWeekData ? (
        <View style={styles.cardBody}>
          {weeklyPattern.mostCommonTriggerLabel ? (
            <InsightRow label="Most common trigger" value={weeklyPattern.mostCommonTriggerLabel} valueColor="accent" />
          ) : null}
          {weeklyPattern.strongestUrgeHourLabel ? (
            <InsightRow label="Strongest urge hour" value={weeklyPattern.strongestUrgeHourLabel} valueColor="accent" />
          ) : null}
          {weeklyPattern.mostCommonResponse ? (
            <InsightRow label="Most common response" value={weeklyPattern.mostCommonResponse} valueColor="secondary" />
          ) : null}
          {weeklyPattern.strongestForgeCategoryLabel ? (
            <InsightRow label="Strongest forge" value={weeklyPattern.strongestForgeCategoryLabel} valueColor="energy" />
          ) : null}
        </View>
      ) : (
        <View style={styles.cardBody}>
          <AppText variant="body" color="muted">
            Not enough record yet.
          </AppText>
          <AppText variant="body" color="muted" style={styles.emptyNote}>
            Log urges, forge acts, and journal entries to reveal the pattern.
          </AppText>
        </View>
      )}
    </AppCard>
  );
}

// ─── Fire map ────────────────────────────────────────────────────────────────

function FireMapCard({ triggerCounts }: { triggerCounts: TriggerCount[] }) {
  const maxCount = Math.max(...triggerCounts.map((t) => t.count), 1);
  return (
    <AppCard>
      <SectionLabel>The fire map</SectionLabel>
      <View style={styles.cardBody}>
        {triggerCounts.map((t) => (
          <BarRow key={t.triggerType} label={t.label} count={t.count} max={maxCount} />
        ))}
      </View>
    </AppCard>
  );
}

// ─── Return record ────────────────────────────────────────────────────────────

function ReturnRecordCard({ record }: { record: RecordData }) {
  const { returnRecord } = record;
  const postureColor = returnRecord.currentPosture === 'Returning' ? 'accent' : 'calm';
  return (
    <AppCard tone="overlay">
      <SectionLabel>Return record</SectionLabel>
      <View style={styles.cardBody}>
        <InsightRow label="Lapses studied" value={returnRecord.lapsesStudied.toString()} valueColor="secondary" />
        <InsightRow label="Returns recorded" value={returnRecord.returnsRecorded.toString()} valueColor="calm" />
        <InsightRow label="Average return time" value={returnRecord.averageReturnTime} valueColor="secondary" />
        <InsightRow label="Current posture" value={returnRecord.currentPosture} valueColor={postureColor} />
      </View>
    </AppCard>
  );
}

// ─── Forge direction ─────────────────────────────────────────────────────────

function ForgeDirectionCard({ forgeCategoryCounts }: { forgeCategoryCounts: ForgeCategoryCount[] }) {
  const maxCount = Math.max(...forgeCategoryCounts.map((c) => c.count), 1);
  const topCategory = forgeCategoryCounts[0];
  const leastUsed = [...forgeCategoryCounts].reverse().find((c) => c.count === 0);

  return (
    <AppCard>
      <SectionLabel>Forge direction</SectionLabel>
      <View style={styles.cardBody}>
        {forgeCategoryCounts.map((c) => (
          <BarRow key={c.category} label={c.label} count={c.count} max={maxCount} />
        ))}
        {topCategory && topCategory.count > 0 ? (
          <View style={styles.forgeInsight}>
            <AppText variant="caption" color="muted">
              {leastUsed
                ? `You are forging mostly through ${topCategory.label.toLowerCase()}. Next: add one act of ${leastUsed.label.toLowerCase()}.`
                : `You are forging across all directions.`}
            </AppText>
          </View>
        ) : null}
      </View>
    </AppCard>
  );
}

// ─── Practice rhythm ─────────────────────────────────────────────────────────

function PracticeRhythmCard({ record }: { record: RecordData }) {
  const { practiceRhythm } = record;
  return (
    <AppCard tone="overlay">
      <SectionLabel>Practice rhythm</SectionLabel>
      <View style={styles.rhythmGrid}>
        <RhythmItem label="Active days" value={practiceRhythm.activeDaysThisWeek} />
        <RhythmItem label="Urges met" value={practiceRhythm.urgesThisWeek} />
        <RhythmItem label="Journal" value={practiceRhythm.journalEntriesThisWeek} />
        <RhythmItem label="Forge acts" value={practiceRhythm.forgeActsThisWeek} />
      </View>
      <AppText variant="caption" color="muted" style={styles.rhythmNote}>
        This week
      </AppText>
    </AppCard>
  );
}

function RhythmItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.rhythmItem}>
      <AppText variant="display" color="energy" numberOfLines={1} adjustsFontSizeToFit>
        {value.toString()}
      </AppText>
      <AppText variant="caption" color="muted" uppercase numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

// ─── Weekly account ───────────────────────────────────────────────────────────

function WeeklyAccountCard({ onPress }: { onPress: () => void }) {
  return (
    <AppCard border="gold">
      <SectionLabel>Weekly account</SectionLabel>
      <View style={styles.cardBody}>
        <AppText variant="body" color="muted">
          What pattern kept returning?
        </AppText>
        <AppText variant="body" color="muted">
          Where did I obey less quickly?
        </AppText>
        <AppText variant="body" color="muted">
          What must I guard next week?
        </AppText>
      </View>
      <View style={styles.cardCta}>
        <AppButton label="Write weekly account" variant="secondary" onPress={onPress} />
      </View>
    </AppCard>
  );
}

// ─── Next command ─────────────────────────────────────────────────────────────

function NextCommandCard({ record }: { record: RecordData }) {
  const { nextCommand } = record;
  return (
    <AppCard border="ember">
      <SectionLabel>Next command</SectionLabel>
      <View style={styles.cardBody}>
        <AppText variant="title" color="primary">
          {nextCommand.title}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.commandBody}>
          {nextCommand.body}
        </AppText>
      </View>
    </AppCard>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyRecord({ onOpen }: { onOpen: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <AppCard tone="overlay">
        <SectionLabel>The record is empty</SectionLabel>
        <View style={styles.cardBody}>
          <AppText variant="body" color="secondary">
            Retain does not judge what has not yet been observed.
          </AppText>
          <AppText variant="body" color="muted" style={styles.emptyNote}>
            Use the Path, Forge, Journal, and Pause tools. After a few entries, this page will begin
            to show your patterns.
          </AppText>
        </View>
        <View style={styles.cardCta}>
          <AppButton label="Open today's chamber" variant="primary" onPress={onOpen} />
        </View>
      </AppCard>

      <AppCard tone="overlay">
        <AppText variant="body" color="calm" align="center">
          {'Command is trained in the return.\nThe record shows where the fire asks for discipline.'}
        </AppText>
      </AppCard>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ProgressScreen() {
  const { record, loading } = useProgressSummary();
  const { currentDay } = usePath();
  const router = useRouter();

  const day = currentDay > 0 ? currentDay : 1;
  const openChamber = () =>
    router.push({ pathname: Routes.chamber, params: { day: day.toString() } } as never);
  const openJournal = () => router.push(Routes.journal as never);

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow="Record"
          title="The record of practice."
          subtitle="Your practice is more than a streak."
        />

        {!loading ? (
          record ? (
            <>
              <WeeklyPatternCard record={record} />
              <FireMapCard triggerCounts={record.triggerCounts} />
              <ReturnRecordCard record={record} />
              <ForgeDirectionCard forgeCategoryCounts={record.forgeCategoryCounts} />
              <PracticeRhythmCard record={record} />
              <WeeklyAccountCard onPress={openJournal} />
              <NextCommandCard record={record} />
              <AppCard tone="overlay">
                <AppText variant="body" color="calm" align="center">
                  {'Command is trained in the return.\nThe record shows where the fire asks for discipline.'}
                </AppText>
              </AppCard>
            </>
          ) : (
            <EmptyRecord onOpen={openChamber} />
          )
        ) : null}
      </View>
    </AppScreen>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  sectionLabel: { marginBottom: theme.spacing.sm },
  cardBody: { gap: theme.spacing.sm },
  cardCta: { marginTop: theme.spacing.lg },
  emptyContainer: { gap: theme.spacing.lg },
  emptyNote: { marginTop: theme.spacing.xs },

  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  barLabel: { width: 110 },
  barTrack: {
    flex: 1,
    height: 4,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  barFill: {
    backgroundColor: theme.colors.ember,
    borderRadius: 2,
  },
  barCount: { width: 28, textAlign: 'right' },

  forgeInsight: { marginTop: theme.spacing.sm },

  rhythmGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  rhythmItem: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rhythmNote: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },

  commandBody: { marginTop: theme.spacing.sm },
});
