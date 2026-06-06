import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TAB_ORDER } from '@/navigation';
import { theme } from '@/shared/design';

/** A small geometric glyph that fills when its tab is active. */
function TabGlyph({ color, focused }: { color: string; focused: boolean }) {
  return (
    <View
      style={[styles.glyph, { borderColor: color, backgroundColor: focused ? color : 'transparent' }]}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
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
  tabLabel: { fontSize: theme.typography.size.caption },
  glyph: { width: 16, height: 16, borderRadius: 5, borderWidth: 2 },
});
