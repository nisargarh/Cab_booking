import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { UserRole } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Mail, Phone } from 'lucide-react-native';
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

type LoginMethod = 'email' | 'phone';
type LoginStep = 'login' | 'otp';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedRole, setUser } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [currentStep, setCurrentStep] = useState<LoginStep>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handleEmailLogin = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
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

  const handleSendOtp = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentStep('otp');
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const user = {
        id: '123',
        name: 'John Doe',
        phone: phoneNumber || '1234567890',
        email: 'user@example.com',
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

  const handleSignUpRedirect = () => {
    router.push('(auth)/signup');
  };

  const handleGoogleLogin = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    // Simulate Google login
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

  const renderLogin = () => (
    <>
      <Text style={[styles.title, { color: colorScheme.text }]}>
        Login
      </Text>
      
      <View style={styles.signUpRedirect}>
        <Text style={[styles.signUpText, { color: colorScheme.subtext }]}>
          Don&apos;t have an account?{' '}
        </Text>
        <TouchableOpacity onPress={handleSignUpRedirect}>
          <Text style={[styles.signUpLink, { color: colorScheme.primary }]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.methodButtons}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            loginMethod === 'email' && styles.activeMethod,
            { 
              backgroundColor: loginMethod === 'email' ? colorScheme.primary : colorScheme.card, 
              borderColor: colorScheme.border 
            }
          ]}
          onPress={() => setLoginMethod('email')}
        >
          <Mail size={20} color={loginMethod === 'email' ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colorScheme.primary} />
          <Text style={[
            styles.methodText, 
            { color: loginMethod === 'email' ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colorScheme.text }
          ]}>
            Email
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.methodButton,
            loginMethod === 'phone' && styles.activeMethod,
            { 
              backgroundColor: loginMethod === 'phone' ? colorScheme.primary : colorScheme.card, 
              borderColor: colorScheme.border 
            }
          ]}
          onPress={() => setLoginMethod('phone')}
        >
          <Phone size={20} color={loginMethod === 'phone' ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colorScheme.primary} />
          <Text style={[
            styles.methodText, 
            { color: loginMethod === 'phone' ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colorScheme.text }
          ]}>
            Phone
          </Text>
        </TouchableOpacity>
      </View>

      <GlassCard style={styles.formCard}>
        {loginMethod === 'email' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colorScheme.text }]}>Email</Text>
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
              <Text style={[styles.inputLabel, { color: colorScheme.text }]}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: colorScheme.text,
                    borderColor: colorScheme.border,
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colorScheme.subtext}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colorScheme.primary }]}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
            
            <Button
              title="Log In"
              onPress={handleEmailLogin}
              loading={isLoading}
              style={[styles.signInButton, { backgroundColor: colorScheme.primary }]}
              textStyle={{ color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
            />
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colorScheme.text }]}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={[styles.countryCode, { color: colorScheme.text }]}>+91</Text>
                <TextInput
                  style={[
                    styles.phoneInput,
                    { 
                      color: colorScheme.text,
                      borderColor: colorScheme.border,
                    }
                  ]}
                  placeholder="Enter phone number"
                  placeholderTextColor={colorScheme.subtext}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              <Text style={[styles.phoneNote, { color: colorScheme.subtext }]}>
                We&apos;ll send you a 6-digit verification code
              </Text>
            </View>
            
            <Button
              title="Send OTP"
              onPress={handleSendOtp}
              loading={isLoading}
              style={[styles.signInButton, { backgroundColor: colorScheme.primary }]}
              textStyle={{ color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
            />
          </>
        )}
        
        <Text style={[styles.orText, { color: colorScheme.subtext }]}>
          Or continue with
        </Text>
        
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={[styles.googleButton, { borderColor: colorScheme.border }]}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.googleText, { color: colorScheme.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text style={[styles.bottomText, { color: colorScheme.subtext }]}>
          By signing in, you agree to our{' '}
          <Text style={{ color: colorScheme.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colorScheme.primary }}>Privacy Policy</Text>
        </Text>
      </GlassCard>
    </>
  );

  const renderOtpVerification = () => (
    <>
      <Text style={[styles.title, { color: colorScheme.text }]}>
        Login
      </Text>
      
      <View style={styles.signUpRedirect}>
        <Text style={[styles.signUpText, { color: colorScheme.subtext }]}>
          Don&apos;t have an account?{' '}
        </Text>
        <TouchableOpacity onPress={handleSignUpRedirect}>
          <Text style={[styles.signUpLink, { color: colorScheme.primary }]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.methodButtons}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            { backgroundColor: colorScheme.card, borderColor: colorScheme.border }
          ]}
          onPress={() => setCurrentStep('login')}
        >
          <Mail size={20} color={colorScheme.primary} />
          <Text style={[styles.methodText, { color: colorScheme.text }]}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.methodButton,
            styles.activeMethod,
            { backgroundColor: colorScheme.primary }
          ]}
        >
          <Phone size={20} color={theme === 'dark' ? '#000000' : '#FFFFFF'} />
          <Text style={[styles.methodText, { color: theme === 'dark' ? '#000000' : '#FFFFFF' }]}>Phone</Text>
        </TouchableOpacity>
      </View>

      <GlassCard style={styles.formCard}>
        <Text style={[styles.otpTitle, { color: colorScheme.text }]}>
          Enter OTP
        </Text>
        <Text style={[styles.otpSubtitle, { color: colorScheme.subtext }]}>
          Enter 6-digit OTP
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
            placeholder="Enter 6-digit OTP"
            placeholderTextColor={colorScheme.subtext}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
        </View>

        <Text style={[styles.otpNote, { color: colorScheme.subtext }]}>
          Resend OTP in 1m
        </Text>
        
        <Button
          title="Verify & Log In"
          onPress={handleVerifyOtp}
          loading={isLoading}
          style={[styles.signInButton, { backgroundColor: colorScheme.primary }]}
          textStyle={{ color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
        />
        
        <Text style={[styles.orText, { color: colorScheme.subtext }]}>
          Or continue with
        </Text>
        
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={[styles.googleButton, { borderColor: colorScheme.border }]}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.googleText, { color: colorScheme.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text style={[styles.bottomText, { color: colorScheme.subtext }]}>
          By signing in, you agree to our{' '}
          <Text style={{ color: colorScheme.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colorScheme.primary }}>Privacy Policy</Text>
        </Text>
      </GlassCard>
    </>
  );

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
          <View style={styles.content}>
            {currentStep === 'login' ? renderLogin() : renderOtpVerification()}
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
  signUpRedirect: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
  },
  methodButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  activeMethod: {
    // backgroundColor will be set dynamically
  },
  methodText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  formCard: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
    paddingVertical: 15,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  phoneNote: {
    fontSize: 12,
    marginTop: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
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
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    marginBottom: 16,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
  },
  otpNote: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
});