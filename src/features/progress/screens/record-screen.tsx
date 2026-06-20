import { type FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { copy } from '@/content';
import { useProgressSummary } from '@/features/progress/hooks/use-progress-summary';
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
  AppHero,
  AppScreen,
  AppText,
  Bento,
  BentoItem,
  FORGE_GLYPHS,
  MirrorSigil,
  symbolStroke,
  TRIGGER_GLYPHS,
  useCountUp,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="caption" color="muted" uppercase style={styles.sectionLabel}>
      {children}
    </AppText>
  );
}

type InsightColor = 'accent' | 'energy' | 'calm' | 'secondary';

function InsightRow({ label, value, valueColor = 'accent' }: { label: string; value: string; valueColor?: InsightColor }) {
  return (
    <View style={styles.insightRow}>
      <AppText variant="body" color="secondary">{label}</AppText>
      <AppText variant="body" color={valueColor}>{value}</AppText>
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
        <AppText variant="body" color="muted">{copy.record.arc.notStarted}</AppText>
      ) : (
        <View style={styles.cardBody}>
          <AppText variant="heading" color="primary">{`Day ${arc.currentDay} of ${arc.totalDays}`}</AppText>
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
              <AppText variant="caption" color="muted" uppercase>{copy.record.arc.began}</AppText>
              <AppText variant="body" color="secondary">{arc.startDateISO ? formatDate(arc.startDateISO) : '—'}</AppText>
            </View>
            <View style={styles.arcDateRight}>
              <AppText variant="caption" color="muted" uppercase>{copy.record.arc.crown}</AppText>
              <AppText variant="body" color="energy">{arc.endDateISO ? formatDate(arc.endDateISO) : '—'}</AppText>
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
      <AppText variant="display" color="energy" numberOfLines={1} adjustsFontSizeToFit>{display.toString()}</AppText>
      <AppText variant="caption" color="muted" uppercase numberOfLines={1}>{label}</AppText>
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
        <RhythmItem label={copy.record.rhythm.forge} value={practiceRhythm.forgeActsThisWeek} />
      </View>
      <AppText variant="caption" color="muted" style={styles.rhythmNote}>{copy.record.rhythm.note}</AppText>
    </AppCard>
  );
}

// ─── Trends ───────────────────────────────────────────────────────────────────

type TrendCopy = { label: string; caption: string; easing: string; steady: string; rising: string; empty: string };

/**
 * A trend over recent weeks. `kind: 'count'` charts a frequency and normalizes to
 * the busiest week; `kind: 'average'` charts a 1–5 mean on a fixed 0–5 scale. Reads
 * as felt experience, never a clinical claim, and a hard week is a cue, never a failure.
 */
function TrendCard({ series, text, kind, color }: { series: TrendSeries; text: TrendCopy; kind: 'count' | 'average'; color?: string }) {
  if (!series.hasEnoughData) {
    return (
      <AppCard tone="overlay">
        <SectionLabel>{text.label}</SectionLabel>
        <AppText variant="body" color="muted">{text.empty}</AppText>
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
      <AppText variant="body" color="secondary" style={styles.framing}>{headline}</AppText>
      <AppBarSeries data={data} color={color} accessibilityLabel={`${text.label}. ${text.caption}.`} />
      <AppText variant="caption" color="muted" style={styles.rhythmNote}>{text.caption}</AppText>
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
          <AppText variant="title" color="primary">{reveal.title}</AppText>
          <AppText variant="body" color="secondary">{reveal.body}</AppText>
        </View>
      ) : (
        <AppText variant="body" color="muted">{copy.record.reveal.empty}</AppText>
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
              {Glyph ? <Glyph size={24} color={active ? colors.primary : colors.textMuted} strokeWidth={symbolStroke(24)} /> : null}
              <AppText variant="label" color={active ? 'primary' : 'muted'} numberOfLines={1}>{item.label}</AppText>
              <AppText variant="caption" color={active ? 'energy' : 'muted'}>{item.count.toString()}</AppText>
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
        <AppText variant="body" color="muted">{copy.record.fireMap.empty}</AppText>
      ) : (
        <CountTiles glyphs={TRIGGER_GLYPHS} items={triggerCounts.map((t) => ({ key: t.triggerType, label: t.label, count: t.count }))} />
      )}
    </AppCard>
  );
}

