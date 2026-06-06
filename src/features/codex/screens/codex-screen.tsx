import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  archetypeProfiles,
  dailyPath,
  getPrinciples,
  rites,
  studies,
} from '@/content';
import type { Study } from '@/content/schemas/study.schema';
import {
  AppButton,
  AppCard,
  AppChip,
  AppDivider,
  AppHeader,
  AppQuoteBlock,
  AppScreen,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';

type CodexTab = 'path' | 'principles' | 'archetypes' | 'studies' | 'rites';

const TABS: { id: CodexTab; label: string }[] = [
  { id: 'path', label: 'Daily Path' },
  { id: 'principles', label: 'Principles' },
  { id: 'archetypes', label: 'Archetypes' },
  { id: 'studies', label: 'Studies' },
  { id: 'rites', label: 'Rites' },
];

// ── Tab: Daily Path ───────────────────────────────────────────────────────────

function DailyPathTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <View style={styles.list}>
      {dailyPath.map((day) => {
        const isOpen = expanded === day.id;
        return (
          <AppCard
            key={day.id}
            tone={isOpen ? 'raised' : 'overlay'}
            onPress={() => setExpanded(isOpen ? null : day.id)}
          >
            <AppText variant="caption" color="muted" uppercase>
              {`Day ${day.dayNumber} · ${day.season.replace(/_/g, ' ')}`}
            </AppText>
            <AppText variant="label" color="primary">
              {day.title}
            </AppText>
            {isOpen ? (
              <>
                <AppText variant="body" color="secondary" style={styles.body}>
                  {day.openingLine}
                </AppText>
                <AppDivider />
                <AppText variant="caption" color="accent" uppercase>
                  Command
                </AppText>
                <AppText variant="body" color="primary">
                  {day.command}
                </AppText>
                <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                  Practice
                </AppText>
                <AppText variant="body" color="secondary">
                  {day.practice}
                </AppText>
              </>
            ) : (
              <AppText variant="caption" color="muted" numberOfLines={2}>
                {day.openingLine}
              </AppText>
            )}
          </AppCard>
        );
      })}
    </View>
  );
}

// ── Tab: Principles ───────────────────────────────────────────────────────────

function PrinciplesTab() {
  const principles = getPrinciples();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={styles.list}>
      {principles.map((principle) => {
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
              <AppText variant="body" color="secondary" style={styles.body}>
                {principle.body}
              </AppText>
            ) : null}
          </AppCard>
        );
      })}
    </View>
  );
}

// ── Tab: Archetypes ───────────────────────────────────────────────────────────

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
            <AppText variant="subheading">{archetype.name}</AppText>
            <AppText variant="caption" color="secondary">
              {archetype.essence}
            </AppText>
            {isOpen ? (
              <>
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
              </>
            ) : (
              <AppText variant="caption" color="energy" style={styles.body}>
                {archetype.retainLine}
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
          <AppChip
            label={selected.lineage.replace(/_/g, ' ')}
            tone="accent"
            selected
          />
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

        <AppQuoteBlock
          quote={selected.reflectionPrompt}
          attribution="Reflection"
        />

        <AppCard tone="overlay" border="subtle">
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
        <AppCard
          key={study.id}
          tone="overlay"
          onPress={() => setSelected(study)}
        >
          <AppChip label={study.lineage.replace(/_/g, ' ')} tone="accent" />
          <AppText variant="subheading" style={styles.body}>
            {study.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {study.summary}
          </AppText>
          <AppText variant="caption" color="muted" style={styles.spacing}>
            {study.guardrail}
          </AppText>
        </AppCard>
      ))}
    </View>
  );
}

// ── Tab: Rites ────────────────────────────────────────────────────────────────

function RitesTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <View style={styles.list}>
      {rites.map((rite) => {
        const isOpen = expanded === rite.id;
        return (
          <AppCard
            key={rite.id}
            tone={isOpen ? 'raised' : 'overlay'}
            onPress={() => setExpanded(isOpen ? null : rite.id)}
          >
            <AppChip label={`Day ${rite.milestoneDay}`} tone="energy" selected />
            <AppText variant="subheading" style={styles.body}>
              {rite.title}
            </AppText>
            {isOpen ? (
              <>
                <AppText variant="body" color="secondary" style={styles.body}>
                  {rite.ceremonialPassage}
                </AppText>
                <AppDivider />
                <AppText variant="caption" color="energy" uppercase>
                  Vow renewal
                </AppText>
                <AppText variant="body" color="calm" style={styles.body}>
                  {rite.vowRenewal}
                </AppText>
                {rite.forgeChallenge ? (
                  <>
                    <AppText variant="caption" color="muted" uppercase style={styles.spacing}>
                      Forge challenge
                    </AppText>
                    <AppText variant="body" color="secondary">
                      {rite.forgeChallenge}
                    </AppText>
                  </>
                ) : null}
                <AppText variant="caption" color="muted" style={styles.spacing}>
                  {rite.seal}
                </AppText>
              </>
            ) : (
              <AppText variant="caption" color="muted">
                {rite.ceremonialPassage.split('\n\n')[0]}
              </AppText>
            )}
          </AppCard>
        );
      })}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

const SECTION_META: Record<CodexTab, { title: string; count: number; unit: string }> = {
  path: { title: 'Daily Path', count: dailyPath.length, unit: 'chambers' },
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
        <AppHeader
          eyebrow="Codex"
          title="The library of formation."
          subtitle="Teachings, traditions, principles, and rites."
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

        {/* One clear section header instead of a row of competing chips */}
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
});
