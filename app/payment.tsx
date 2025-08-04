import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useRides } from '@/hooks/useRides';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import {
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Smartphone,
  User,
  Users
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type PaymentMethod = 'card' | 'upi';

export default function PaymentScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentRide, setPaymentMethod, confirmBooking } = useRides();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // ScrollView ref for controlling scroll position
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI form state
  const [upiId, setUpiId] = useState('');
  const [selectedUPIApp, setSelectedUPIApp] = useState('');
  
  // Create default ride data if not exists
  const rideData = currentRide || {
    pickup: { name: 'Kuvempunagar, Mysuru' },
    dropoff: { name: '783 Shopping Center, Mall District' },
    vehicle: { name: 'Premium', type: 'Premium' },
    passengers: 1,
    bookingType: 'city',
    fare: {
      base: 630,
      distance: 63,
      tax: 113,
      total: 806,
      advancePayment: 202,
      remainingPayment: 604,
    }
  };
  
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedPayment(method);
    
    if (method === 'card') {
      setShowCardForm(true);
      setShowUPIForm(false);
    } else {
      setShowUPIForm(true);
      setShowCardForm(false);
    }
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
  
  const validatePaymentForm = () => {
    if (selectedPayment === 'card') {
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
    } else if (selectedPayment === 'upi') {
      if (!upiId.trim()) {
        Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID');
        return false;
      }
    }
    return true;
  };
  
  const handlePayment = async () => {
    if (!validatePaymentForm()) return;
    
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
      
      setPaymentMethod(selectedPayment);
      confirmBooking();
    }, 2000);
  };
  
  // Scroll to top when payment is completed
  useEffect(() => {
    if (paymentCompleted && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [paymentCompleted]);
  
  const handleViewTripDetails = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(rider-tabs)/trips');
  };
  
  const handleBookAnotherRide = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(rider-tabs)/services');
  };
  
  const handleDownloadReceipt = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Receipt Downloaded', 'Your receipt has been downloaded successfully');
    // Here you would implement actual receipt download functionality
  };
  
  if (paymentCompleted) {
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
            title: 'Payment Successful',
            headerBackTitle: 'Back',
          }}
        />
        
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Header */}
          <View style={styles.successHeader}>
            <CheckCircle size={60} color={colorScheme.success} />
            <Text style={[styles.successTitle, { color: colorScheme.success }]}>
              Payment Successful!
            </Text>
            <Text style={[styles.successSubtitle, { color: colorScheme.text }]}>
              Your booking has been confirmed
            </Text>
            <Text style={[styles.bookingId, { color: colorScheme.subtext }]}>
              Booking ID: booking_{Date.now().toString().slice(-8)}
            </Text>
          </View>
          
          {/* Trip Info */}
          <GlassCard style={styles.tripInfoCard}>
            <View style={styles.tripHeader}>
              <Text style={[styles.tripType, { color: colorScheme.text }]}>
                {rideData.bookingType === 'airport' ? 'Airport Taxi' : 
                 rideData.bookingType === 'outstation' ? 'Outstation' :
                 rideData.bookingType === 'hourly' ? 'Hourly Rental' : 'City Ride'}
              </Text>
              <View style={styles.tripDetails}>
                <Text style={[styles.vehicleType, { color: colorScheme.text }]}>
                  {rideData.vehicle?.name || 'Premium'}
                </Text>
                <View style={styles.passengerInfo}>
                  <Users size={16} color={colorScheme.primary} />
                  <Text style={[styles.passengerText, { color: colorScheme.text }]}>
                    {rideData.passengers || 1} passenger
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
          
          {/* Route Details */}
          <GlassCard style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <MapPin size={20} color={colorScheme.primary} />
              <Text style={[styles.routeTitle, { color: colorScheme.text }]}>
                Route Details
              </Text>
            </View>
            
            <View style={styles.routeItem}>
              <View style={styles.routeMarker}>
                <View style={[styles.pickupDot, { backgroundColor: colorScheme.success }]} />
              </View>
              <View style={styles.routeContent}>
                <Text style={[styles.routeLabel, { color: colorScheme.subtext }]}>
                  PICKUP
                </Text>
                <Text style={[styles.routeLocation, { color: colorScheme.text }]}>
                  {rideData.pickup?.name || 'Kuvempunagar, Mysuru'}
                </Text>
              </View>
            </View>
            
            <View style={styles.routeItem}>
              <View style={styles.routeMarker}>
                <View style={[styles.dropDot, { backgroundColor: colorScheme.error }]} />
              </View>
              <View style={styles.routeContent}>
                <Text style={[styles.routeLabel, { color: colorScheme.subtext }]}>
                  DROP
                </Text>
                <Text style={[styles.routeLocation, { color: colorScheme.text }]}>
                  {rideData.dropoff?.name || '783 Shopping Center, Mall District'}
                </Text>
              </View>
            </View>
          </GlassCard>
          
          {/* Payment Summary */}
          <GlassCard style={styles.paymentSummaryCard}>
            <View style={styles.summaryHeader}>
              <CreditCard size={20} color={colorScheme.primary} />
              <Text style={[styles.summaryTitle, { color: colorScheme.text }]}>
                Payment Summary
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colorScheme.text }]}>
                Base Fare
              </Text>
              <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                ₹{rideData.fare?.base || 630}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colorScheme.text }]}>
                Platform Fees
              </Text>
              <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                ₹{rideData.fare?.distance || 63}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colorScheme.text }]}>
                GST (18%)
              </Text>
              <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                ₹{rideData.fare?.tax || 113}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colorScheme.text }]}>
                Total Amount
              </Text>
              <Text style={[styles.totalValue, { color: colorScheme.text }]}>
                ₹{rideData.fare?.total || 806}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.paidRow]}>
              <Text style={[styles.paidLabel, { color: colorScheme.success }]}>
                Paid Now (25%)
              </Text>
              <Text style={[styles.paidValue, { color: colorScheme.success }]}>
                ₹{rideData.fare?.advancePayment || 202}
              </Text>
            </View>
            
            <Text style={[styles.remainingText, { color: colorScheme.subtext }]}>
              Remaining ₹{rideData.fare?.remainingPayment || 604} to be paid after ride completion
            </Text>
          </GlassCard>
          
          {/* Safety Info */}
          <GlassCard style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <View style={styles.safetyIcon}>
                <User size={24} color={colorScheme.primary} />
              </View>
              <View style={styles.safetyContent}>
                <Text style={[styles.safetyTitle, { color: colorScheme.text }]}>
                  Safety First
                </Text>
                <Text style={[styles.safetyText, { color: colorScheme.subtext }]}>
                  Your ride is tracked in real-time. Driver details will be shared shortly.
                </Text>
              </View>
            </View>
          </GlassCard>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <View style={styles.topButtonContainer}>
              <Button
                title="View Trip Details"
                onPress={handleViewTripDetails}
                style={[styles.secondaryButton, { borderColor: colorScheme.border, backgroundColor: 'transparent' }]}
                textStyle={{ color: colorScheme.text }}
                variant="outlined"
              />
            </View>
            
            <View style={styles.secondaryButtons}>
              <Button
                title="Book Another Ride"
                onPress={handleBookAnotherRide}
                style={[styles.secondaryButton, { borderColor: colorScheme.border, backgroundColor: 'transparent' }]}
                textStyle={{ color: colorScheme.text }}
                variant="outlined"
              />
              
              <Button
                title="Download Receipt"
                onPress={handleDownloadReceipt}
                style={[styles.secondaryButton, { borderColor: colorScheme.border, backgroundColor: 'transparent' }]}
                textStyle={{ color: colorScheme.text }}
                variant="outlined"
              />
            </View>
          </View>
          
          {/* Driver Assignment Status */}
          <View style={styles.driverStatus}>
            <View style={styles.statusIndicator}>
              <Clock size={16} color={colorScheme.warning} />
              <Text style={[styles.statusText, { color: colorScheme.warning }]}>
                Driver Assignment in Progress
              </Text>
            </View>
            <Text style={[styles.statusSubtext, { color: colorScheme.subtext }]}>
              You will receive SMS updates about your ride. Support available 24/7.
            </Text>
          </View>
        </ScrollView>
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
      <Stack.Screen 
        options={{
          title: 'Payment',
          headerBackTitle: 'Back',
        }}
      />
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
            Trip Summary
          </Text>
          
          <View style={styles.summaryItem}>
            <View style={[styles.locationDot, { backgroundColor: colorScheme.success }]} />
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, { color: colorScheme.subtext }]}>
                Pickup
              </Text>
              <Text style={[styles.locationText, { color: colorScheme.text }]}>
                {rideData.pickup?.name || 'Kuvempunagar, Mysuru'}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <View style={[styles.locationDot, { backgroundColor: colorScheme.error }]} />
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, { color: colorScheme.subtext }]}>
                Drop
              </Text>
              <Text style={[styles.locationText, { color: colorScheme.text }]}>
                {rideData.dropoff?.name || '783 Shopping Center, Mall District'}
              </Text>
            </View>
          </View>
          
          <View style={styles.tripMeta}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaText, { color: colorScheme.primary }]}>
                {rideData.vehicle?.name || 'Premium'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color={colorScheme.primary} />
              <Text style={[styles.metaText, { color: colorScheme.text }]}>
                {rideData.passengers || 1} passenger
              </Text>
            </View>
          </View>
        </GlassCard>
        
        {/* Payment Breakdown */}
        <GlassCard style={styles.breakdownCard}>
          <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
            Payment Breakdown
          </Text>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colorScheme.text }]}>
              Base Fare
            </Text>
            <Text style={[styles.breakdownValue, { color: colorScheme.text }]}>
              ₹{rideData.fare?.base || 630}
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colorScheme.text }]}>
              Platform Fees
            </Text>
            <Text style={[styles.breakdownValue, { color: colorScheme.text }]}>
              ₹{rideData.fare?.distance || 63}
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colorScheme.text }]}>
              GST (18%)
            </Text>
            <Text style={[styles.breakdownValue, { color: colorScheme.text }]}>
              ₹{rideData.fare?.tax || 113}
            </Text>
          </View>
          
          <View style={[styles.breakdownRow, styles.totalBreakdownRow]}>
            <Text style={[styles.totalBreakdownLabel, { color: colorScheme.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalBreakdownValue, { color: colorScheme.text }]}>
              ₹{rideData.fare?.total || 806}
            </Text>
          </View>
          
          {/* Prepayment System */}
          <View style={[styles.prepaymentCard, { backgroundColor: colorScheme.primary + '20' }]}>
            <View style={styles.prepaymentRow}>
              <View style={styles.prepaymentDot} />
              <Text style={[styles.prepaymentText, { color: colorScheme.primary }]}>
                Prepayment System
              </Text>
            </View>
            
            <View style={styles.prepaymentDetails}>
              <View style={styles.prepaymentItem}>
                <Text style={[styles.prepaymentLabel, { color: colorScheme.text }]}>
                  Pay Now (25%)
                </Text>
                <Text style={[styles.prepaymentAmount, { color: colorScheme.primary }]}>
                  ₹{rideData.fare?.advancePayment || 202}
                </Text>
              </View>
              
              <View style={styles.prepaymentItem}>
                <Text style={[styles.prepaymentLabel, { color: colorScheme.text }]}>
                  Pay After Ride
                </Text>
                <Text style={[styles.prepaymentAmount, { color: colorScheme.text }]}>
                  ₹{rideData.fare?.remainingPayment || 604}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>
        
        {/* Payment Method */}
        <GlassCard style={styles.paymentMethodCard}>
          <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
            Payment Method
          </Text>
          
          {/* Payment Options */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'card' && { 
                borderColor: colorScheme.primary,
                backgroundColor: colorScheme.primary + '10'
              }
            ]}
            onPress={() => handlePaymentMethodSelect('card')}
          >
            <View style={styles.paymentOptionContent}>
              <CreditCard size={24} color={colorScheme.primary} />
              <View style={styles.paymentOptionText}>
                <Text style={[styles.paymentOptionTitle, { color: colorScheme.text }]}>
                  Credit/Debit Card
                </Text>
                <Text style={[styles.paymentOptionSubtitle, { color: colorScheme.subtext }]}>
                  Visa, Mastercard, Rupay
                </Text>
              </View>
            </View>
            <View style={[
              styles.radioButton,
              { borderColor: colorScheme.border },
              selectedPayment === 'card' && { backgroundColor: colorScheme.primary }
            ]}>
              {selectedPayment === 'card' && (
                <CheckCircle size={16} color={colorScheme.background} />
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'upi' && { 
                borderColor: colorScheme.primary,
                backgroundColor: colorScheme.primary + '10'
              }
            ]}
            onPress={() => handlePaymentMethodSelect('upi')}
          >
            <View style={styles.paymentOptionContent}>
              <Smartphone size={24} color={colorScheme.primary} />
              <View style={styles.paymentOptionText}>
                <Text style={[styles.paymentOptionTitle, { color: colorScheme.text }]}>
                  UPI Payment
                </Text>
                <Text style={[styles.paymentOptionSubtitle, { color: colorScheme.subtext }]}>
                  Google Pay, PhonePe, Paytm
                </Text>
              </View>
            </View>
            <View style={[
              styles.radioButton,
              { borderColor: colorScheme.border },
              selectedPayment === 'upi' && { backgroundColor: colorScheme.primary }
            ]}>
              {selectedPayment === 'upi' && (
                <CheckCircle size={16} color={colorScheme.background} />
              )}
            </View>
          </TouchableOpacity>
          
          {/* Card Form */}
          {showCardForm && (
            <View style={styles.paymentForm}>
              <Text style={[styles.formTitle, { color: colorScheme.text }]}>
                Card Number
              </Text>
              <TextInput
                style={[styles.formInput, { 
                  color: colorScheme.text, 
                  borderColor: colorScheme.border,
                  backgroundColor: colorScheme.surface
                }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colorScheme.subtext}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />
              
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={[styles.formTitle, { color: colorScheme.text }]}>
                    Expiry Date
                  </Text>
                  <TextInput
                    style={[styles.formInput, { 
                      color: colorScheme.text, 
                      borderColor: colorScheme.border,
                      backgroundColor: colorScheme.surface
                    }]}
                    placeholder="MM/YY"
                    placeholderTextColor={colorScheme.subtext}
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                
                <View style={styles.formColumn}>
                  <Text style={[styles.formTitle, { color: colorScheme.text }]}>
                    CVV
                  </Text>
                  <TextInput
                    style={[styles.formInput, { 
                      color: colorScheme.text, 
                      borderColor: colorScheme.border,
                      backgroundColor: colorScheme.surface
                    }]}
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
            </View>
          )}
          
          {/* UPI Form */}
          {showUPIForm && (
            <View style={styles.paymentForm}>
              <Text style={[styles.formTitle, { color: colorScheme.text }]}>
                UPI ID
              </Text>
              <TextInput
                style={[styles.formInput, { 
                  color: colorScheme.text, 
                  borderColor: colorScheme.border,
                  backgroundColor: colorScheme.surface
                }]}
                placeholder="yourname@upi"
                placeholderTextColor={colorScheme.subtext}
                value={upiId}
                onChangeText={setUpiId}
                keyboardType="email-address"
              />
              <Text style={[styles.formSubtext, { color: colorScheme.subtext }]}>
                Enter your UPI ID (eg: yourname@paytm)
              </Text>
              
              <View style={styles.upiApps}>
                {['Paytm', 'PhonePe', 'GPay'].map((app) => (
                  <TouchableOpacity
                    key={app}
                    style={[
                      styles.upiApp,
                      { borderColor: colorScheme.border },
                      selectedUPIApp === app && { 
                        borderColor: colorScheme.primary,
                        backgroundColor: colorScheme.primary + '20'
                      }
                    ]}
                    onPress={() => setSelectedUPIApp(app)}
                  >
                    <Text style={[styles.upiAppText, { color: colorScheme.text }]}>
                      {app}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </GlassCard>
        
        {/* Pay Button */}
        <Button
          title={paymentProcessing ? 'Processing Payment...' : `₹ Pay ₹${rideData.fare?.advancePayment || 202} Now`}
          onPress={handlePayment}
          disabled={paymentProcessing || (!showCardForm && !showUPIForm)}
          size="large"
          style={[styles.payButton, { backgroundColor: '#000000' }]}
        />
        
        <Text style={[styles.paymentNote, { color: colorScheme.subtext }]}>
          Remaining ₹{rideData.fare?.remainingPayment || 604} to be paid after ride completion
        </Text>
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
  // Trip Summary Styles
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  // Payment Breakdown Styles
  breakdownCard: {
    padding: 16,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalBreakdownRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
    marginTop: 8,
  },
  totalBreakdownLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalBreakdownValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Prepayment System Styles
  prepaymentCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  prepaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prepaymentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00CED1',
    marginRight: 8,
  },
  prepaymentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  prepaymentDetails: {
    marginLeft: 14,
  },
  prepaymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  prepaymentLabel: {
    fontSize: 12,
  },
  prepaymentAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Payment Method Styles
  paymentMethodCard: {
    padding: 16,
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionText: {
    marginLeft: 12,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentOptionSubtitle: {
    fontSize: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Form Styles
  paymentForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  formSubtext: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  // UPI Apps Styles
  upiApps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  upiApp: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upiAppText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Pay Button Styles
  payButton: {
    marginTop: 8,
    paddingVertical: 16,
  },
  paymentNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  // Success Page Styles
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
  },
  // Trip Info Card
  tripInfoCard: {
    padding: 16,
    marginBottom: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripType: {
    fontSize: 18,
    fontWeight: '600',
  },
  tripDetails: {
    alignItems: 'flex-end',
  },
  vehicleType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerText: {
    fontSize: 12,
    marginLeft: 4,
  },
  // Route Details
  routeCard: {
    padding: 16,
    marginBottom: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeMarker: {
    marginRight: 12,
  },
  pickupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dropDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeContent: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 14,
  },
  // Payment Summary
  paymentSummaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  paidRow: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  paidLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  paidValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  remainingText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Safety Card
  safetyCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyIcon: {
    marginRight: 12,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  safetyText: {
    fontSize: 14,
  },
  // Action Buttons
  actionButtons: {
    marginBottom: 20,
  },
  topButtonContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    marginBottom: 12,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Driver Status
  driverStatus: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statusSubtext: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});