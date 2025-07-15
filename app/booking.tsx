import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useRides } from '@/hooks/useRides';
import colors from '@/constants/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { LocationInput } from '@/components/ui/LocationInput';
import { PassengerInput } from '@/components/ui/PassengerInput';
import { Location, TripType, PassengerInfo } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    currentRide, 
    setPickup, 
    setDropoff, 
    setDateTime, 
    setPassengers,
    setTripType,
    setPassengerInfo
  } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [pickup, setPickupLocal] = useState<Location | null>(null);
  const [dropoff, setDropoffLocal] = useState<Location | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengersLocal] = useState(1);
  const [selectedTripType, setSelectedTripType] = useState<TripType>('one-way');
  const [passengerInfo, setPassengerInfoLocal] = useState<PassengerInfo[]>([
    { name: '', age: 0, phone: '' }
  ]);
  
  const handlePickupSelect = (location: Location) => {
    setPickupLocal(location);
  };
  
  const handleDropoffSelect = (location: Location) => {
    setDropoffLocal(location);
  };
  
  const handleDateSelect = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  };
  
  const handleTimeSelect = () => {
    setTime('14:30');
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
      const newCount = passengers + 1;
      setPassengersLocal(newCount);
      
      // Add new passenger info
      const newPassengerInfo = [...passengerInfo];
      while (newPassengerInfo.length < newCount) {
        newPassengerInfo.push({ name: '', age: 0, phone: '' });
      }
      setPassengerInfoLocal(newPassengerInfo);
    }
  };
  
  const handlePassengerDecrease = () => {
    if (passengers > 1) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const newCount = passengers - 1;
      setPassengersLocal(newCount);
      
      // Remove passenger info
      const newPassengerInfo = passengerInfo.slice(0, newCount);
      setPassengerInfoLocal(newPassengerInfo);
    }
  };
  
  const handlePassengerInfoChange = (index: number, info: PassengerInfo) => {
    const newPassengerInfo = [...passengerInfo];
    newPassengerInfo[index] = info;
    setPassengerInfoLocal(newPassengerInfo);
  };
  
  const handleContinue = () => {
    if (!pickup || !dropoff || !date || !time) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setPickup(pickup);
    setDropoff(dropoff);
    setDateTime(date, time);
    setPassengers(passengers);
    setTripType(selectedTripType);
    setPassengerInfo(passengerInfo);
    
    router.push('/cars');
  };
  
  const isFormValid = pickup && dropoff && date && time && 
    passengerInfo.every(p => p.name && p.age > 0 && p.phone);
  
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
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                { borderColor: colorScheme.border }
              ]}
              onPress={handleDateSelect}
            >
              <Calendar size={20} color={colorScheme.primary} />
              <Text style={[styles.dateTimeText, { color: date ? colorScheme.text : colorScheme.subtext }]}>
                {date ? new Date(date).toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                { borderColor: colorScheme.border }
              ]}
              onPress={handleTimeSelect}
            >
              <Clock size={20} color={colorScheme.primary} />
              <Text style={[styles.dateTimeText, { color: time ? colorScheme.text : colorScheme.subtext }]}>
                {time || 'Select Time'}
              </Text>
            </TouchableOpacity>
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
          
          <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>
            Passenger Information
          </Text>
          
          {passengerInfo.map((passenger, index) => (
            <PassengerInput
              key={index}
              index={index}
              passenger={passenger}
              onChange={handlePassengerInfoChange}
            />
          ))}
          
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
        
        <Button
          title="Continue to Select Car"
          onPress={handleContinue}
          disabled={!isFormValid}
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
});