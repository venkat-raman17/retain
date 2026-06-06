import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import { Routes } from '@/navigation';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  FadeInRise,
  MirrorSigil,
  NoRecordSymbol,
  ScreenCrest,
  symbolStroke,
  TRIGGER_GLYPHS,
  useCountUp,
} from '@/shared/components';
import { theme, type AppTheme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

import { useProgressSummary } from '../hooks/use-progress-summary';
import type {
  PathArc,
  PracticeRhythm,
  RecordData,
  ReturnRecord,
  TriggerCount,
  WeeklyPattern,
} from '../services/progress-service';

type ThemeColors = AppTheme['colors'];
type InsightColor = 'accent' | 'energy' | 'calm' | 'secondary';

/** Display format matches the Journal screen: "Jun 6, 2026". */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Shared row primitives ────────────────────────────────────────────────────

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

// ─── The 90-day arc (when it began, when the Crown is reached) ─────────────────

function ArcCard({ arc, colors }: { arc: PathArc; colors: ThemeColors }) {
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

          {/* Timeline: start ●━━━━○ crown, filled to the current day */}
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

// ─── 1. What the record reveals (lead synthesis) ───────────────────────────────

function RevealCard({ record }: { record: RecordData }) {
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.reveal.label}</SectionLabel>
      {record.reveal ? (
        <View style={styles.cardBody}>
          <AppText variant="title" color="primary">
            {record.reveal.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {record.reveal.body}
          </AppText>
          <PatternRows pattern={record.weeklyPattern} />
        </View>
      ) : (
        <AppText variant="body" color="muted">
          {copy.record.reveal.empty}
        </AppText>
      )}
    </AppCard>
  );
}

function PatternRows({ pattern }: { pattern: WeeklyPattern }) {
  const hasAny =
    pattern.mostCommonTriggerLabel !== null ||
    pattern.strongestUrgeHourLabel !== null ||
    pattern.mostCommonResponse !== null ||
    pattern.strongestForgeCategoryLabel !== null;
  if (!hasAny) return null;

  return (
    <View style={styles.patternRows}>
      {pattern.mostCommonTriggerLabel ? (
        <InsightRow label={copy.record.pattern.trigger} value={pattern.mostCommonTriggerLabel} valueColor="accent" />
      ) : null}
      {pattern.strongestUrgeHourLabel ? (
        <InsightRow label={copy.record.pattern.hour} value={pattern.strongestUrgeHourLabel} valueColor="accent" />
      ) : null}
      {pattern.mostCommonResponse ? (
        <InsightRow label={copy.record.pattern.response} value={pattern.mostCommonResponse} valueColor="secondary" />
      ) : null}
      {pattern.strongestForgeCategoryLabel ? (
        <InsightRow label={copy.record.pattern.forge} value={pattern.strongestForgeCategoryLabel} valueColor="energy" />
      ) : null}
    </View>
  );
}

// ─── 2. The fire map ────────────────────────────────────────────────────────

function FireMapCard({ triggerCounts, colors }: { triggerCounts: TriggerCount[]; colors: ThemeColors }) {
  const total = triggerCounts.reduce((sum, t) => sum + t.count, 0);
  const maxCount = Math.max(...triggerCounts.map((t) => t.count), 1);
  return (
    <AppCard>
      <SectionLabel>{copy.record.fireMap.label}</SectionLabel>
      {total === 0 ? (
        <AppText variant="body" color="muted" style={styles.framing}>
          {copy.record.fireMap.empty}
        </AppText>
      ) : null}
      <View style={styles.cardBody}>
        {triggerCounts.map((t) => (
          <FireRow key={t.triggerType} item={t} max={maxCount} colors={colors} />
        ))}
      </View>
    </AppCard>
  );
}

function FireRow({ item, max, colors }: { item: TriggerCount; max: number; colors: ThemeColors }) {
  const Glyph = TRIGGER_GLYPHS[item.triggerType];
  const fill = max > 0 ? item.count / max : 0;
  const active = item.count > 0;
  return (
    <View style={styles.fireRow}>
      {Glyph ? (
        <Glyph size={18} color={active ? colors.ember : colors.textMuted} strokeWidth={symbolStroke(18)} />
      ) : null}
      <AppText variant="body" color="secondary" style={styles.fireLabel}>
        {item.label}
      </AppText>
      <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.barFill, { flex: fill, backgroundColor: colors.ember }]} />
        <View style={{ flex: Math.max(0, 1 - fill) }} />
      </View>
      <AppText variant="body" color={active ? 'energy' : 'muted'} style={styles.barCount}>
        {item.count.toString()}
      </AppText>
    </View>
  );
}

