import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { Vehicle } from '@/types';
import { Image } from 'expo-image';
import { Star, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlassCard } from '../ui/GlassCard';

interface CarCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  isSelected?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  vehicle,
  onSelect,
  isSelected = false,
}) => {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  return (
    <TouchableOpacity
      onPress={() => onSelect(vehicle)}
      activeOpacity={0.8}
      style={styles.container}
    >
      <GlassCard
        style={[
          styles.card,
          isSelected && { 
            borderColor: colorScheme.primary, 
            borderWidth: 2,
            backgroundColor: 'rgba(0, 255, 0, 0.1)'
          }
        ]}
        intensity={isSelected ? 80 : 50}
      >
        <Image
          source={{ uri: vehicle.image }}
          style={styles.carImage}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.carName, { color: colorScheme.text }]}>
              {vehicle.name}
            </Text>
            <Text style={[styles.carPrice, { color: colorScheme.primary }]}>
              ${vehicle.price}
            </Text>
          </View>
          
          <Text style={[styles.carType, { color: colorScheme.subtext }]}>
            {vehicle.type}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Users size={16} color={colorScheme.primary} />
              <Text style={[styles.detailText, { color: colorScheme.text }]}>
                {vehicle.seatingCapacity} seater
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Star size={16} color={colorScheme.warning} fill={colorScheme.warning} />
              <Text style={[styles.detailText, { color: colorScheme.text }]}>
                {vehicle.rating}
              </Text>
            </View>
          </View>
          
          <View style={styles.features}>
            {vehicle.features.map((feature, index) => (
              <View 
                key={index} 
                style={[styles.featureTag, { backgroundColor: colorScheme.border }]}
              >
                <Text style={[styles.featureText, { color: colorScheme.text }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
  },
  carImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carType: {
    fontSize: 14,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
  },
});