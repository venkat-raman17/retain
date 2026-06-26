import { type ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  arcs,
  getAllRituals,
  getPrinciples,
  rites,
  studies,
} from '@/content';
import type { Rite, Study } from '@/content';
import {
  AppButton,
  AppCard,
  AppChip,
  AppHero,
  AppQuoteBlock,
  AppScreen,
  AppText,
  ArcSeal,
  FadeInRise,
  PillarsSigil,
  RiteMedallion,
  SealArt,
  symbolStroke,
} from '@/shared/components';
import { arcTone, theme } from '@/shared/design';
import { useSurfaceTone, type SurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';
import { Routes } from '@/navigation';

type CodexTab = 'path' | 'principles' | 'rituals' | 'studies' | 'rites';

const TABS: { id: CodexTab; label: string }[] = [
  { id: 'path', label: 'Daily Path' },
  { id: 'principles', label: 'Principles' },
  { id: 'rituals', label: 'Rituals' },
  { id: 'studies', label: 'Studies' },
  { id: 'rites', label: 'Rites' },
];

// ── Tab: Daily Path ───────────────────────────────────────────────────────────
// Shows the nine-arc structure. The full 90-day grid lives in the Path Map.

function DailyPathTab() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={styles.list}>
      <AppText variant="body" color="secondary">
        Nine arcs. Ninety chambers. One opens each day.
      </AppText>
      {arcs.map((arc) => {
        const isOpen = expanded === arc.id;
        const color = arcTone(arc.arcNumber);
        return (
          <AppCard
            key={arc.id}
            tone={isOpen ? 'raised' : 'overlay'}
            onPress={() => setExpanded(isOpen ? null : arc.id)}
          >
            <View style={styles.arcHeader}>
              <AppText variant="caption" color="muted" uppercase style={styles.arcLabel}>
                {`Arc ${arc.arcNumber} · Days ${arc.dayStart}–${arc.dayEnd}`}
              </AppText>
              <ArcSeal arcNumber={arc.arcNumber} size={36} color={color} strokeWidth={symbolStroke(36)} />
            </View>
            <AppText variant="label" color="primary" style={styles.body}>
              {arc.title}
            </AppText>
            {isOpen ? (
              <FadeInRise>
                <AppText variant="body" color="secondary" style={styles.body}>
                  {arc.description}
                </AppText>
                <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                  The question
                </AppText>
                <AppText variant="body" color="accent" style={styles.body}>
                  {arc.centralQuestion}
                </AppText>
                <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                  On completion
                </AppText>
                <AppText variant="caption" color="calm" style={styles.body}>
                  {arc.completionCopy}
                </AppText>
              </FadeInRise>
            ) : (
              <AppText variant="caption" color="secondary" numberOfLines={2} style={styles.body}>
                {arc.description}
              </AppText>
            )}
          </AppCard>
        );
      })}
      <AppButton
        label="View the Path Map"
        variant="secondary"
        fullWidth
        onPress={() => router.push(Routes.pathMap)}
      />
    </View>
  );
}

// ── Tab: Principles ───────────────────────────────────────────────────────────

function PrinciplesTab() {
  const all = getPrinciples();
  const [expanded, setExpanded] = useState<string | null>(null);

  const featured = all[0];
  const rest = all.slice(1);

  if (!featured) return null;

  return (
    <View style={styles.list}>
      {/* First principle is always featured and expanded */}
      <AppCard tone="raised" border="ember">
        <AppText variant="caption" color="accent" uppercase>
          Featured Principle
        </AppText>
        <AppText variant="label" color="accent" style={styles.body}>
          {featured.title}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.body}>
          {featured.body}
        </AppText>
      </AppCard>

      {rest.map((principle) => {
        const isOpen = expanded === principle.id;
        return (
          <AppCard
            key={principle.id}
            tone={isOpen ? 'raised' : 'overlay'}
            onPress={() => setExpanded(isOpen ? null : principle.id)}
          >
            <AppText variant="label" color="accent">
              {principle.title}
            </AppText>
            {isOpen ? (
              <FadeInRise>
                <AppText variant="body" color="secondary" style={styles.body}>
                  {principle.body}
                </AppText>
              </FadeInRise>
            ) : null}
          </AppCard>
        );
      })}
    </View>
  );
}

