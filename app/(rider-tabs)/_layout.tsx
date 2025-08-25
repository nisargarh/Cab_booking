import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { Tabs } from 'expo-router';
import { Clock, HelpCircle, Home, User } from 'lucide-react-native';
import React from 'react';

export default function RiderTabLayout() {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme.primary,
        tabBarInactiveTintColor: colorScheme.subtext,
        tabBarStyle: {
          backgroundColor: colorScheme.background,
          borderTopColor: colorScheme.border,
        },
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        headerTintColor: colorScheme.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="faq"
        options={{
          title: 'FAQ',
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <HelpCircle size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}