import { DocumentUpload } from '@/components/driver/DocumentUpload';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Shield, Star, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DriverProfileScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState({
    license: false,
    registration: false,
    insurance: false,
    identity: false,
  });
  
  const handleDocumentUpload = (type: keyof typeof documents, uri: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setDocuments(prev => ({
      ...prev,
      [type]: true,
    }));
  };
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to change profile picture!');
        return;
      }
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profilePlaceholder, { backgroundColor: colorScheme.border }]}>
                <User size={40} color={colorScheme.primary} />
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.cameraButton, { backgroundColor: colorScheme.primary }]}
              onPress={pickImage}
            >
              <Camera size={16} color={theme === 'dark' ? colors.dark.background : colors.light.background} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.profileName, { color: colorScheme.text }]}>
            {user?.name || 'Alex Johnson'}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={colorScheme.warning} fill={colorScheme.warning} />
            <Text style={[styles.ratingText, { color: colorScheme.text }]}>
              4.8
            </Text>
            <Text style={[styles.tripCount, { color: colorScheme.subtext }]}>
              (48 trips)
            </Text>
          </View>
        </View>
        
        <GlassCard style={styles.vehicleCard}>
          <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
            Vehicle Information
          </Text>
          
          <View style={styles.vehicleInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                Vehicle Model
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                Toyota Camry
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                Year
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                2022
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                Color
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                White
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                License Plate
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                ABC 123
              </Text>
            </View>
          </View>
        </GlassCard>
        
        <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>
          Documents
        </Text>
        
        <View style={styles.documentsContainer}>
          <DocumentUpload
            title="Driver's License"
            description="Upload a clear photo of your valid driver's license"
            onUpload={(uri) => handleDocumentUpload('license', uri)}
            isUploaded={documents.license}
          />
          
          <DocumentUpload
            title="Vehicle Registration"
            description="Upload your vehicle registration certificate"
            onUpload={(uri) => handleDocumentUpload('registration', uri)}
            isUploaded={documents.registration}
          />
          
          <DocumentUpload
            title="Insurance"
            description="Upload your valid vehicle insurance document"
            onUpload={(uri) => handleDocumentUpload('insurance', uri)}
            isUploaded={documents.insurance}
          />
          
          <DocumentUpload
            title="Identity Proof"
            description="Upload government issued ID (passport, SSN, etc.)"
            onUpload={(uri) => handleDocumentUpload('identity', uri)}
            isUploaded={documents.identity}
          />
        </View>
        
        <GlassCard style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <Shield size={24} color={colorScheme.primary} />
            <Text style={[styles.verificationTitle, { color: colorScheme.text }]}>
              Verification Status
            </Text>
          </View>
          
          <View style={[
            styles.verificationStatus,
            { 
              backgroundColor: Object.values(documents).every(Boolean) 
                ? colorScheme.success 
                : colorScheme.warning 
            }
          ]}>
            <Text style={styles.verificationStatusText}>
              {Object.values(documents).every(Boolean) 
                ? 'Verified' 
                : 'Pending Verification'
              }
            </Text>
          </View>
          
          <Text style={[styles.verificationText, { color: colorScheme.subtext }]}>
            {Object.values(documents).every(Boolean) 
              ? 'All documents have been verified. You are good to go!' 
              : 'Please upload all required documents for verification.'
            }
          </Text>
        </GlassCard>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  tripCount: {
    marginLeft: 4,
    fontSize: 14,
  },
  vehicleCard: {
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  vehicleInfo: {
    
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  documentsContainer: {
    marginBottom: 24,
  },
  verificationCard: {
    padding: 16,
    marginBottom: 24,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  verificationStatus: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  verificationStatusText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  verificationText: {
    fontSize: 14,
    lineHeight: 20,
  },
});