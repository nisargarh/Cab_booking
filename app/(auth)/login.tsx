import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { UserRole } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Phone, User as UserIcon } from 'lucide-react-native';
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

type SignupStep = 'signup' | 'otp' | 'google-phone' | 'google-otp';

interface GoogleUser {
  name: string;
  email: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedRole, setUser } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [currentStep, setCurrentStep] = useState<SignupStep>('signup');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  const handleSendOtp = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (currentStep === 'signup') {
        setCurrentStep('otp');
      } else if (currentStep === 'google-phone') {
        setCurrentStep('google-otp');
      }
      setIsLoading(false);
    }, 1500);
  };

  const isSignupFormValid = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    return fullName.trim().length >= 2 && digits.length >= 8;
  };

  const handleVerifyOtp = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const user = {
        id: '123',
        name: (fullName && fullName.trim()) || googleUser?.name || 'John Doe',
        phone: phoneNumber || '1234567890',
        email: googleUser?.email || 'user@example.com',
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

  const handleGoogleLogin = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsLoading(true);
    
    // Simulate Google login
    setTimeout(() => {
      const googleUserData = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
      };
      
      setGoogleUser(googleUserData);
      setCurrentStep('google-phone');
      setIsLoading(false);
    }, 1500);
  };

  const handleEmailRedirect = () => {
    // For now, just show a message or redirect to email login
    router.push('(auth)/signup');
  };

  const handleChangePhoneNumber = () => {
    if (currentStep === 'otp') {
      setCurrentStep('signup');
    } else if (currentStep === 'google-otp') {
      setCurrentStep('google-phone');
    }
    setOtp('');
  };

  const handleUseDifferentMethod = () => {
    setGoogleUser(null);
    setCurrentStep('signup');
  };

  const renderSignupScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme.text }]}>
         Login
        </Text>
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
          Login as {selectedRole === 'rider' ? 'Rider' : 'Driver'}
        </Text>
      </View>

      <GlassCard style={[styles.formCard, { 
        backgroundColor: colorScheme.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }]}>
        {/* Full Name above Phone */}
        <View style={styles.inputContainer}>
          <View style={styles.phoneInputWrapper}>
            <UserIcon size={20} color={colorScheme.subtext} style={styles.phoneIcon} />
            <TextInput
              style={[
                styles.phoneInput,
                { 
                  color: colorScheme.text,
                  borderColor: colorScheme.border,
                }
              ]}
              placeholder="Full Name"
              placeholderTextColor={colorScheme.subtext}
              value={fullName}
              onChangeText={setFullName}
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.phoneInputWrapper}>
            <Phone size={20} color={colorScheme.subtext} style={styles.phoneIcon} />
            <TextInput
              style={[
                styles.phoneInput,
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
              returnKeyType="done"
            />
          </View>
        </View>
        
        <Button
          title="Send OTP"
          onPress={handleSendOtp}
          loading={isLoading}
          disabled={!isSignupFormValid()}
          style={[styles.primaryButton, { backgroundColor: '#000000', opacity: isSignupFormValid() ? 1 : 0.6 }]}
          textStyle={{ color: '#FFFFFF' }}
        />
        
        
      </GlassCard>

      <View style={styles.dividerContainer}>
        <Text style={[styles.dividerText, { color: colorScheme.subtext }]}>
          Or continue with
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        style={[styles.googleButton, { 
          borderColor: '#e0e0e0',
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }]}
        disabled={isLoading}
      >
        <Text style={[styles.googleText, { color: '#333333' }]}>
          Google
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOtpScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          Verify OTP
        </Text>
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
          Enter the OTP sent to your phone
        </Text>
      </View>

      <GlassCard style={[styles.formCard, { 
        backgroundColor: colorScheme.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }]}>
        <Text style={[styles.otpMessage, { color: colorScheme.subtext }]}>
          We've sent a verification code to
        </Text>
        
        <View style={styles.inputContainer}>
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
            textAlign="center"
          />
        </View>
        
        <Button
          title="Verify & Login"
          onPress={handleVerifyOtp}
          loading={isLoading}
          style={[styles.primaryButton, { backgroundColor: '#000000' }]}
          textStyle={{ color: '#FFFFFF' }}
        />
        
        <TouchableOpacity onPress={handleChangePhoneNumber} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colorScheme.text }]}>
            Change Phone Number
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );

  const renderGooglePhoneScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          Welcome
        </Text>
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
          Complete your profile with phone verification
        </Text>
      </View>

      <GlassCard style={[styles.singleCard, { 
        backgroundColor: colorScheme.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }]}>
        <View style={styles.userWelcomeSection}>
          <Text style={[styles.welcomeUserName, { color: colorScheme.text }]}>
            Welcome, {googleUser?.name}!
          </Text>
          <Text style={[styles.userEmail, { color: colorScheme.subtext }]}>
            {googleUser?.email}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.phoneInputWrapper}>
            <Phone size={20} color={colorScheme.subtext} style={styles.phoneIcon} />
            <TextInput
              style={[
                styles.phoneInput,
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
        </View>
        
        <Button
          title="Send OTP"
          onPress={handleSendOtp}
          loading={isLoading}
          style={[styles.primaryButton, { backgroundColor: '#000000' }]}
          textStyle={{ color: '#FFFFFF' }}
        />
        
        <TouchableOpacity onPress={handleUseDifferentMethod} style={styles.centeredLinkButton}>
          <Text style={[styles.centeredLinkText, { color: colorScheme.text }]}>
            Use different signin method
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'signup':
        return renderSignupScreen();
      case 'otp':
        return renderOtpScreen();
      case 'google-phone':
        return renderGooglePhoneScreen();
      case 'google-otp':
        return renderOtpScreen();
      default:
        return renderSignupScreen();
    }
  };

  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1c1c1c' : '#f5f5f5',
        theme === 'dark' ? '#1c1c1c' : '#f5f5f5'
      ]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {renderCurrentScreen()}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:100,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
   
    marginBottom: 20,
    width: '100%',
    borderRadius: 16,
  },
  combinedCard: {
    // padding: 24,
    marginBottom: 24,
    borderRadius: 16,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  welcomeUserText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmailText: {
    fontSize: 14,
    textAlign: 'center',
  },
  phoneSection: {
    marginBottom: 20,
  },
  centerLinkButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  centerLinkText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  singleCard: {
    // padding: 24,
    marginBottom: 24,
    borderRadius: 16,
  },
  userWelcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    // paddingTop: 10,
  },
  welcomeUserName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'center',
  },
  centeredLinkButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  centeredLinkText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  phoneIcon: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    marginBottom: 16,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerText: {
    fontSize: 14,
  },
  googleButton: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  otpMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    letterSpacing: 2,
  },
});