// ── Tab: Rituals ──────────────────────────────────────────────────────────────
// The three rhythms (morning, evening, temptation-hour) — meant to be practiced.

function RitualsTab() {
  const rituals = getAllRituals();
  return (
    <View style={styles.list}>
      <AppText variant="body" color="secondary">
        Three rhythms to anchor the day — practiced, not just read.
      </AppText>
      {rituals.map((ritual) => (
        <AppCard key={ritual.id} tone="overlay">
          <View style={styles.riteHeader}>
            <AppText variant="subheading" style={styles.archetypeName}>
              {ritual.title}
            </AppText>
            <AppChip label={ritual.time} tone="accent" />
          </View>
          <AppText variant="body" color="accent" style={styles.body}>
            {ritual.intention}
          </AppText>
          {ritual.steps.map((step, i) => (
            <View key={i} style={styles.ritualStep}>
              <AppText variant="caption" color="energy">
                {`${i + 1}`}
              </AppText>
              <AppText variant="body" color="secondary" style={styles.ritualStepText}>
                {step}
              </AppText>
            </View>
          ))}
        </AppCard>
      ))}
    </View>
  );
}

// ── Tab: Studies ──────────────────────────────────────────────────────────────

function StudiesTab() {
  const [selected, setSelected] = useState<Study | null>(null);

  if (selected) {
    return (
      <View style={styles.list}>
        <AppButton
          label="Back to Studies"
          variant="ghost"
          onPress={() => setSelected(null)}
        />
        {/* Study detail — dark reading surfaces, consistent with the Rites tab and chamber. */}
        <AppCard tone="raised">
          <AppChip label={selected.lineage.replace(/_/g, ' ')} tone="accent" selected />
          <AppText variant="title" color="primary" style={styles.body}>
            {selected.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {selected.summary}
          </AppText>
        </AppCard>

        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" uppercase>
            Historical context
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.historicalFrame}
          </AppText>
        </AppCard>

        <AppCard tone="overlay" border="ember">
          <AppText variant="caption" color="accent" uppercase>
            Manforge principle
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.retainPrinciple}
          </AppText>
        </AppCard>

        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" uppercase>
            Practice
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.practice}
          </AppText>
        </AppCard>

        <AppQuoteBlock quote={selected.reflectionPrompt} attribution="Reflection" />

        <AppCard tone="overlay">
          <AppText variant="caption" color="muted">
            {selected.guardrail}
          </AppText>
        </AppCard>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {studies.map((study) => (
        <AppCard key={study.id} tone="overlay" onPress={() => setSelected(study)}>
          <AppChip label={study.lineage.replace(/_/g, ' ')} tone="accent" />
          <AppText variant="subheading" style={styles.body}>
            {study.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {study.summary}
          </AppText>
        </AppCard>
      ))}
      <AppText variant="caption" color="muted" align="center" style={styles.disclaimer}>
        Studies are philosophical inspiration, not medical advice, religious authority, or sexual
        technique.
      </AppText>
    </View>
  );
}

// ── Tab: Rites ────────────────────────────────────────────────────────────────
// Compact list; full ceremonial detail opens on tap.

