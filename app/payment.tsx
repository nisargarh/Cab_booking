import { BookingSuccess } from '@/components/ui/BookingSuccess';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useRides } from '@/hooks/useRides';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { CheckCircle, CreditCard, Shield, Smartphone } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type PaymentMethod = 'card' | 'upi';
type UPIMethod = 'gpay' | 'phonepe' | 'paypal' | 'paytm';

export default function PaymentScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentRide, setPaymentMethod, confirmBooking } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [selectedUPI, setSelectedUPI] = useState<UPIMethod>('gpay');
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIOptions, setShowUPIOptions] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  
  // Create default fare if none exists to prevent blocking the flow
  const rideData = currentRide || {
    fare: {
      base: 25,
      distance: 30,
      time: 12.5,
      surge: 0,
      tax: 6.75,
      total: 74.25,
      advancePayment: 18.56,
      remainingPayment: 55.69,
    },
    distance: 15,
    duration: 25,
  };
  
  const advancePayment = rideData.fare.advancePayment;
  const remainingPayment = rideData.fare.remainingPayment;
  
  const handlePaymentSelect = (method: PaymentMethod) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPayment(method);
    
    if (method === 'card') {
      setShowCardForm(true);
      setShowUPIOptions(false);
    } else if (method === 'upi') {
      setShowUPIOptions(true);
      setShowCardForm(false);
    }
  };
  
  const handleUPISelect = (method: UPIMethod) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedUPI(method);
  };
  
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };
  
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };
  
  const validateCardForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return false;
    }
    if (!expiryDate || expiryDate.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return false;
    }
    if (!cardholderName.trim()) {
      Alert.alert('Invalid Name', 'Please enter cardholder name');
      return false;
    }
    return true;
  };
  
  const processPayment = async () => {
    if (selectedPayment === 'card' && !validateCardForm()) {
      return;
    }
    
    setPaymentProcessing(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentCompleted(true);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Set the payment method, confirm booking and show success
      setPaymentMethod(selectedPayment);
      confirmBooking();
      setShowBookingSuccess(true);
    }, 2000);
  };
  
  const handleViewDetails = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(rider-tabs)/trips');
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
              ${rideData.fare.base.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colorScheme.subtext }]}>
              Distance ({rideData.distance} km)
            </Text>
            <Text style={[styles.fareValue, { color: colorScheme.text }]}>
              ${rideData.fare.distance.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colorScheme.subtext }]}>
              Time ({rideData.duration} min)
            </Text>
            <Text style={[styles.fareValue, { color: colorScheme.text }]}>
              ${rideData.fare.time.toFixed(2)}
            </Text>
          </View>
          
          {rideData.fare.surge > 0 && (
            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, { color: colorScheme.warning }]}>
                Surge Pricing
              </Text>
              <Text style={[styles.fareValue, { color: colorScheme.warning }]}>
                +${rideData.fare.surge.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={[styles.fareRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: colorScheme.text }]}>
              Total Fare
            </Text>
            <Text style={[styles.totalValue, { color: colorScheme.text }]}>
              ${rideData.fare.total.toFixed(2)}
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
        
        {!paymentCompleted ? (
          <>
            <GlassCard style={styles.paymentCard}>
              <Text style={[styles.paymentTitle, { color: colorScheme.text }]}>
                Select Payment Method
              </Text>
              
              <TouchableOpacity
                onPress={() => handlePaymentSelect('card')}
                activeOpacity={0.8}
                style={styles.paymentMethodContainer}
              >
                <GlassCard
                  style={[
                    styles.paymentMethodCard,
                    selectedPayment === 'card' && { 
                      borderColor: colorScheme.primary, 
                      borderWidth: 2,
                      backgroundColor: 'rgba(0, 255, 0, 0.1)'
                    }
                  ]}
                >
                  <View style={styles.paymentMethodIcon}>
                    <CreditCard size={24} color={colorScheme.primary} />
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <Text style={[styles.paymentMethodTitle, { color: colorScheme.text }]}>
                      Card
                    </Text>
                    <Text style={[styles.paymentMethodSubtitle, { color: colorScheme.subtext }]}>
                      Credit/Debit Card
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    { borderColor: colorScheme.border },
                    selectedPayment === 'card' && { backgroundColor: colorScheme.primary }
                  ]}>
                    {selectedPayment === 'card' && <View style={styles.radioInner} />}
                  </View>
                </GlassCard>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handlePaymentSelect('upi')}
                activeOpacity={0.8}
                style={styles.paymentMethodContainer}
              >
                <GlassCard
                  style={[
                    styles.paymentMethodCard,
                    selectedPayment === 'upi' && { 
                      borderColor: colorScheme.primary, 
                      borderWidth: 2,
                      backgroundColor: 'rgba(0, 255, 0, 0.1)'
                    }
                  ]}
                >
                  <View style={styles.paymentMethodIcon}>
                    <Smartphone size={24} color={colorScheme.primary} />
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <Text style={[styles.paymentMethodTitle, { color: colorScheme.text }]}>
                      UPI
                    </Text>
                    <Text style={[styles.paymentMethodSubtitle, { color: colorScheme.subtext }]}>
                      Digital Payment
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    { borderColor: colorScheme.border },
                    selectedPayment === 'upi' && { backgroundColor: colorScheme.primary }
                  ]}>
                    {selectedPayment === 'upi' && <View style={styles.radioInner} />}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </GlassCard>
            
            {showCardForm && (
              <GlassCard style={styles.cardFormCard}>
                <Text style={[styles.cardFormTitle, { color: colorScheme.text }]}>
                  Card Details
                </Text>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colorScheme.text }]}>
                    Card Number
                  </Text>
                  <TextInput
                    style={[styles.input, { color: colorScheme.text, borderColor: colorScheme.border }]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={colorScheme.subtext}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.inputLabel, { color: colorScheme.text }]}>
                      Expiry Date
                    </Text>
                    <TextInput
                      style={[styles.input, { color: colorScheme.text, borderColor: colorScheme.border }]}
                      placeholder="MM/YY"
                      placeholderTextColor={colorScheme.subtext}
                      value={expiryDate}
                      onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={[styles.inputLabel, { color: colorScheme.text }]}>
                      CVV
                    </Text>
                    <TextInput
                      style={[styles.input, { color: colorScheme.text, borderColor: colorScheme.border }]}
                      placeholder="123"
                      placeholderTextColor={colorScheme.subtext}
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colorScheme.text }]}>
                    Cardholder Name
                  </Text>
                  <TextInput
                    style={[styles.input, { color: colorScheme.text, borderColor: colorScheme.border }]}
                    placeholder="John Doe"
                    placeholderTextColor={colorScheme.subtext}
                    value={cardholderName}
                    onChangeText={setCardholderName}
                    autoCapitalize="words"
                  />
                </View>
              </GlassCard>
            )}
            
            {showUPIOptions && (
              <GlassCard style={styles.upiOptionsCard}>
                <Text style={[styles.upiOptionsTitle, { color: colorScheme.text }]}>
                  Select UPI Method
                </Text>
                
                {[
                  { id: 'gpay', name: 'Google Pay', subtitle: 'Pay with Google Pay' },
                  { id: 'phonepe', name: 'PhonePe', subtitle: 'Pay with PhonePe' },
                  { id: 'paypal', name: 'PayPal', subtitle: 'Pay with PayPal' },
                  { id: 'paytm', name: 'Paytm', subtitle: 'Pay with Paytm' },
                ].map((upiMethod) => (
                  <TouchableOpacity
                    key={upiMethod.id}
                    onPress={() => handleUPISelect(upiMethod.id as UPIMethod)}
                    activeOpacity={0.8}
                    style={styles.upiMethodContainer}
                  >
                    <View style={[
                      styles.upiMethodCard,
                      selectedUPI === upiMethod.id && { 
                        borderColor: colorScheme.primary, 
                        borderWidth: 2,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)'
                      }
                    ]}>
                      <View style={styles.upiMethodContent}>
                        <Text style={[styles.upiMethodTitle, { color: colorScheme.text }]}>
                          {upiMethod.name}
                        </Text>
                        <Text style={[styles.upiMethodSubtitle, { color: colorScheme.subtext }]}>
                          {upiMethod.subtitle}
                        </Text>
                      </View>
                      <View style={[
                        styles.radioButton,
                        { borderColor: colorScheme.border },
                        selectedUPI === upiMethod.id && { backgroundColor: colorScheme.primary }
                      ]}>
                        {selectedUPI === upiMethod.id && <View style={styles.radioInner} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </GlassCard>
            )}
          </>
        ) : (
          <GlassCard style={[styles.successCard, { backgroundColor: 'rgba(0, 255, 0, 0.1)' }]}>
            <View style={styles.successHeader}>
              <CheckCircle size={48} color="#00FF00" />
              <Text style={[styles.successTitle, { color: colorScheme.text }]}>
                Booking Confirmed!
              </Text>
            </View>
            
            <Text style={[styles.successMessage, { color: colorScheme.subtext }]}>
              Your payment of ${advancePayment.toFixed(2)} has been processed successfully. 
              Your ride has been confirmed and you will receive driver details shortly.
            </Text>
            
            <View style={styles.successDetails}>
              <Text style={[styles.successDetailLabel, { color: colorScheme.subtext }]}>
                Payment Method:
              </Text>
              <Text style={[styles.successDetailValue, { color: colorScheme.text }]}>
                {selectedPayment === 'card' ? 'Credit/Debit Card' : `UPI - ${selectedUPI.charAt(0).toUpperCase() + selectedUPI.slice(1)}`}
              </Text>
            </View>
            
            <View style={styles.successDetails}>
              <Text style={[styles.successDetailLabel, { color: colorScheme.subtext }]}>
                Amount Paid:
              </Text>
              <Text style={[styles.successDetailValue, { color: '#00FF00' }]}>
                ${advancePayment.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.successDetails}>
              <Text style={[styles.successDetailLabel, { color: colorScheme.subtext }]}>
                Remaining Amount:
              </Text>
              <Text style={[styles.successDetailValue, { color: colorScheme.text }]}>
                ${remainingPayment.toFixed(2)} (Pay after trip)
              </Text>
            </View>
            
            <Button
              title="View Details"
              onPress={handleViewDetails}
              style={styles.viewDetailsButton}
            />
          </GlassCard>
        )}
        
        {!paymentCompleted && (
          <>
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
              title={paymentProcessing ? 'Processing Payment...' : `Pay $${advancePayment.toFixed(2)} & Confirm Booking`}
              onPress={processPayment}
              disabled={paymentProcessing || (selectedPayment === 'card' && !showCardForm) || (selectedPayment === 'upi' && !showUPIOptions)}
              style={styles.confirmButton}
            />
          </>
        )}
      </ScrollView>

      <BookingSuccess 
        visible={showBookingSuccess}
        onClose={() => setShowBookingSuccess(false)}
        ride={currentRide || rideData}
        onViewDetails={handleViewDetails}
      />
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
  // New payment method styles
  paymentMethodContainer: {
    marginBottom: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentMethodIcon: {
    marginRight: 16,
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentMethodSubtitle: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  // Card form styles
  cardFormCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  // UPI options styles
  upiOptionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  upiOptionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  upiMethodContainer: {
    marginBottom: 8,
  },
  upiMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  upiMethodContent: {
    flex: 1,
  },
  upiMethodTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  upiMethodSubtitle: {
    fontSize: 14,
  },
  // Success card styles
  successCard: {
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  successDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  successDetailLabel: {
    fontSize: 14,
  },
  successDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewDetailsButton: {
    marginTop: 20,
  },
});