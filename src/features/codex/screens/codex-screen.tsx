import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  archetypeProfiles,
  arcs,
  getPrinciples,
  rites,
  studies,
} from '@/content';
import type { Rite, Study } from '@/content';
import {
  AppButton,
  AppCard,
  AppChip,
  AppDivider,
  AppHeader,
  AppQuoteBlock,
  AppScreen,
  AppText,
  ArcSeal,
  ArchetypeSigil,
  FadeInRise,
  PillarsSigil,
  RiteMedallion,
  ScreenCrest,
  symbolStroke,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { Routes } from '@/navigation';

type CodexTab = 'path' | 'principles' | 'archetypes' | 'studies' | 'rites';

const TABS: { id: CodexTab; label: string }[] = [
  { id: 'path', label: 'Daily Path' },
  { id: 'principles', label: 'Principles' },
  { id: 'archetypes', label: 'Archetypes' },
  { id: 'studies', label: 'Studies' },
  { id: 'rites', label: 'Rites' },
];

// ── Tab: Daily Path ───────────────────────────────────────────────────────────
// Shows the nine-arc structure. The full 90-day grid lives in the Path Map.

function DailyPathTab() {
  const router = useRouter();
  return (
    <View style={styles.list}>
      <AppText variant="body" color="secondary">
        Nine arcs. Ninety chambers. One opens each day.
      </AppText>
      {arcs.map((arc) => (
        <AppCard key={arc.id} tone="overlay">
          <View style={styles.arcHeader}>
            <AppText variant="caption" color="muted" uppercase style={styles.arcLabel}>
              {`Arc ${arc.arcNumber} · Days ${arc.dayStart}–${arc.dayEnd}`}
            </AppText>
            <ArcSeal arcNumber={arc.arcNumber} size={32} color={theme.colors.textMuted} strokeWidth={symbolStroke(32)} />
          </View>
          <AppText variant="label" color="primary" style={styles.body}>
            {arc.title}
          </AppText>
          <AppText variant="caption" color="secondary" numberOfLines={2} style={styles.body}>
            {arc.description}
          </AppText>
        </AppCard>
      ))}
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

// ── Tab: Archetypes ───────────────────────────────────────────────────────────
// Compact list: name, essence, daily command. Full detail expands on tap.

function ArchetypesTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <View style={styles.list}>
      {archetypeProfiles.map((archetype) => {
        const isOpen = expanded === archetype.id;
        return (
          <AppCard
            key={archetype.id}
            tone={isOpen ? 'raised' : 'overlay'}
            onPress={() => setExpanded(isOpen ? null : archetype.id)}
          >
            <View style={styles.archetypeHeader}>
              <AppText variant="subheading" style={styles.archetypeName}>{archetype.name}</AppText>
              <ArchetypeSigil archetype={archetype.id} size={28} color={theme.colors.textMuted} strokeWidth={symbolStroke(28)} />
            </View>
            <AppText variant="caption" color="secondary" style={styles.body}>
              {archetype.essence}
            </AppText>
            {isOpen ? (
              <FadeInRise>
                <View style={styles.archetypeGlyph}>
                  <ArchetypeSigil archetype={archetype.id} size={80} color={theme.colors.textMuted} strokeWidth={symbolStroke(80)} />
                </View>
                <AppDivider />
                <AppText variant="caption" color="muted" uppercase>
                  Light
                </AppText>
                <AppText variant="body" color="secondary">
                  {archetype.light}
                </AppText>
                <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                  Shadow
                </AppText>
                <AppText variant="body" color="secondary">
                  {archetype.shadow}
                </AppText>
                <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                  Discipline
                </AppText>
                <AppText variant="body" color="secondary">
                  {archetype.discipline}
                </AppText>
                <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                  Daily command
                </AppText>
                <AppText variant="label" color="energy">
                  {archetype.dailyCommand}
                </AppText>
                <AppText variant="caption" color="energy" style={styles.spacing}>
                  {archetype.retainLine}
                </AppText>
              </FadeInRise>
            ) : (
              <AppText variant="caption" color="accent" style={styles.body}>
                {`Command: ${archetype.dailyCommand}`}
              </AppText>
            )}
          </AppCard>
        );
      })}
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
        <AppCard tone="raised">
          <AppChip label={selected.lineage.replace(/_/g, ' ')} tone="accent" selected />
          <AppText variant="title" style={styles.body}>
            {selected.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {selected.summary}
          </AppText>
        </AppCard>

        <AppCard>
          <AppText variant="caption" color="muted" uppercase>
            Historical context
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.historicalFrame}
          </AppText>
        </AppCard>

        <AppCard tone="overlay">
          <AppText variant="caption" color="accent" uppercase>
            Retain principle
          </AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {selected.retainPrinciple}
          </AppText>
        </AppCard>

        <AppCard>
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
  const [selected, setSelected] = useState<Rite | null>(null);

  if (selected) {
    return (
      <View style={styles.list}>
        <AppButton
          label="Back to Rites"
          variant="ghost"
          onPress={() => setSelected(null)}
        />
        <AppCard tone="raised">
          <AppChip label={`Day ${selected.milestoneDay}`} tone="energy" selected />
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
          <AppText variant="seal" color="muted">
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
            <RiteMedallion day={rite.milestoneDay} size={44} color={theme.colors.textMuted} strokeWidth={symbolStroke(44)} />
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

const SECTION_META: Record<CodexTab, { title: string; count: number; unit: string }> = {
  path: { title: 'Daily Path', count: arcs.length, unit: 'arcs' },
  principles: { title: 'Principles', count: getPrinciples().length, unit: 'entries' },
  archetypes: { title: 'Archetypes', count: archetypeProfiles.length, unit: 'archetypes' },
  studies: { title: 'Studies', count: studies.length, unit: 'studies' },
  rites: { title: 'Rites', count: rites.length, unit: 'rites' },
};

export function CodexScreen() {
  const [activeTab, setActiveTab] = useState<CodexTab>('path');
  const section = SECTION_META[activeTab];

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <View>
          <ScreenCrest>
            <PillarsSigil size={110} color={theme.colors.textMuted} strokeWidth={symbolStroke(110)} />
          </ScreenCrest>
          <AppHeader
            eyebrow="Codex"
            title="The library of formation."
            subtitle="Teachings, traditions, principles, and rites."
          />
        </View>

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

        <View style={styles.sectionHeader}>
          <AppText variant="subheading">{section.title}</AppText>
          <AppText variant="caption" color="muted" uppercase>
            {`${section.count} ${section.unit}`}
          </AppText>
        </View>

        {activeTab === 'path' && <DailyPathTab />}
        {activeTab === 'principles' && <PrinciplesTab />}
        {activeTab === 'archetypes' && <ArchetypesTab />}
        {activeTab === 'studies' && <StudiesTab />}
        {activeTab === 'rites' && <RitesTab />}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  list: { gap: theme.spacing.md },
  body: { marginTop: theme.spacing.xs },
  spacing: { marginTop: theme.spacing.sm },
  disclaimer: { marginTop: theme.spacing.xs },
  arcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arcLabel: { flex: 1 },
  archetypeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  archetypeName: { flex: 1 },
  archetypeGlyph: { alignItems: 'center', opacity: 0.15, paddingVertical: theme.spacing.sm },
  riteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
