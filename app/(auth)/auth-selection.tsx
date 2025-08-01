import { Button } from '@/components/ui/Button';
import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Car, MapPin, Shield } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function AuthSelectionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  // const { } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;



  const handleSignUp = () => {
    router.push('(auth)/signup');
  };

  const handleLogin = () => {
    router.push('(auth)/login');
  };

  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Cityscape illustration */}
        <View style={styles.illustrationContainer}>
          <View style={[styles.cityscape, { backgroundColor: colorScheme.primary }]}>
            <View style={[styles.building, styles.building1, { backgroundColor: colorScheme.primary }]} />
            <View style={[styles.building, styles.building2, { backgroundColor: colorScheme.primary }]} />
            <View style={[styles.building, styles.building3, { backgroundColor: colorScheme.primary }]} />
            <View style={[styles.building, styles.building4, { backgroundColor: colorScheme.primary }]} />
            <View style={[styles.car, { backgroundColor: '#00CED1' }]} />
          </View>
          
          {/* Location pins */}
          <View style={[styles.pin, styles.pin1]}>
            <MapPin size={16} color={colorScheme.primary} />
          </View>
          <View style={[styles.pin, styles.pin2]}>
            <MapPin size={16} color={colorScheme.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colorScheme.text }]}>
          SDM Cab Booking
        </Text>
        
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
          Your city, your ride. Experience seamless transportation with modern convenience.
        </Text>

        <View style={styles.buttonsContainer}>
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            style={[styles.primaryButton, { backgroundColor: colorScheme.primary }]}
            textStyle={{ color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
          />
          
          <Button
            title="Login"
            onPress={handleLogin}
            style={[styles.secondaryButton, { borderColor: colorScheme.border }]}
            textStyle={{ color: colorScheme.text }}
            variant="outline"
          />
        </View>

        {/* Service icons */}
        <View style={styles.servicesContainer}>
          <View style={[styles.serviceIcon, { backgroundColor: colorScheme.card }]}>
            <Car size={20} color={colorScheme.primary} />
          </View>
          <View style={[styles.serviceIcon, { backgroundColor: colorScheme.card }]}>
            <MapPin size={20} color={colorScheme.primary} />
          </View>
          <View style={[styles.serviceIcon, { backgroundColor: colorScheme.card }]}>
            <Shield size={20} color={colorScheme.primary} />
          </View>
        </View>

        <View style={styles.serviceLabels}>
          <Text style={[styles.serviceLabel, { color: colorScheme.subtext }]}>
            Car Booking
          </Text>
          <Text style={[styles.serviceLabel, { color: colorScheme.subtext }]}>
            Live Tracking
          </Text>
          <Text style={[styles.serviceLabel, { color: colorScheme.subtext }]}>
            Safe Rides
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: 200,
    height: 150,
    marginBottom: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityscape: {
    width: 120,
    height: 80,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
  },
  building: {
    position: 'absolute',
    bottom: 0,
    opacity: 0.8,
    borderRadius: 2,
  },
  building1: {
    width: 15,
    height: 35,
    left: 15,
  },
  building2: {
    width: 18,
    height: 50,
    left: 35,
  },
  building3: {
    width: 20,
    height: 40,
    left: 58,
  },
  building4: {
    width: 16,
    height: 55,
    left: 83,
  },
  car: {
    width: 18,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 8,
    right: 20,
  },
  pin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pin1: {
    top: 20,
    left: 40,
  },
  pin2: {
    top: 30,
    right: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 16,
    backgroundColor: '#00CED1',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  serviceLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 16,
    width: 60,
  },
});