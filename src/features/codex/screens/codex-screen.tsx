import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  archetypeProfiles,
  codexDays,
  copy,
  dailyPath,
  rites,
  studies,
} from '@/content';
import {
  AppButton,
  AppCard,
  AppChip,
  AppContentCard,
  AppDivider,
  AppScreen,
  AppHeader,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';

type CodexTab = 'path' | 'archetypes' | 'studies' | 'rites';

const TABS: { id: CodexTab; label: string }[] = [
  { id: 'path', label: 'Daily Path' },
  { id: 'archetypes', label: 'Archetypes' },
  { id: 'studies', label: 'Studies' },
  { id: 'rites', label: 'Rites' },
];

function DailyPathTab() {
  return (
    <View style={styles.list}>
      {dailyPath.map((day) => (
        <AppContentCard
          key={day.id}
          eyebrow={`Day ${day.dayNumber} · ${day.season.replace(/_/g, ' ')}`}
          title={day.title}
          body={day.openingLine}
        />
      ))}
    </View>
  );
}

function ArchetypesTab() {
  return (
    <View style={styles.list}>
      {archetypeProfiles.map((archetype) => (
        <AppCard key={archetype.id} style={styles.archetypeCard}>
          <AppText variant="subheading">{archetype.name}</AppText>
          <AppText variant="body" color="secondary">
            {archetype.essence}
          </AppText>
          <AppDivider />
          <AppText variant="caption" color="muted">
            Shadow: {archetype.shadow}
          </AppText>
          <AppText variant="caption" color="energy" style={styles.retainLine}>
            {archetype.retainLine}
          </AppText>
        </AppCard>
      ))}
    </View>
  );
}

function StudiesTab() {
  return (
    <View style={styles.list}>
      {studies.map((study) => (
        <AppCard key={study.id} style={styles.studyCard}>
          <AppText variant="caption" color="accent" uppercase>
            {study.lineage.replace(/_/g, ' ')}
          </AppText>
          <AppText variant="subheading">{study.title}</AppText>
          <AppText variant="body" color="secondary">
            {study.summary}
          </AppText>
          <AppDivider />
          <AppText variant="caption" color="muted">
            {study.guardrail}
          </AppText>
        </AppCard>
      ))}
    </View>
  );
}

function RitesTab() {
  return (
    <View style={styles.list}>
      {rites.map((rite) => (
        <AppCard key={rite.id} style={styles.riteCard}>
          <AppText variant="caption" color="energy" uppercase>
            Day {rite.milestoneDay}
          </AppText>
          <AppText variant="subheading">{rite.title}</AppText>
          <AppText variant="body" color="secondary">
            {rite.ceremonialPassage.split('\n\n')[0]}
          </AppText>
          <AppText variant="caption" color="muted" style={styles.seal}>
            {rite.seal}
          </AppText>
        </AppCard>
      ))}
    </View>
  );
}

export function CodexScreen() {
  const [activeTab, setActiveTab] = useState<CodexTab>('path');

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow={copy.codex.eyebrow}
          title={copy.codex.title}
          subtitle={copy.codex.description}
        />

        {/* Tab bar */}
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

        {/* Codex day count chip */}
        <View style={styles.chips}>
          <AppChip
            label={`${codexDays.length} codex days`}
            tone="accent"
            selected
          />
          <AppChip label={`${dailyPath.length} path days`} tone="neutral" />
          <AppChip label={`${rites.length} rites`} tone="energy" />
        </View>

        {activeTab === 'path' && <DailyPathTab />}
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  list: { gap: theme.spacing.md },
  archetypeCard: { gap: theme.spacing.sm },
  studyCard: { gap: theme.spacing.sm },
  riteCard: { gap: theme.spacing.sm },
  retainLine: { marginTop: theme.spacing.xs },
  seal: { fontStyle: 'italic' },
});
