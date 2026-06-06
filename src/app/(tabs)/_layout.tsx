import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_ORDER } from '@/navigation';
import { theme } from '@/shared/design';

// ─── Per-tab icons (pure View, no native modules) ──────────────────────────

type IconProps = { color: string; size: number };

/** Path — circle compass: the ongoing journey. */
function PathIcon({ color, size }: IconProps) {
  const r = size * 0.43;
  const dot = size * 0.14;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: r * 2, height: r * 2, borderRadius: r, borderWidth: 1.5, borderColor: color }} />
      <View
        style={{
          position: 'absolute',
          width: dot * 2,
          height: dot * 2,
          borderRadius: dot,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/** Forge — upward triangle: fire, action, ascent. */
function ForgeIcon({ color, size }: IconProps) {
  const w = size * 0.72;
  const h = size * 0.64;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w / 2,
          borderRightWidth: w / 2,
          borderBottomWidth: h,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  );
}

/** Journal — lined page: reflection, writing. */
function JournalIcon({ color, size }: IconProps) {
  const w = size * 0.7;
  const h = size * 0.8;
  const pad = size * 0.12;
  const lineGap = (h - pad * 2 - 4.5) / 2; // 3 lines evenly spaced
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 2,
          paddingHorizontal: pad,
          paddingTop: pad,
          gap: lineGap,
          justifyContent: 'flex-start',
        }}
      >
        <View style={{ height: 1.5, backgroundColor: color }} />
        <View style={{ height: 1.5, backgroundColor: color }} />
        <View style={{ height: 1.5, backgroundColor: color, width: '55%' }} />
      </View>
    </View>
  );
}

/** Codex — stacked book spines: the library of wisdom. */
function CodexIcon({ color, size }: IconProps) {
  const widths = [0.78, 0.63, 0.48] as const;
  const bh = size * 0.21;
  const gap = size * 0.09;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}
    >
      {widths.map((w, i) => (
        <View
          key={i}
          style={{ width: size * w, height: bh, borderWidth: 1.5, borderColor: color, borderRadius: 2 }}
        />
      ))}
    </View>
  );
}

/** Progress — ascending bars: practice history, growth. */
function ProgressIcon({ color, size }: IconProps) {
  const heights = [size * 0.35, size * 0.62, size * 0.88] as const;
  const bw = size * 0.22;
  const gap = size * 0.1;
  return (
    <View
      style={{
        width: size,
        height: size,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap,
      }}
    >
      {heights.map((h, i) => (
        <View
          key={i}
          style={{ width: bw, height: h, backgroundColor: color, borderRadius: 1.5 }}
        />
      ))}
    </View>
  );
}

const TAB_ICON_MAP: Record<string, (props: IconProps) => React.JSX.Element> = {
  path: PathIcon,
  forge: ForgeIcon,
  journal: JournalIcon,
  codex: CodexIcon,
  progress: ProgressIcon,
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

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) },
      ]}
    >
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]?.options ?? {};
        const focused = state.index === index;
        const color = focused ? theme.colors.primary : theme.colors.textMuted;
        const label = options.title ?? route.name;
        const IconComponent = TAB_ICON_MAP[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
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
            {IconComponent != null ? (
              <IconComponent color={color} size={22} />
            ) : null}
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
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
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
    fontFamily: theme.typography.family.reading,
  },
});
