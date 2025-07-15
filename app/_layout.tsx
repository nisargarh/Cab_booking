import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useTheme();
  const { isAuthenticated, selectedRole } = useAuth();
  
  useEffect(() => {
    // Hide splash screen after a delay
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    };
    
    hideSplash();
  }, []);
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme === 'dark' ? colors.dark.background : colors.light.background }
    ]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <RootLayoutNav />
    </View>
  );
}

function RootLayoutNav() {
  const { theme } = useTheme();
  const { isAuthenticated, selectedRole } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        headerTintColor: colorScheme.text,
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: {
          backgroundColor: colorScheme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Shop My Trips',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)/login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(rider-tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(driver-tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});