// ─── 3. The return ────────────────────────────────────────────────────────────

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

// ─── 4. Forge balance (interpretation only — the chart lives on the Forge tab) ──

function ForgeBalanceCard({ forgeBalance }: { forgeBalance: string | null }) {
  return (
    <AppCard>
      <SectionLabel>{copy.record.forge.label}</SectionLabel>
      <AppText variant="body" color={forgeBalance ? 'secondary' : 'muted'}>
        {forgeBalance ?? copy.record.forge.empty}
      </AppText>
    </AppCard>
  );
}

// ─── 5. Practice rhythm ────────────────────────────────────────────────────────

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

// ─── 6. Weekly account ─────────────────────────────────────────────────────────

function WeeklyAccountCard({ onPress }: { onPress: () => void }) {
  return (
    <AppCard border="gold">
      <SectionLabel>{copy.record.account.label}</SectionLabel>
      <View style={styles.cardBody}>
        {copy.record.account.prompts.map((prompt) => (
          <AppText key={prompt} variant="body" color="muted">
            {prompt}
          </AppText>
        ))}
      </View>
      <View style={styles.cardCta}>
        <AppButton label={copy.record.account.cta} variant="secondary" onPress={onPress} />
      </View>
    </AppCard>
  );
}

// ─── 7. Next command ───────────────────────────────────────────────────────────

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

// ─── Hard-error fallback (service returned null) ───────────────────────────────

function RecordUnavailable({ colors }: { colors: ThemeColors }) {
  return (
    <AppCard tone="overlay">
      <View style={styles.fallback}>
        <NoRecordSymbol size={48} color={colors.textMuted} strokeWidth={symbolStroke(48)} />
        <AppText variant="body" color="muted" align="center">
          {copy.record.reveal.empty}
        </AppText>
      </View>
    </AppCard>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ProgressScreen() {
  const { record, loading } = useProgressSummary();
  const { colors } = useTheme();
  const router = useRouter();

  const openJournal = () => router.push(Routes.journal as never);

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        {/* Intention header — the mirror sigil sits faintly behind the title */}
        <View>
          <ScreenCrest>
            <MirrorSigil size={120} color={colors.textMuted} strokeWidth={symbolStroke(120)} />
          </ScreenCrest>
          <AppHeader
            eyebrow={copy.record.eyebrow}
            title={copy.record.title}
            subtitle={copy.record.subtitle}
          />
          <AppText variant="body" color="secondary" style={styles.intention}>
            {copy.record.intention}
          </AppText>
        </View>

        {!loading ? (
          record ? (
            <>
              <FadeInRise index={0}>
                <ArcCard arc={record.arc} colors={colors} />
              </FadeInRise>
              <FadeInRise index={1}>
                <RevealCard record={record} />
              </FadeInRise>
              <FadeInRise index={2}>
                <FireMapCard triggerCounts={record.triggerCounts} colors={colors} />
              </FadeInRise>
              <FadeInRise index={3}>
                <ReturnCard returnRecord={record.returnRecord} />
              </FadeInRise>
              <FadeInRise index={4}>
                <ForgeBalanceCard forgeBalance={record.forgeBalance} />
              </FadeInRise>
              <FadeInRise index={5}>
                <RhythmCard practiceRhythm={record.practiceRhythm} />
              </FadeInRise>
              <FadeInRise index={6}>
                <WeeklyAccountCard onPress={openJournal} />
              </FadeInRise>
              <FadeInRise index={7}>
                <NextCommandCard record={record} />
              </FadeInRise>
              <FadeInRise index={8}>
                <AppCard tone="overlay">
                  <AppText variant="body" color="calm" align="center">
                    {copy.record.principle}
                  </AppText>
                </AppCard>
              </FadeInRise>
            </>
          ) : (
            <RecordUnavailable colors={colors} />
          )
        ) : null}
      </View>
    </AppScreen>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  intention: { marginTop: theme.spacing.sm },
  sectionLabel: { marginBottom: theme.spacing.sm },
  cardBody: { gap: theme.spacing.sm },
  cardCta: { marginTop: theme.spacing.lg },
  framing: { marginBottom: theme.spacing.md },

  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  patternRows: { marginTop: theme.spacing.sm, gap: theme.spacing.sm },

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

  fireRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  fireLabel: { width: 100 },
  barTrack: {
    flex: 1,
    height: 4,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: { borderRadius: 2 },
  barCount: { width: 24, textAlign: 'right' },

  rhythmGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  rhythmItem: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
  rhythmNote: { marginTop: theme.spacing.sm, textAlign: 'center' },

  fallback: { alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
});
