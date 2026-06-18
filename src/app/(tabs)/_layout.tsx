import { Tabs } from 'expo-router';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_ORDER } from '@/navigation';
import {
  EmberSigil,
  GateSigil,
  MirrorSigil,
  PillarsSigil,
} from '@/shared/components/symbols';
import { fontFamilyFor, theme } from '@/shared/design';
import { haptics } from '@/shared/lib';
import { useTheme } from '@/shared/hooks/use-theme';

// ─── Per-tab sigils ─────────────────────────────────────────────────────────
// SVG sigils in the app's symbolic language: monoline, iron + ember, carved.
// Path = gate to cross each day. Forge = ember diamond.
// Codex = archive pillars. Hall (progress) = hand mirror; the day's trials and
// honors live together here.

const ICON_SIZE = 22;

type IconProps = { color: string; size: number };

const TAB_ICON_MAP: Record<string, (props: IconProps) => ReactElement> = {
  path: ({ color }) => <GateSigil size={ICON_SIZE} color={color} />,
  forge: ({ color }) => <EmberSigil size={ICON_SIZE} color={color} />,
  codex: ({ color }) => <PillarsSigil size={ICON_SIZE} color={color} />,
  progress: ({ color }) => <MirrorSigil size={ICON_SIZE} color={color} />,
};

// ─── Custom tab bar ─────────────────────────────────────────────────────────

type TabRoute = { key: string; name: string };

type TabBarProps = {
  state: { routes: TabRoute[]; index: number };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: {
    emit: (e: { type: string; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]?.options ?? {};
        const focused = state.index === index;
        const color = focused ? colors.primary : colors.textMuted;
        const label = options.title ?? route.name;
        const IconComponent = TAB_ICON_MAP[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            haptics.selection();
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            {IconComponent != null ? <IconComponent color={color} size={22} /> : null}
            <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Layout ─────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTabBar
          state={props.state}
          descriptors={props.descriptors}
          navigation={props.navigation as TabBarProps['navigation']}
        />
      )}
    >
      {TAB_ORDER.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  tabLabel: {
    fontSize: theme.typography.size.caption,
    letterSpacing: 0.3,
    fontFamily: fontFamilyFor('reading', 'medium'),
  },
});
