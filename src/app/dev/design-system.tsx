import { type ReactNode, useState } from 'react';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppChip,
  AppContentCard,
  AppDivider,
  AppEmptyState,
  AppHeader,
  AppQuoteBlock,
  AppScreen,
  AppSelectList,
  AppStatCard,
  AppText,
  AppTextInput,
  AppTimerRing,
  type TextVariant,
} from '@/shared/components';
import { theme, type ThemeColor } from '@/shared/design';
import { Routes } from '@/navigation';

const TEXT_VARIANTS: readonly TextVariant[] = [
  'display',
  'title',
  'heading',
  'subheading',
  'body',
  'label',
  'caption',
];

const SWATCHES: readonly ThemeColor[] = [
  'primary',
  'accent',
  'calm',
  'support',
  'warning',
  'surfaceRaised',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="caption" color="muted" uppercase>
        {title}
      </AppText>
      {children}
    </View>
  );
}

/**
 * Internal design-system gallery. Development build only — redirects to the Path
 * in production so it never ships as a reachable screen.
 */
export default function DesignSystemRoute() {
  const [vow, setVow] = useState<'pause' | 'fire'>('pause');
  const [note, setNote] = useState('');

  if (!__DEV__) {
    return <Redirect href={Routes.path} />;
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow="Dev"
          eyebrowColor="support"
          title="Design System"
          subtitle="Components, tokens, and states. Development build only."
        />

        <Section title="Type scale">
          {TEXT_VARIANTS.map((variant) => (
            <AppText key={variant} variant={variant}>
              {variant}
            </AppText>
          ))}
        </Section>

        <Section title="Buttons">
          <AppButton label="Primary" />
          <AppButton label="Secondary" variant="secondary" />
          <AppButton label="Ghost" variant="ghost" />
          <AppButton label="Support" variant="support" />
          <AppButton label="Loading" loading />
          <AppButton label="Disabled" disabled />
        </Section>

        <Section title="Cards">
          <AppCard tone="surface">
            <AppText>surface</AppText>
          </AppCard>
          <AppCard tone="raised">
            <AppText>raised</AppText>
          </AppCard>
          <AppCard tone="overlay">
            <AppText>overlay</AppText>
          </AppCard>
        </Section>

        <Section title="Chips">
          <View style={styles.row}>
            <AppChip label="Neutral" />
            <AppChip label="Energy" tone="energy" selected />
            <AppChip label="Accent" tone="accent" selected />
            <AppChip label="Support" tone="support" selected />
          </View>
        </Section>

        <Section title="Stat cards">
          <View style={styles.row}>
            <AppStatCard label="Day" value="7" />
            <AppStatCard label="Best" value="30d" />
          </View>
        </Section>

        <Section title="Quote block">
          <AppQuoteBlock quote="The pause is where manhood begins." attribution="Principle" />
        </Section>

        <Section title="Content card">
          <AppContentCard
            eyebrow="Study"
            title="The Inner Forge"
            body="Transmutation across traditions, as inspiration — not technique."
          />
        </Section>

        <Section title="Text input">
          <AppTextInput label="A note" value={note} onChangeText={setNote} placeholder="Type…" />
        </Section>

        <Section title="Select list">
          <AppSelectList
            options={[
              { value: 'pause', label: 'I pause before I obey.' },
              { value: 'fire', label: 'I do not waste the fire.' },
            ]}
            value={vow}
            onChange={setVow}
          />
        </Section>

        <Section title="Timer ring">
          <View style={styles.center}>
            <AppTimerRing progress={0.66} label="0:40" sublabel="breathe in" />
          </View>
        </Section>

        <Section title="Empty state">
          <AppEmptyState
            title="Nothing here yet"
            message="Your first entry will appear once you write it."
            actionLabel="Add one"
            onAction={() => setNote('added')}
          />
        </Section>

        <AppDivider />

        <Section title="Colors">
          <View style={styles.row}>
            {SWATCHES.map((color) => (
              <View key={color} style={[styles.swatch, { backgroundColor: theme.colors[color] }]} />
            ))}
          </View>
        </Section>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  section: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, alignItems: 'center' },
  center: { alignItems: 'center', paddingVertical: theme.spacing.md },
  swatch: { width: 44, height: 44, borderRadius: theme.radii.md },
});
