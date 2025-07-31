import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { Ride } from '@/types';
import { useRouter } from 'expo-router';
import { Calendar, Car, CheckCircle, Download, MapPin, Users } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

interface BookingSuccessProps {
  visible: boolean;
  onClose: () => void;
  ride: Ride | null;
  onViewDetails: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  visible,
  onClose,
  ride,
  onViewDetails,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  const handleViewDetails = () => {
    onViewDetails();
    onClose();
    router.push('/(rider-tabs)/trips');
  };

  const handleBookRide = () => {
    onClose();
    router.push('/(rider-tabs)/services');
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download functionality
    console.log('Downloading receipt...');
  };

  if (!ride) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <GlassCard style={[styles.modal, { backgroundColor: colorScheme.background }]}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <CheckCircle size={80} color="#00C853" />
          </View>

          <Text style={[styles.title, { color: colorScheme.text }]}>
            Booking Successful!
          </Text>

          <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
            Your ride has been booked successfully. You'll receive driver details 15 minutes before your scheduled time.
          </Text>

          {/* Trip Summary */}
          <View style={styles.tripSummary}>
            <View style={styles.summaryRow}>
              <MapPin size={16} color={colorScheme.primary} />
              <View style={styles.summaryContent}>
                <Text style={[styles.summaryLabel, { color: colorScheme.subtext }]}>
                  Route
                </Text>
                <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                  {ride.pickup?.name} → {ride.dropoff?.name}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Calendar size={16} color={colorScheme.primary} />
              <View style={styles.summaryContent}>
                <Text style={[styles.summaryLabel, { color: colorScheme.subtext }]}>
                  Schedule
                </Text>
                <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                  {ride.date} at {ride.time}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Users size={16} color={colorScheme.primary} />
              <View style={styles.summaryContent}>
                <Text style={[styles.summaryLabel, { color: colorScheme.subtext }]}>
                  Passengers
                </Text>
                <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                  {ride.passengers} passengers
                </Text>
              </View>
            </View>

            {ride.vehicle && (
              <View style={styles.summaryRow}>
                <Car size={16} color={colorScheme.primary} />
                <View style={styles.summaryContent}>
                  <Text style={[styles.summaryLabel, { color: colorScheme.subtext }]}>
                    Vehicle
                  </Text>
                  <Text style={[styles.summaryValue, { color: colorScheme.text }]}>
                    {ride.vehicle.brand} {ride.vehicle.model}
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />

            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colorScheme.text }]}>
                Total Fare
              </Text>
              <Text style={[styles.totalValue, { color: colorScheme.primary }]}>
                ₹{ride.fare?.total.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.paidLabel, { color: colorScheme.subtext }]}>
                Advance Paid (25%)
              </Text>
              <Text style={[styles.paidValue, { color: '#00C853' }]}>
                ₹{ride.fare?.advancePayment.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="View Details"
              onPress={handleViewDetails}
              style={[styles.primaryButton, { backgroundColor: colorScheme.primary }]}
            />

            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: colorScheme.border }]}
                onPress={handleDownloadReceipt}
              >
                <Download size={18} color={colorScheme.text} />
                <Text style={[styles.secondaryButtonText, { color: colorScheme.text }]}>
                  Receipt
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: colorScheme.border }]}
                onPress={handleBookRide}
              >
                <Car size={18} color={colorScheme.text} />
                <Text style={[styles.secondaryButtonText, { color: colorScheme.text }]}>
                  Book Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  tripSummary: {
    width: '100%',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryContent: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paidLabel: {
    fontSize: 14,
    flex: 1,
  },
  paidValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});