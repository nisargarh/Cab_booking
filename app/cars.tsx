import { CarCard } from '@/components/rider/CarCard';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useRides } from '@/hooks/useRides';
import { useTheme } from '@/hooks/useTheme';
import { vehicles } from '@/mocks/vehicles';
import { Vehicle } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CarSelectionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentRide, setVehicle } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const handleVehicleSelect = (vehicle: Vehicle) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedVehicle(vehicle);
  };
  
  const handleContinue = () => {
    if (!selectedVehicle) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setVehicle(selectedVehicle);
    router.push('/payment');
  };
  
  if (!currentRide) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <Text style={[styles.errorText, { color: colorScheme.text }]}>
          Please complete booking details first
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }
  
  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: 'Select Car',
          headerBackTitle: 'Back',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: colorScheme.text }]}>
            Trip Summary
          </Text>
          
          <View style={styles.summaryItem}>
            <MapPin size={16} color={colorScheme.success} />
            <Text style={[styles.summaryText, { color: colorScheme.text }]}>
              {currentRide.pickup?.name || 'Pickup Location'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <MapPin size={16} color={colorScheme.error} />
            <Text style={[styles.summaryText, { color: colorScheme.text }]}>
              {currentRide.dropoff?.name || 'Destination'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Calendar size={16} color={colorScheme.primary} />
              <Text style={[styles.summaryText, { color: colorScheme.text }]}>
                {currentRide.date ? new Date(currentRide.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                }) : 'Today'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Clock size={16} color={colorScheme.primary} />
              <Text style={[styles.summaryText, { color: colorScheme.text }]}>
                {currentRide.time || 'Now'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Users size={16} color={colorScheme.primary} />
              <Text style={[styles.summaryText, { color: colorScheme.text }]}>
                {currentRide.passengers || 1} {(currentRide.passengers || 1) === 1 ? 'person' : 'people'}
              </Text>
            </View>
          </View>
        </GlassCard>
        
        <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>
          Available Cars
        </Text>
        
        <View style={styles.carsContainer}>
          {vehicles.map((vehicle) => (
            <CarCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={handleVehicleSelect}
              isSelected={selectedVehicle?.id === vehicle.id}
            />
          ))}
        </View>
        
        {selectedVehicle && (
          <GlassCard 
            style={styles.fareCard}
            tint="accent"
          >
            <Text style={[styles.fareTitle, { color: colorScheme.text }]}>
              Fare Details
            </Text>
            
            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, { color: colorScheme.text }]}>
                Base Fare
              </Text>
              <Text style={[styles.fareValue, { color: colorScheme.text }]}>
                ${selectedVehicle.price.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, { color: colorScheme.text }]}>
                Taxes & Fees
              </Text>
              <Text style={[styles.fareValue, { color: colorScheme.text }]}>
                ${(selectedVehicle.price * 0.1).toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
            
            <View style={styles.fareRow}>
              <Text style={[styles.totalLabel, { color: colorScheme.text }]}>
                Total Fare
              </Text>
              <Text style={[styles.totalValue, { color: colorScheme.text }]}>
                ${(selectedVehicle.price * 1.1).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.advanceContainer}>
              <Text style={[styles.advanceText, { color: colorScheme.text }]}>
                Pay only 25% (${(selectedVehicle.price * 1.1 * 0.25).toFixed(2)}) now to confirm booking
              </Text>
            </View>
          </GlassCard>
        )}
        
        <Button
          title="Continue to Payment"
          onPress={handleContinue}
          disabled={!selectedVehicle}
          style={styles.continueButton}
        />
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
  summaryCard: {
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    marginLeft: 8,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  carsContainer: {
    marginBottom: 24,
  },
  fareCard: {
    padding: 16,
    marginBottom: 24,
  },
  fareTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  advanceContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
  },
  advanceText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  continueButton: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
    alignSelf: 'center',
  },
});