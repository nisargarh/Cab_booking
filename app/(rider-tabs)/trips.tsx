import { AppHeader } from '@/components/ui/AppHeader';
import { DrawerMenu } from '@/components/ui/DrawerMenu';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useRides } from '@/hooks/useRides';
import { useTheme } from '@/hooks/useTheme';
import { Ride } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Clock, MapPin, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TripsScreen() {
  const { theme } = useTheme();
  const { pastRides } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('completed');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDrawerVisible(true);
  };
  
  // Mock data for demonstration
  const mockRides: Ride[] = [
    {
      id: '1',
      riderId: 'rider1',
      driverId: 'driver1',
      bookingType: 'airport',
      tripType: 'one-way',
      pickup: {
        id: '1',
        name: 'Home',
        address: '123 Main St, City',
        latitude: 37.7749,
        longitude: -122.4194,
      },
      dropoff: {
        id: '2',
        name: 'Airport',
        address: 'International Airport',
        latitude: 37.6213,
        longitude: -122.3790,
      },
      date: '2025-07-08',
      time: '14:30',
      passengers: 2,
      passengerInfo: [
        {
          name: 'John Doe',
          age: 30,
          phone: '555-1234',
        }
      ],
      status: 'completed',
      fare: {
        base: 45,
        distance: 18.5,
        time: 30,
        surge: 0,
        tax: 4.5,
        total: 49.5,
        advancePayment: 12.38,
        remainingPayment: 37.12,
      },
      paymentMethod: 'card',
      paymentStatus: 'completed',
      distance: 18.5,
      duration: 30,
      rating: 4.8,
      review: "Great service, very punctual!",
    },
    {
      id: '2',
      riderId: 'rider1',
      bookingType: 'city',
      tripType: 'one-way',
      pickup: {
        id: '3',
        name: 'Work',
        address: '456 Market St, City',
        latitude: 37.7899,
        longitude: -122.4034,
      },
      dropoff: {
        id: '4',
        name: 'Mall',
        address: 'Shopping Center, Downtown',
        latitude: 37.7833,
        longitude: -122.4167,
      },
      date: '2025-07-07',
      time: '16:45',
      passengers: 1,
      passengerInfo: [
        {
          name: 'Jane Smith',
          age: 28,
          phone: '555-5678',
        }
      ],
      status: 'completed',
      fare: {
        base: 25,
        distance: 8.2,
        time: 15,
        surge: 0,
        tax: 2.5,
        total: 27.5,
        advancePayment: 6.88,
        remainingPayment: 20.62,
      },
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      distance: 8.2,
      duration: 15,
      rating: 4.5,
    },
  ];
  
  const renderTripCard = (ride: Ride) => (
    <TouchableOpacity style={styles.tripCardContainer}>
      <GlassCard style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <View style={styles.tripTypeContainer}>
            <Text style={[styles.tripType, { color: colorScheme.primary }]}>
              {ride.bookingType.toUpperCase()}
            </Text>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: ride.status === 'completed' 
                  ? colorScheme.success 
                  : colorScheme.warning 
              }
            ]}>
              <Text style={styles.statusText}>
                {ride.status === 'completed' ? 'Completed' : 'Upcoming'}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.tripDate, { color: colorScheme.subtext }]}>
            {ride.date} • {ride.time}
          </Text>
        </View>
        
        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <MapPin size={16} color={colorScheme.success} />
            <Text style={[styles.locationText, { color: colorScheme.text }]}>
              {ride.pickup.name}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
          
          <View style={styles.locationItem}>
            <MapPin size={16} color={colorScheme.error} />
            <Text style={[styles.locationText, { color: colorScheme.text }]}>
              {ride.dropoff.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.tripFooter}>
          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <Clock size={14} color={colorScheme.subtext} />
              <Text style={[styles.detailText, { color: colorScheme.subtext }]}>
                {ride.duration} min
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.fareText, { color: colorScheme.text }]}>
                ${ride.fare.total.toFixed(2)}
              </Text>
            </View>
            
            {ride.rating && (
              <View style={styles.detailItem}>
                <Star size={14} color={colorScheme.warning} fill={colorScheme.warning} />
                <Text style={[styles.detailText, { color: colorScheme.text }]}>
                  {ride.rating}
                </Text>
              </View>
            )}
          </View>
          
          <ChevronRight size={20} color={colorScheme.subtext} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
  
  return (
    <>
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <AppHeader 
          title="My Trips" 
          onMenuPress={handleMenuPress}
        />
        
        <LinearGradient
          colors={[
            theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
            theme === 'dark' ? '#121212' : '#ffffff',
          ]}
          style={styles.gradientContainer}
        >
          <View style={styles.tabsSection}>
            <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && { backgroundColor: colorScheme.primary }
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[
              styles.tabText,
              { 
                color: activeTab === 'completed' 
                  ? (theme === 'dark' ? colors.dark.background : colors.light.background)
                  : colorScheme.text 
              }
            ]}>
              Completed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && { backgroundColor: colorScheme.primary }
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[
              styles.tabText,
              { 
                color: activeTab === 'upcoming' 
                  ? (theme === 'dark' ? colors.dark.background : colors.light.background)
                  : colorScheme.text 
              }
            ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
            </View>
          </View>
      
      <FlatList
        data={activeTab === 'completed' 
          ? mockRides.filter(ride => ride.status === 'completed')
          : mockRides.filter(ride => ride.status !== 'completed')
        }
        renderItem={({ item }) => renderTripCard(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <GlassCard style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colorScheme.text }]}>
              {activeTab === 'completed' ? 'No completed trips' : 'No upcoming trips'}
            </Text>
            <Text style={[styles.emptyText, { color: colorScheme.subtext }]}>
              {activeTab === 'completed' 
                ? 'Your completed trips will appear here'
                : 'Book a ride to see your upcoming trips'
              }
            </Text>
          </GlassCard>
        )}
          />
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
  tabsSection: {
    padding: 20,
    paddingBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  tripCardContainer: {
    marginBottom: 16,
  },
  tripCard: {
    padding: 16,
  },
  tripHeader: {
    marginBottom: 16,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripType: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  tripDate: {
    fontSize: 14,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    marginLeft: 24,
    marginVertical: 4,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
  },
  fareText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});