function ForgeBalanceCard({ forgeCategoryCounts, forgeBalance }: { forgeCategoryCounts: ForgeCategoryCount[]; forgeBalance: string | null }) {
  return (
    <AppCard tone="overlay">
      <SectionLabel>{copy.record.forge.label}</SectionLabel>
      {forgeBalance ? (
        <>
          <AppText variant="body" color="secondary" style={styles.framing}>{forgeBalance}</AppText>
          <CountTiles glyphs={FORGE_GLYPHS} items={forgeCategoryCounts.map((c) => ({ key: c.category, label: c.label, count: c.count }))} />
        </>
      ) : (
        <AppText variant="body" color="muted">{copy.record.forge.empty}</AppText>
      )}
    </AppCard>
  );
}

/** This week's pattern — only the rows that have something to say. */
function WeeklyPatternCard({ pattern }: { pattern: WeeklyPattern }) {
  const rows: { label: string; value: string }[] = [];
  if (pattern.mostCommonTriggerLabel) rows.push({ label: copy.record.pattern.trigger, value: pattern.mostCommonTriggerLabel });
  if (pattern.strongestUrgeHourLabel) rows.push({ label: copy.record.pattern.hour, value: pattern.strongestUrgeHourLabel });
  if (pattern.mostCommonResponse) rows.push({ label: copy.record.pattern.response, value: pattern.mostCommonResponse });
  if (pattern.strongestForgeCategoryLabel) rows.push({ label: copy.record.pattern.forge, value: pattern.strongestForgeCategoryLabel });
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
        <AppText variant="title" color="primary">{record.nextCommand.title}</AppText>
        <AppText variant="body" color="secondary">{record.nextCommand.body}</AppText>
      </View>
    </AppCard>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * The Record — the practice mirror. The metrics half of the former Hall: the
 * 90-day arc, practice rhythm, the fire over time, what the record reveals, the
 * fire map, forge balance, this week's pattern, and the next command. Honors and
 * trials live in the Hall tab.
 */
export function RecordScreen() {
  const { record, refresh } = useProgressSummary();
  const tone = useSurfaceTone({ kind: 'semantic', name: 'mirror' });

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={tone}
          eyebrow={copy.record.eyebrow}
          title={copy.record.title}
          subtitle={copy.record.subtitle}
          art={<MirrorSigil size={88} color={tone.text} strokeWidth={symbolStroke(88)} />}
        />

        <AppCard tone="overlay">
          <AppText variant="body" color="secondary">{copy.record.intention}</AppText>
        </AppCard>

        {record ? (
          <>
            <ArcCard arc={record.arc} />
            <RhythmCard practiceRhythm={record.practiceRhythm} />
            <TrendCard series={record.urgeTrend} text={copy.record.urgeTrend} kind="count" />
            <RevealCard reveal={record.reveal} />
            <FireMapCard triggerCounts={record.triggerCounts} />
            <ForgeBalanceCard forgeCategoryCounts={record.forgeCategoryCounts} forgeBalance={record.forgeBalance} />
            <WeeklyPatternCard pattern={record.weeklyPattern} />
            <NextCommandCard record={record} />
          </>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  sectionLabel: { marginBottom: theme.spacing.sm },
  countTile: { gap: theme.spacing.xs, alignItems: 'flex-start' },
  cardBody: { gap: theme.spacing.sm },
  framing: { marginBottom: theme.spacing.md },
  insightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.md },
  arcTimeline: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginVertical: theme.spacing.xs },
  arcDot: { width: 9, height: 9, borderRadius: 5 },
  arcTrack: { flex: 1, height: 6, flexDirection: 'row', borderRadius: 3, overflow: 'hidden' },
  arcFill: { borderRadius: 3 },
  arcDates: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  arcDateRight: { alignItems: 'flex-end' },
  rhythmGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  rhythmItem: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
  rhythmNote: { marginTop: theme.spacing.sm, textAlign: 'center' },
});
