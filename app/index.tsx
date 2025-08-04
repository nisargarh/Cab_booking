import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { UserRole } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Car, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setSelectedRole } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    router.push('(auth)/auth-selection');
  };

  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
    >
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          SDM Cab Booking
        </Text>
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
          Your city, your ride. Experience seamless transportation with modern convenience.
        </Text>
        
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handleRoleSelect('rider')}
            activeOpacity={0.9}
          >
            <GlassCard style={styles.roleCard}>
              <User size={40} color={colorScheme.primary} />
              <Text style={[styles.roleTitle, { color: colorScheme.text }]}>
                Rider
              </Text>
            </GlassCard>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handleRoleSelect('driver')}
            activeOpacity={0.9}
          >
            <GlassCard style={styles.roleCard}>
              <Car size={40} color={colorScheme.primary} />
              <Text style={[styles.roleTitle, { color: colorScheme.text }]}>
                Driver
              </Text>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12, // Small gap between rider and driver cards
  },
  cardWrapper: {
    flex: 1, // Equal width for both cards
    maxWidth: 180, // Prevent cards from getting too wide
  },
  roleCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1, // Make cards square
    borderRadius: 20,
    minHeight: 160,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
});