function RitesTab() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<Rite | null>(null);

  if (selected) {
    return (
      <View style={styles.list}>
        <AppButton
          label="Back to Rites"
          variant="ghost"
          onPress={() => setSelected(null)}
        />
        <AppCard tone="raised" border="gold">
          <View style={styles.riteDetailHead}>
            <AppChip label={`Day ${selected.milestoneDay}`} tone="energy" selected />
            <RiteMedallion day={selected.milestoneDay} size={56} color={colors.gold} strokeWidth={symbolStroke(56)} />
          </View>
          <AppText variant="title" style={styles.body}>
            {selected.title}
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.ceremonialPassage}
          </AppText>
        </AppCard>

        <AppCard tone="overlay">
          <AppText variant="caption" color="energy" uppercase>
            Vow renewal
          </AppText>
          <AppText variant="body" color="calm" style={styles.body}>
            {selected.vowRenewal}
          </AppText>
        </AppCard>

        <AppCard>
          <AppText variant="caption" color="muted" uppercase>
            Forge challenge
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.forgeChallenge}
          </AppText>
        </AppCard>

        <AppCard tone="overlay">
          <AppText variant="seal" color="gold">
            {selected.seal}
          </AppText>
        </AppCard>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {rites.map((rite) => (
        <AppCard key={rite.id} tone="overlay" onPress={() => setSelected(rite)}>
          <View style={styles.riteHeader}>
            <AppChip label={`Day ${rite.milestoneDay}`} tone="energy" selected />
            <RiteMedallion day={rite.milestoneDay} size={46} color={colors.gold} strokeWidth={symbolStroke(46)} />
          </View>
          <AppText variant="subheading" style={styles.body}>
            {rite.title}
          </AppText>
          <AppText variant="caption" color="muted" style={styles.body}>
            {rite.seal}
          </AppText>
        </AppCard>
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

const SECTION_META: Record<CodexTab, { count: number; unit: string; eyebrow: string; title: string; subtitle: string }> = {
  path: { count: arcs.length, unit: 'arcs', eyebrow: 'Codex · Daily Path', title: 'Nine arcs, ninety chambers', subtitle: 'The shape of the rite.' },
  principles: { count: getPrinciples().length, unit: 'entries', eyebrow: 'Codex · Principles', title: 'The laws of the practice', subtitle: 'What holds when the fire rises.' },
  rituals: { count: getAllRituals().length, unit: 'rituals', eyebrow: 'Codex · Rituals', title: 'The daily rhythms', subtitle: 'Anchor the morning, the night, and the hard hour.' },
  studies: { count: studies.length, unit: 'studies', eyebrow: 'Codex · Studies', title: 'Lineages of restraint', subtitle: 'Inspiration, not authority.' },
  rites: { count: rites.length, unit: 'rites', eyebrow: 'Codex · Rites', title: 'The milestone ceremonies', subtitle: 'Marks along the ninety days.' },
};

function heroArt(tab: CodexTab, tone: SurfaceTone): ReactNode {
  switch (tab) {
    case 'path':
      return <SealArt source={{ kind: 'arc', arcNumber: 1 }} size={84} color={tone.text} />;
    case 'rites':
      return <SealArt source={{ kind: 'rite', day: 90 }} size={84} color={tone.text} />;
    default:
      return <PillarsSigil size={84} color={tone.text} strokeWidth={symbolStroke(84)} />;
  }
}

export function CodexScreen() {
  const [activeTab, setActiveTab] = useState<CodexTab>('path');
  const section = SECTION_META[activeTab];

  // Each tab has its own tone — the Codex reads as five distinct rooms.
  const toneByTab: Record<CodexTab, SurfaceTone> = {
    path: useSurfaceTone({ kind: 'arc', arcNumber: 1 }),
    principles: useSurfaceTone({ kind: 'semantic', name: 'primary' }),
    rituals: useSurfaceTone({ kind: 'semantic', name: 'accent' }),
    studies: useSurfaceTone({ kind: 'semantic', name: 'accent' }),
    rites: useSurfaceTone({ kind: 'semantic', name: 'gold' }),
  };
  const tone = toneByTab[activeTab];

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={tone}
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          art={heroArt(activeTab, tone)}
        />

        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <AppButton
              key={tab.id}
              label={tab.label}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              size="md"
              onPress={() => setActiveTab(tab.id)}
            />
          ))}
        </View>

        <AppText variant="caption" color="muted" uppercase>
          {`${section.count} ${section.unit}`}
        </AppText>

        {activeTab === 'path' && <DailyPathTab />}
        {activeTab === 'principles' && <PrinciplesTab />}
        {activeTab === 'rituals' && <RitualsTab />}
        {activeTab === 'studies' && <StudiesTab />}
        {activeTab === 'rites' && <RitesTab />}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  list: { gap: theme.spacing.md },
  body: { marginTop: theme.spacing.xs },
  spacing: { marginTop: theme.spacing.sm },
  disclaimer: { marginTop: theme.spacing.xs },
  arcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arcLabel: { flex: 1 },
  archetypeName: { flex: 1 },
  riteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  riteDetailHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ritualStep: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  ritualStepText: { flex: 1 },
});
