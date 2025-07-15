import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { UserRole } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Car, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setSelectedRole } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Animation values
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const cardsTranslateY = useSharedValue(50);
  
  useEffect(() => {
    // Animate elements on mount
    logoScale.value = withSpring(1, { damping: 10 });
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    cardsOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    cardsTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });
  
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });
  
  const cardsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardsOpacity.value,
      transform: [{ translateY: cardsTranslateY.value }],
    };
  });
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    router.push('(auth)/login');
  };
  
  // Use simpler animations for web
  if (Platform.OS === 'web') {
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
          <View style={styles.logoContainer}>
            <Text style={[styles.logo, { color: colorScheme.primary }]}>
              SMT
            </Text>
          </View>
          
          <Text style={[styles.title, { color: colorScheme.text }]}>
            Shop My Trips
          </Text>
          <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
            Choose your role to continue
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
                <Text style={[styles.roleDescription, { color: colorScheme.subtext }]}>
                  Book rides and travel with comfort
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
                <Text style={[styles.roleDescription, { color: colorScheme.subtext }]}>
                  Accept ride requests and earn
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Text style={[styles.logo, { color: colorScheme.primary }]}>
            SMT
          </Text>
        </Animated.View>
        
        <Animated.View style={titleAnimatedStyle}>
          <Text style={[styles.title, { color: colorScheme.text }]}>
            Shop My Trips
          </Text>
          <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
            Choose your role to continue
          </Text>
        </Animated.View>
        
        <Animated.View style={[styles.cardsContainer, cardsAnimatedStyle]}>
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
              <Text style={[styles.roleDescription, { color: colorScheme.subtext }]}>
                Book rides and travel with comfort
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
              <Text style={[styles.roleDescription, { color: colorScheme.subtext }]}>
                Accept ride requests and earn
              </Text>
            </GlassCard>
          </TouchableOpacity>
        </Animated.View>
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
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
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
    maxWidth: 500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '48%',
    minWidth: 150,
  },
  roleCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 0.8,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});