import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import ExploreHubScreen from '../screens/explore/ExploreHubScreen';
import MapScreen from '../screens/MapScreen';
import { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Learn"
        component={MapScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>{'🗺️'}</Text>,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreHubScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>{'🧭'}</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
