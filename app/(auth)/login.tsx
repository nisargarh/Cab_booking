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
import { ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
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

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedRole, setUser } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSendOtp = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleLogin = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      // Create mock user
      const user = {
        id: '123',
        name: name || 'John Doe',
        phone: phoneNumber || '1234567890',
        email: email || 'user@example.com',
        role: selectedRole as UserRole,
      };
      
      setUser(user);
      
      // Navigate to appropriate dashboard
      if (selectedRole === 'rider') {
        router.replace('(rider-tabs)');
      } else {
        router.replace('(driver-tabs)');
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
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
              {isOtpSent ? 'Verify OTP' : 'Welcome'}
            </Text>
            
            <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
              {isOtpSent 
                ? 'Enter the OTP sent to your phone'
                : `Sign in as ${selectedRole === 'rider' ? 'Rider' : 'Driver'}`
              }
            </Text>
            
            <GlassCard style={styles.formCard}>
              {!isOtpSent ? (
                <>
                  {loginMethod === 'phone' ? (
                    <View style={styles.inputContainer}>
                      <Phone size={20} color={colorScheme.primary} style={styles.inputIcon} />
                      <TextInput
                        style={[
                          styles.input,
                          { 
                            color: colorScheme.text,
                            borderColor: colorScheme.border,
                          }
                        ]}
                        placeholder="Phone Number"
                        placeholderTextColor={colorScheme.subtext}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                  ) : (
                    <>
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
                          placeholder="Email"
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
                          placeholder="Password"
                          placeholderTextColor={colorScheme.subtext}
                          secureTextEntry
                          value={password}
                          onChangeText={setPassword}
                        />
                      </View>
                    </>
                  )}
                  
                  <View style={styles.inputContainer}>
                    <User size={20} color={colorScheme.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          color: colorScheme.text,
                          borderColor: colorScheme.border,
                        }
                      ]}
                      placeholder="Your Name"
                      placeholderTextColor={colorScheme.subtext}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                  
                  <Button
                    title={loginMethod === 'phone' ? "Send OTP" : "Login"}
                    onPress={loginMethod === 'phone' ? handleSendOtp : handleLogin}
                    loading={isLoading}
                    style={styles.button}
                  />
                  
                  <TouchableOpacity
                    onPress={toggleLoginMethod}
                    style={styles.toggleContainer}
                  >
                    <Text style={[styles.toggleText, { color: colorScheme.primary }]}>
                      {loginMethod === 'phone' 
                        ? "Login with Email instead" 
                        : "Login with Phone instead"
                      }
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.otpMessage, { color: colorScheme.text }]}>
                    We've sent a verification code to
                  </Text>
                  <Text style={[styles.phoneText, { color: colorScheme.primary }]}>
                    {phoneNumber}
                  </Text>
                  
                  <View style={styles.otpContainer}>
                    <TextInput
                      style={[
                        styles.otpInput,
                        { 
                          color: colorScheme.text,
                          borderColor: colorScheme.border,
                        }
                      ]}
                      placeholder="Enter OTP"
                      placeholderTextColor={colorScheme.subtext}
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      onChangeText={setOtp}
                    />
                  </View>
                  
                  <Button
                    title="Verify & Login"
                    onPress={handleLogin}
                    loading={isLoading}
                    style={styles.button}
                  />
                  
                  <TouchableOpacity
                    onPress={() => setIsOtpSent(false)}
                    style={styles.toggleContainer}
                  >
                    <Text style={[styles.toggleText, { color: colorScheme.primary }]}>
                      Change Phone Number
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </GlassCard>
            
            <View style={styles.socialContainer}>
              <Text style={[styles.orText, { color: colorScheme.subtext }]}>
                Or continue with
              </Text>
              
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { borderColor: colorScheme.border }
                  ]}
                >
                  <Text style={[styles.socialButtonText, { color: colorScheme.text }]}>
                    Google
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { borderColor: colorScheme.border }
                  ]}
                >
                  <Text style={[styles.socialButtonText, { color: colorScheme.text }]}>
                    Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  formCard: {
    padding: 24,
    marginBottom: 24,
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
  button: {
    marginTop: 8,
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    alignItems: 'center',
  },
  orText: {
    fontSize: 14,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  otpMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
  },
});