/**
 * Tab Layout — Bottom navigation bar.
 * 4 tabs: Home, Stats (Analytics), Routine (Editor), Settings.
 * Matches the M3 bottom navigation design from the prototypes.
 */
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

const DARK_SURFACE = '#141218';
const DARK_SURFACE_CONTAINER = '#211F26';
const PRIMARY_LIGHT = '#D0BCFF';
const PRIMARY_CONTAINER = '#4F378B';
const ON_SURFACE_VARIANT = '#C4C7C5';
const SAGE_GREEN = '#ACC7A6';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: PRIMARY_LIGHT,
        tabBarInactiveTintColor: ON_SURFACE_VARIANT,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={focused ? SAGE_GREEN : ON_SURFACE_VARIANT}
              />
            </View>
          ),
          tabBarActiveTintColor: SAGE_GREEN,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActiveIndigo]}>
              <MaterialCommunityIcons
                name={focused ? 'chart-bar' : 'chart-bar'}
                size={24}
                color={focused ? '#aabcff' : ON_SURFACE_VARIANT}
              />
            </View>
          ),
          tabBarActiveTintColor: '#aabcff',
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Routine',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActivePurple]}>
              <MaterialCommunityIcons
                name={focused ? 'calendar-text' : 'calendar-text-outline'}
                size={24}
                color={focused ? PRIMARY_LIGHT : ON_SURFACE_VARIANT}
              />
            </View>
          ),
          tabBarActiveTintColor: PRIMARY_LIGHT,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActivePurple]}>
              <MaterialCommunityIcons
                name={focused ? 'cog' : 'cog-outline'}
                size={24}
                color={focused ? PRIMARY_LIGHT : ON_SURFACE_VARIANT}
              />
            </View>
          ),
          tabBarActiveTintColor: PRIMARY_LIGHT,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: DARK_SURFACE_CONTAINER,
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  tabItem: {
    gap: 2,
  },
  iconWrap: {
    width: 64,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(172,199,166,0.2)',
  },
  iconWrapActiveIndigo: {
    backgroundColor: 'rgba(79,99,172,0.3)',
  },
  iconWrapActivePurple: {
    backgroundColor: 'rgba(232,222,248,0.15)',
  },
});
