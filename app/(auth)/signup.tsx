import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { UserRole } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedRole, setUser } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSignUp = () => {
    if (!agreeToTerms) {
      // Show error message
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      // Create mock user
      const user = {
        id: '123',
        name: 'John Doe',
        phone: '1234567890',
        email: email || 'user@example.com',
        role: selectedRole as UserRole,
      };
      
      setUser(user);
      
      // Navigate directly to appropriate dashboard
      if (selectedRole === 'rider') {
        router.replace('(rider-tabs)');
      } else {
        router.replace('(driver-tabs)');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleLoginRedirect = () => {
    router.push('(auth)/login');
  };

  const handleGoogleSignUp = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    // Simulate Google signup
    setTimeout(() => {
      const user = {
        id: '123',
        name: 'John Doe',
        phone: '1234567890',
        email: 'user@gmail.com',
        role: selectedRole as UserRole,
      };
      
      setUser(user);
      
      // Navigate directly to appropriate dashboard
      if (selectedRole === 'rider') {
        router.replace('(rider-tabs)');
      } else {
        router.replace('(driver-tabs)');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colorScheme.primary} />
            </TouchableOpacity>
            
            <ThemeToggle />
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, { color: colorScheme.text }]}>
              Sign up
            </Text>
            
            <View style={styles.loginRedirect}>
              <Text style={[styles.loginText, { color: colorScheme.subtext }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={[styles.loginLink, { color: colorScheme.primary }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            
            <GlassCard style={styles.formCard}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={colorScheme.primary} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: colorScheme.text,
                      borderColor: colorScheme.border,
                    }
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={colorScheme.subtext}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Lock size={20} color={colorScheme.primary} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: colorScheme.text,
                      borderColor: colorScheme.border,
                    }
                  ]}
                  placeholder="Enter password"
                  placeholderTextColor={colorScheme.subtext}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colorScheme.subtext} />
                  ) : (
                    <Eye size={20} color={colorScheme.subtext} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={colorScheme.primary} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: colorScheme.text,
                      borderColor: colorScheme.border,
                    }
                  ]}
                  placeholder="Confirm password"
                  placeholderTextColor={colorScheme.subtext}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colorScheme.subtext} />
                  ) : (
                    <Eye size={20} color={colorScheme.subtext} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  <View style={[
                    styles.checkbox,
                    { borderColor: colorScheme.border },
                    agreeToTerms && { backgroundColor: colorScheme.primary, borderColor: colorScheme.primary }
                  ]}>
                    {agreeToTerms && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.termsText, { color: colorScheme.subtext }]}>
                    I agree to the{' '}
                    <Text style={{ color: colorScheme.primary }}>Terms</Text>
                    {' '}and{' '}
                    <Text style={{ color: colorScheme.primary }}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Button
                title="Sign up"
                onPress={handleSignUp}
                loading={isLoading}
                style={[styles.signUpButton, { backgroundColor: '#000000' }]}
                textStyle={{ color: '#FFFFFF' }}
                disabled={!agreeToTerms}
              />
              
              <Text style={[styles.orText, { color: colorScheme.subtext }]}>
                or sign up with
              </Text>
              
              <TouchableOpacity
                onPress={handleGoogleSignUp}
                style={[styles.googleButton, { borderColor: colorScheme.border }]}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={[styles.googleText, { color: colorScheme.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loginRedirect: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 13,
    zIndex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 40,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 13,
    zIndex: 1,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  signUpButton: {
    marginBottom: 24,
  },
  orText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#4285F4',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});