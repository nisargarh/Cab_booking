import { PaymentOption } from '@/components/rider/PaymentOption';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useRides } from '@/hooks/useRides';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

type PaymentMethod = 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash';

export default function PaymentScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentRide } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  
  if (!currentRide || !currentRide.fare) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <Text style={[styles.errorText, { color: colorScheme.text }]}>
          Please complete booking details first
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }
  
  const advancePayment = currentRide.fare.advancePayment;
  const remainingPayment = currentRide.fare.remainingPayment;
  
  const handlePaymentSelect = (method: PaymentMethod) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPayment(method);
  };
  
  const handleConfirmBooking = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Navigate to OTP screen for rider
    router.push('/rider-otp');
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
          title: 'Payment',
          headerBackTitle: 'Back',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={styles.fareCard}>
          <Text style={[styles.fareTitle, { color: colorScheme.text }]}>
            Fare Breakdown
          </Text>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colorScheme.subtext }]}>
              Base Fare
            </Text>
            <Text style={[styles.fareValue, { color: colorScheme.text }]}>
              ${currentRide.fare.base.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colorScheme.subtext }]}>
              Distance ({currentRide.distance} km)
            </Text>
            <Text style={[styles.fareValue, { color: colorScheme.text }]}>
              ${currentRide.fare.distance.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colorScheme.subtext }]}>
              Time ({currentRide.duration} min)
            </Text>
            <Text style={[styles.fareValue, { color: colorScheme.text }]}>
              ${currentRide.fare.time.toFixed(2)}
            </Text>
          </View>
          
          {currentRide.fare.surge > 0 && (
            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, { color: colorScheme.warning }]}>
                Surge Pricing
              </Text>
              <Text style={[styles.fareValue, { color: colorScheme.warning }]}>
                +${currentRide.fare.surge.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={[styles.fareRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: colorScheme.text }]}>
              Total Fare
            </Text>
            <Text style={[styles.totalValue, { color: colorScheme.text }]}>
              ${currentRide.fare.total.toFixed(2)}
            </Text>
          </View>
        </GlassCard>
        
        <GlassCard style={[styles.advanceCard, { backgroundColor: 'rgba(0, 255, 0, 0.1)' }]}>
          <View style={styles.advanceHeader}>
            <Shield size={24} color="#00FF00" />
            <Text style={[styles.advanceTitle, { color: colorScheme.text }]}>
              Advance Payment (25%)
            </Text>
          </View>
          
          <Text style={[styles.advanceAmount, { color: '#00FF00' }]}>
            ${advancePayment.toFixed(2)}
          </Text>
          
          <Text style={[styles.advanceDescription, { color: colorScheme.subtext }]}>
            Pay 25% now to confirm your booking. Remaining ${remainingPayment.toFixed(2)} will be collected after the trip.
          </Text>
        </GlassCard>
        
        <GlassCard style={styles.paymentCard}>
          <Text style={[styles.paymentTitle, { color: colorScheme.text }]}>
            Select Payment Method
          </Text>
          
          <PaymentOption
            title="Credit/Debit Card"
            subtitle="Visa, Mastercard, American Express"
            isSelected={selectedPayment === 'card'}
            onPress={() => handlePaymentSelect('card')}
          />
          
          <PaymentOption
            title="PayPal"
            subtitle="Pay with your PayPal account"
            isSelected={selectedPayment === 'paypal'}
            onPress={() => handlePaymentSelect('paypal')}
          />
          
          {Platform.OS === 'ios' && (
            <PaymentOption
              title="Apple Pay"
              subtitle="Touch ID or Face ID"
              isSelected={selectedPayment === 'apple_pay'}
              onPress={() => handlePaymentSelect('apple_pay')}
            />
          )}
          
          {Platform.OS === 'android' && (
            <PaymentOption
              title="Google Pay"
              subtitle="Pay with Google"
              isSelected={selectedPayment === 'google_pay'}
              onPress={() => handlePaymentSelect('google_pay')}
            />
          )}
          
          <PaymentOption
            title="Cash"
            subtitle="Pay driver in cash"
            isSelected={selectedPayment === 'cash'}
            onPress={() => handlePaymentSelect('cash')}
          />
        </GlassCard>
        
        <GlassCard style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Shield size={20} color={colorScheme.success} />
            <Text style={[styles.securityTitle, { color: colorScheme.text }]}>
              Secure Payment
            </Text>
          </View>
          
          <Text style={[styles.securityText, { color: colorScheme.subtext }]}>
            Your payment information is encrypted and secure. We never store your card details.
          </Text>
        </GlassCard>
        
        <Button
          title={`Pay ${selectedPayment === 'cash' ? 'Cash' : `$${advancePayment.toFixed(2)}`} & Confirm Booking`}
          onPress={handleConfirmBooking}
          style={styles.confirmButton}
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
  fareCard: {
    padding: 16,
    marginBottom: 16,
  },
  fareTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  advanceCard: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  advanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  advanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  advanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  advanceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  paymentCard: {
    padding: 16,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  securityCard: {
    padding: 16,
    marginBottom: 20,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 12,
    lineHeight: 16,
  },
  confirmButton: {
    
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
    alignSelf: 'center',
  },
});