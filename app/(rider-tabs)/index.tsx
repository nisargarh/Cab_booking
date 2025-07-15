import { BookingCard } from '@/components/rider/BookingCard';
import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
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
  );
}

const styles = StyleSheet.create({
  container: {
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