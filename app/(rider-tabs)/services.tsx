import { BookingCard } from '@/components/rider/BookingCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { DrawerMenu } from '@/components/ui/DrawerMenu';
import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ServicesScreen() {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDrawerVisible(true);
  };
  
  return (
    <>
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <AppHeader 
          title="Services" 
          onMenuPress={handleMenuPress}
        />
        
        <LinearGradient
          colors={[
            theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
            theme === 'dark' ? '#121212' : '#ffffff',
          ]}
          style={styles.gradientContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.title, { color: colorScheme.text }]}>
              Book Your Ride
            </Text>
            
            <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
              Choose your ride type
            </Text>
            
            <View style={styles.bookingTypesContainer}>
              <BookingCard
                type="city"
                title="City Ride"
                description="Travel within the city with comfort and convenience"
              />
              
              <BookingCard
                type="airport"
                title="Airport Taxi"
                description="Hassle-free airport transfers with fixed prices"
              />
              
              <BookingCard
                type="outstation"
                title="Outstation"
                description="Travel between cities with reliable drivers"
              />
              
              <BookingCard
                type="hourly"
                title="Hourly Rental"
                description="Rent a car with driver by the hour for multiple stops"
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>

      <DrawerMenu 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
  },
  bookingTypesContainer: {
    marginBottom: 16,
  },
});