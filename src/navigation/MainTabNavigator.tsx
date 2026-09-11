import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from '../types/navigation';
import HomeScreen from '../screens/home/HomeScreen';
import CaptureScreen from '../screens/capture/CaptureScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, { focused: string; default: string }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Capture: { focused: 'scan', default: 'scan-outline' },
  Reports: { focused: 'pie-chart', default: 'pie-chart-outline' },
  Settings: { focused: 'settings', default: 'settings-outline' },
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceLight,
          height: 88,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Capture" component={CaptureScreen} options={{ tabBarLabel: 'Capturar' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ tabBarLabel: 'Relatórios' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Config' }} />
    </Tab.Navigator>
  );
}
