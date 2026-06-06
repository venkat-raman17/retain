import { Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_ORDER } from '@/navigation';
import { theme } from '@/shared/design';

/** A small geometric glyph that fills when its tab is active. */
function TabGlyph({ color, focused }: { color: ColorValue; focused: boolean }) {
  return (
    <View
      style={[styles.glyph, { borderColor: color, backgroundColor: focused ? color : 'transparent' }]}
    />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            // Height holds glyph + label with room to breathe; paddingBottom clears
            // the home indicator so descenders (Journal, Progress) never clip.
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom + theme.spacing.md,
            paddingTop: theme.spacing.sm,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {TAB_ORDER.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => <TabGlyph color={color} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
  },
  // lineHeight > fontSize gives descenders their room; marginTop sets a tidy,
  // even gap under the glyph so the label isn't floating near the bottom edge.
  tabLabel: { fontSize: 11, lineHeight: 15, letterSpacing: 0.3, marginTop: 4 },
  tabIcon: { marginTop: 2 },
  tabItem: { paddingVertical: 4 },
  glyph: { width: 18, height: 18, borderRadius: 5, borderWidth: 2 },
});
