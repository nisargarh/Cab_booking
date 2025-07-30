import { Button } from '@/components/ui/Button';
import { CustomDateTimePicker } from '@/components/ui/DateTimePicker';
import { GlassCard } from '@/components/ui/GlassCard';
import { LocationInput } from '@/components/ui/LocationInput';
import colors from '@/constants/colors';
import { useRides } from '@/hooks/useRides';
import { useTheme } from '@/hooks/useTheme';
import { Location, TripType } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    currentRide, 
    setPickup, 
    setDropoff, 
    setDateTime, 
    setPassengers,
    setTripType
  } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [pickup, setPickupLocal] = useState<Location | null>(null);
  const [dropoff, setDropoffLocal] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [passengers, setPassengersLocal] = useState(1);
  const [selectedTripType, setSelectedTripType] = useState<TripType>('one-way');
  
  const handlePickupSelect = (location: Location) => {
    setPickupLocal(location);
  };
  
  const handleDropoffSelect = (location: Location) => {
    setDropoffLocal(location);
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
  };
  
  const handleTripTypeSelect = (type: TripType) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTripType(type);
  };
  
  const handlePassengerIncrease = () => {
    if (passengers < 10) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setPassengersLocal(passengers + 1);
    }
  };
  
  const handlePassengerDecrease = () => {
    if (passengers > 1) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setPassengersLocal(passengers - 1);
    }
  };
  

  
  const handleContinue = () => {
    // Use defaults if fields are missing
    const finalPickup = pickup || {
      id: '1',
      name: 'Default Pickup',
      address: 'Default pickup location',
      latitude: 37.7749,
      longitude: -122.4194,
    };
    
    const finalDropoff = dropoff || {
      id: '2',
      name: 'Default Destination',
      address: 'Default destination',
      latitude: 37.7849,
      longitude: -122.4094,
    };
    
    const finalDate = selectedDate || new Date();
    const finalTime = selectedTime || new Date();
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Format date and time for storage
    const dateString = finalDate.toISOString().split('T')[0];
    const timeString = finalTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setPickup(finalPickup);
    setDropoff(finalDropoff);
    setDateTime(dateString, timeString);
    setPassengers(passengers);
    setTripType(selectedTripType);
    
    router.push('/cars');
  };
  
  const isFormValid = pickup && dropoff && selectedDate && selectedTime;
  
  const getBookingTypeTitle = () => {
    switch (currentRide?.bookingType) {
      case 'airport':
        return 'Airport Transfer';
      case 'outstation':
        return 'Outstation Trip';
      case 'hourly':
        return 'Hourly Rental';
      case 'city':
      default:
        return 'City Ride';
    }
  };
  
  const getPickupPlaceholder = () => {
    switch (currentRide?.bookingType) {
      case 'airport':
        return 'Enter pickup location or select airport';
      case 'outstation':
        return 'Enter departure city';
      case 'hourly':
        return 'Enter starting location';
      case 'city':
      default:
        return 'Enter pickup location';
    }
  };
  
  const getDropoffPlaceholder = () => {
    switch (currentRide?.bookingType) {
      case 'airport':
        return 'Enter destination or select airport';
      case 'outstation':
        return 'Enter destination city';
      case 'hourly':
        return 'Enter first stop (optional)';
      case 'city':
      default:
        return 'Enter destination';
    }
  };
  
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
          title: getBookingTypeTitle(),
          headerBackTitle: 'Back',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
            Trip Details
          </Text>
          
          <View style={styles.locationContainer}>
            <LocationInput
              placeholder={getPickupPlaceholder()}
              value={pickup}
              onSelect={handlePickupSelect}
              label="Pickup Location"
            />
            
            <LocationInput
              placeholder={getDropoffPlaceholder()}
              value={dropoff}
              onSelect={handleDropoffSelect}
              label={currentRide?.bookingType === 'hourly' ? 'First Stop (Optional)' : 'Destination'}
            />
          </View>
          
          <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>
            Trip Type
          </Text>
          
          <View style={styles.tripTypesContainer}>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                { 
                  borderColor: selectedTripType === 'one-way' ? colorScheme.primary : colorScheme.border,
                  backgroundColor: selectedTripType === 'one-way' ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                }
              ]}
              onPress={() => handleTripTypeSelect('one-way')}
            >
              <Text style={[
                styles.tripTypeText, 
                { color: selectedTripType === 'one-way' ? colorScheme.primary : colorScheme.text }
              ]}>
                One-way
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                { 
                  borderColor: selectedTripType === 'round-trip' ? colorScheme.primary : colorScheme.border,
                  backgroundColor: selectedTripType === 'round-trip' ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                }
              ]}
              onPress={() => handleTripTypeSelect('round-trip')}
            >
              <Text style={[
                styles.tripTypeText, 
                { color: selectedTripType === 'round-trip' ? colorScheme.primary : colorScheme.text }
              ]}>
                Round Trip
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                { 
                  borderColor: selectedTripType === 'shared' ? colorScheme.primary : colorScheme.border,
                  backgroundColor: selectedTripType === 'shared' ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                }
              ]}
              onPress={() => handleTripTypeSelect('shared')}
            >
              <Text style={[
                styles.tripTypeText, 
                { color: selectedTripType === 'shared' ? colorScheme.primary : colorScheme.text }
              ]}>
                Shared
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <CustomDateTimePicker
              date={selectedDate || undefined}
              onDateChange={handleDateSelect}
              mode="date"
              placeholder="Select Date"
              minimumDate={new Date()}
            />
            
            <CustomDateTimePicker
              date={selectedTime || undefined}
              onDateChange={handleTimeSelect}
              mode="time"
              placeholder="Select Time"
            />
          </View>
          
          <View style={styles.passengersContainer}>
            <Text style={[styles.passengersLabel, { color: colorScheme.text }]}>
              Number of Passengers
            </Text>
            
            <View style={styles.passengersControls}>
              <TouchableOpacity
                style={[
                  styles.passengerButton,
                  { borderColor: colorScheme.border }
                ]}
                onPress={handlePassengerDecrease}
                disabled={passengers <= 1}
              >
                <Text style={[
                  styles.passengerButtonText, 
                  { 
                    color: passengers <= 1 ? colorScheme.subtext : colorScheme.text 
                  }
                ]}>
                  -
                </Text>
              </TouchableOpacity>
              
              <View style={styles.passengerCountContainer}>
                <Users size={16} color={colorScheme.primary} />
                <Text style={[styles.passengerCount, { color: colorScheme.text }]}>
                  {passengers}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.passengerButton,
                  { borderColor: colorScheme.border }
                ]}
                onPress={handlePassengerIncrease}
                disabled={passengers >= 10}
              >
                <Text style={[
                  styles.passengerButtonText, 
                  { 
                    color: passengers >= 10 ? colorScheme.subtext : colorScheme.text 
                  }
                ]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          

          
          {currentRide?.bookingType === 'hourly' && (
            <GlassCard style={styles.infoCard}>
              <Text style={[styles.infoTitle, { color: colorScheme.text }]}>
                Hourly Rental Information
              </Text>
              <Text style={[styles.infoText, { color: colorScheme.subtext }]}>
                • Minimum 4 hours booking
              </Text>
              <Text style={[styles.infoText, { color: colorScheme.subtext }]}>
                • Multiple stops allowed
              </Text>
              <Text style={[styles.infoText, { color: colorScheme.subtext }]}>
                • Driver will wait at each location
              </Text>
            </GlassCard>
          )}
          
          {currentRide?.bookingType === 'outstation' && (
            <GlassCard style={styles.infoCard}>
              <Text style={[styles.infoTitle, { color: colorScheme.text }]}>
                Outstation Trip Information
              </Text>
              <Text style={[styles.infoText, { color: colorScheme.subtext }]}>
                • Long distance travel between cities
              </Text>
              <Text style={[styles.infoText, { color: colorScheme.subtext }]}>
                • Driver accommodation included for overnight trips
              </Text>
              <Text style={[styles.infoText, { color: colorScheme.subtext }]}>
                • Toll charges applicable
              </Text>
            </GlassCard>
          )}
        </GlassCard>
        
        {/* Debug info */}
        <View style={styles.debugContainer}>
          <Text style={[styles.debugText, { color: colorScheme.subtext }]}>
            Form Status: {pickup ? '✓' : '✗'} Pickup | {dropoff ? '✓' : '✗'} Dropoff | {selectedDate ? '✓' : '✗'} Date | {selectedTime ? '✓' : '✗'} Time
          </Text>
        </View>

        <Button
          title="Continue to Select Car"
          onPress={handleContinue}
          disabled={false}
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
  card: {
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  locationContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tripTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  tripTypeButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  passengersContainer: {
    marginBottom: 24,
  },
  passengersLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  passengersControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  passengerCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  passengerCount: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  continueButton: {
    marginTop: 8,
  },
  debugContainer: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
  },
});