/**
 * Tab Layout — Premium animated bottom navigation.
 */
import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Animated, Platform } from 'react-native';

const DARK_SURFACE = '#141218';
const DARK_SURFACE_CONTAINER = '#211F26';
const PRIMARY_LIGHT = '#D0BCFF';
const ON_SURFACE_VARIANT = '#C4C7C5';
const SAGE_GREEN = '#ACC7A6';

// Animated Tab Icon Component
function TabIcon({ focused, name, activeColor, inactiveColor = ON_SURFACE_VARIANT }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  // Interpolate scale for the background pill
  const scaleX = scale.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const opacity = scale.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  // Icon bounce
  const iconScale = scale.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.activePill,
          {
            backgroundColor: activeColor + '30', // 20% opacity using hex
            transform: [{ scaleX }, { scaleY: scaleX }],
            opacity,
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        <MaterialCommunityIcons
          name={name}
          size={24}
          color={focused ? activeColor : inactiveColor}
        />
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true, // Show labels for accessibility/clarity
        tabBarActiveTintColor: SAGE_GREEN,
        tabBarInactiveTintColor: ON_SURFACE_VARIANT,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name={focused ? 'home' : 'home-outline'} activeColor={SAGE_GREEN} />
          ),
          tabBarActiveTintColor: SAGE_GREEN,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="chart-bar" activeColor="#aabcff" />
          ),
          tabBarActiveTintColor: '#aabcff',
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Routine',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name={focused ? 'calendar-text' : 'calendar-text-outline'} activeColor={PRIMARY_LIGHT} />
          ),
          tabBarActiveTintColor: PRIMARY_LIGHT,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name={focused ? 'cog' : 'cog-outline'} activeColor={PRIMARY_LIGHT} />
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
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 8,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  iconContainer: {
    width: 64,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    width: 48,
    height: 32,
    borderRadius: 16,
  },
});
