import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Car } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

export default function LandingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  // Auto redirect after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('(auth)/auth-selection');
    }, 6000);
    return () => clearTimeout(timer);
  }, [router]);

  // Redirect on horizontal swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 20) {
          router.replace('(auth)/auth-selection');
        }
      },
    })
  ).current;

  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#121212' : '#ffffff',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        {/* Green icon in soft circle */}
        <View style={[styles.iconCircle, { backgroundColor: theme === 'dark' ? 'rgba(0,255,127,0.1)' : 'rgba(16,185,129,0.12)' }]}> 
          <Car size={48} color={colorScheme.primary} />
        </View>

        {/* Title & subtitle */}
        <Text style={[styles.title, { color: colorScheme.text }]}>SDM Cab Booking</Text>
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>Your Ride, Your Way</Text>

        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { backgroundColor: colorScheme.primary }]} />
          <View style={[styles.dot, { backgroundColor: colorScheme.primary, opacity: 0.9 }]} />
          <View style={[styles.dot, { backgroundColor: colorScheme.primary, opacity: 0.9 }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});