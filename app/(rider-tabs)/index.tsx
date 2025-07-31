import { AppHeader } from '@/components/ui/AppHeader';
import { DrawerMenu } from '@/components/ui/DrawerMenu';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    Car,
    Clock,
    CreditCard,
    MapPin,
    Plane,
    Share2,
    Shield
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDrawerVisible(true);
  };

  const handleServicePress = (service: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(rider-tabs)/services');
  };

  const ServiceIcon = ({ 
    icon, 
    title, 
    onPress 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity style={styles.serviceIcon} onPress={onPress}>
      <View style={[styles.serviceIconContainer, { backgroundColor: colorScheme.background }]}>
        {icon}
      </View>
      <Text style={[styles.serviceTitle, { color: colorScheme.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <AppHeader 
          title="SDM" 
          onMenuPress={handleMenuPress}
        />

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Heading Suggestion */}
          <View style={styles.headingSection}>
            <Text style={[styles.title, { color: colorScheme.text }]}>
              Where would you like to go?
            </Text>
            <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
              Choose from our available services
            </Text>
          </View>

          {/* Service Icons */}
          <View style={styles.servicesContainer}>
            <View style={styles.servicesRow}>
              <ServiceIcon
                icon={<Plane size={24} color={colorScheme.primary} />}
                title="Airport"
                onPress={() => handleServicePress('airport')}
              />
              <ServiceIcon
                icon={<Car size={24} color={colorScheme.primary} />}
                title="City Ride"
                onPress={() => handleServicePress('city')}
              />
              <ServiceIcon
                icon={<Clock size={24} color={colorScheme.primary} />}
                title="Hourly"
                onPress={() => handleServicePress('hourly')}
              />
            </View>
            <View style={styles.servicesRow}>
              <ServiceIcon
                icon={<MapPin size={24} color={colorScheme.primary} />}
                title="Outstation"
                onPress={() => handleServicePress('outstation')}
              />
              <ServiceIcon
                icon={<Share2 size={24} color={colorScheme.primary} />}
                title="Shared"
                onPress={() => handleServicePress('shared')}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colorScheme.primary }]}
              onPress={() => router.push('/(rider-tabs)/services')}
            >
              <Text style={[styles.actionButtonText, { color: colorScheme.background }]}>
                Schedule Ride
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colorScheme.success }]}
              onPress={() => router.push('/offers')}
            >
              <Text style={[styles.actionButtonText, { color: colorScheme.background }]}>
                Offers
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map Placeholder */}
          <GlassCard style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              <MapPin size={40} color={colorScheme.primary} />
              <Text style={[styles.mapText, { color: colorScheme.text }]}>
                Map View
              </Text>
              <Text style={[styles.mapSubtext, { color: colorScheme.subtext }]}>
                Track your rides in real-time
              </Text>
            </View>
          </GlassCard>

          {/* Safety First Section */}
          <GlassCard style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={[styles.featureIcon, { backgroundColor: colorScheme.error + '20' }]}>
                <Shield size={24} color={colorScheme.error} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colorScheme.text }]}>
                  Safety first
                </Text>
                <Text style={[styles.featureDescription, { color: colorScheme.subtext }]}>
                  With safety features and 24/7 help ensure safety for everyone.
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Flexible Payments Section */}
          <GlassCard style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={[styles.featureIcon, { backgroundColor: colorScheme.success + '20' }]}>
                <CreditCard size={24} color={colorScheme.success} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colorScheme.text }]}>
                  Flexible payments
                </Text>
                <Text style={[styles.featureDescription, { color: colorScheme.subtext }]}>
                  Multiple payment options for your convenience.
                </Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  headingSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  servicesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  serviceIcon: {
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 40,
  },
  mapPlaceholder: {
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  featureCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});