import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { DrawerMenu } from '@/components/ui/DrawerMenu';
import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { SavedAddress } from '@/types';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase, Camera, Edit, Home, Mail, MapPin, Phone, Plus, Save, Star, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDrawerVisible(true);
  };
  const [editedName, setEditedName] = useState(user?.name || 'John Doe');
  const [editedEmail, setEditedEmail] = useState(user?.email || 'john.doe@example.com');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '+1 234 567 8900');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', address: '', type: 'other' as 'home' | 'work' | 'other' });
  
  // Mock saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: '1',
      type: 'home',
      name: 'Home',
      address: '123 Main Street, City',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      id: '2',
      type: 'work',
      name: 'Work',
      address: '456 Business Ave, Downtown',
      latitude: 37.7899,
      longitude: -122.4034,
    },
  ]);
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to change profile picture!');
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
  
  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsEditing(false);
    // In a real app, save to backend
    Alert.alert('Success', 'Profile updated successfully!');
  };
  
  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const address: SavedAddress = {
      id: Date.now().toString(),
      type: newAddress.type,
      name: newAddress.name,
      address: newAddress.address,
      latitude: 37.7749, // Mock coordinates
      longitude: -122.4194,
    };
    
    setSavedAddresses([...savedAddresses, address]);
    setNewAddress({ name: '', address: '', type: 'other' });
    setShowAddAddress(false);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('Success', 'Address added successfully!');
  };
  
  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          },
        },
      ]
    );
  };
  
  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    logout();
  };
  
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={16} color={colorScheme.success} />;
      case 'work':
        return <Briefcase size={16} color={colorScheme.primary} />;
      default:
        return <MapPin size={16} color={colorScheme.warning} />;
    }
  };
  
  return (
    <>
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <AppHeader 
          title="Profile" 
          onMenuPress={handleMenuPress}
        />
        
        <LinearGradient
          colors={[
            theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
            theme === 'dark' ? '#121212' : '#ffffff',
          ]}
          style={styles.gradientContainer}
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
            {editedName}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={colorScheme.warning} fill={colorScheme.warning} />
            <Text style={[styles.ratingText, { color: colorScheme.text }]}>
              4.8
            </Text>
            <Text style={[styles.tripCount, { color: colorScheme.subtext }]}>
              (24 trips)
            </Text>
          </View>
        </View>
        
        <GlassCard style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
              Personal Information
            </Text>
            <TouchableOpacity 
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
              style={styles.editButton}
            >
              {isEditing ? (
                <Save size={20} color={colorScheme.success} />
              ) : (
                <Edit size={20} color={colorScheme.primary} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoItem}>
            <Phone size={20} color={colorScheme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                Phone Number
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { color: colorScheme.text, borderColor: colorScheme.border }]}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={colorScheme.subtext}
                />
              ) : (
                <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                  {editedPhone}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={20} color={colorScheme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                Email
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { color: colorScheme.text, borderColor: colorScheme.border }]}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter email"
                  placeholderTextColor={colorScheme.subtext}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                  {editedEmail}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <User size={20} color={colorScheme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colorScheme.subtext }]}>
                Full Name
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { color: colorScheme.text, borderColor: colorScheme.border }]}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter full name"
                  placeholderTextColor={colorScheme.subtext}
                />
              ) : (
                <Text style={[styles.infoValue, { color: colorScheme.text }]}>
                  {editedName}
                </Text>
              )}
            </View>
          </View>
        </GlassCard>
        
        <GlassCard style={styles.statsCard}>
          <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
            Trip Statistics
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colorScheme.text }]}>
                24
              </Text>
              <Text style={[styles.statLabel, { color: colorScheme.subtext }]}>
                Total Trips
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colorScheme.text }]}>
                4.8
              </Text>
              <Text style={[styles.statLabel, { color: colorScheme.subtext }]}>
                Rating
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colorScheme.text }]}>
                $485
              </Text>
              <Text style={[styles.statLabel, { color: colorScheme.subtext }]}>
                Total Spent
              </Text>
            </View>
          </View>
        </GlassCard>
        
        <GlassCard style={styles.addressesCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colorScheme.text }]}>
              Saved Addresses
            </Text>
            <TouchableOpacity 
              onPress={() => setShowAddAddress(!showAddAddress)}
              style={styles.editButton}
            >
              <Plus size={20} color={colorScheme.primary} />
            </TouchableOpacity>
          </View>
          
          {savedAddresses.map((address) => (
            <TouchableOpacity 
              key={address.id}
              style={styles.addressItem}
              onLongPress={() => handleDeleteAddress(address.id)}
            >
              {getAddressIcon(address.type)}
              <View style={styles.addressContent}>
                <Text style={[styles.addressLabel, { color: colorScheme.text }]}>
                  {address.name}
                </Text>
                <Text style={[styles.addressText, { color: colorScheme.subtext }]}>
                  {address.address}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {showAddAddress && (
            <GlassCard style={styles.addAddressForm}>
              <Text style={[styles.formTitle, { color: colorScheme.text }]}>
                Add New Address
              </Text>
              
              <TextInput
                style={[styles.formInput, { color: colorScheme.text, borderColor: colorScheme.border }]}
                placeholder="Address name (e.g., Home, Office)"
                placeholderTextColor={colorScheme.subtext}
                value={newAddress.name}
                onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
              />
              
              <TextInput
                style={[styles.formInput, { color: colorScheme.text, borderColor: colorScheme.border }]}
                placeholder="Full address"
                placeholderTextColor={colorScheme.subtext}
                value={newAddress.address}
                onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
                multiline
              />
              
              <View style={styles.typeSelector}>
                {(['home', 'work', 'other'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      { 
                        borderColor: newAddress.type === type ? colorScheme.primary : colorScheme.border,
                        backgroundColor: newAddress.type === type ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                      }
                    ]}
                    onPress={() => setNewAddress({ ...newAddress, type })}
                  >
                    <Text style={[
                      styles.typeText, 
                      { color: newAddress.type === type ? colorScheme.primary : colorScheme.text }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.formButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowAddAddress(false)}
                  variant="outlined"
                  style={styles.formButton}
                />
                <Button
                  title="Add"
                  onPress={handleAddAddress}
                  style={styles.formButton}
                />
              </View>
            </GlassCard>
          )}
        </GlassCard>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outlined"
          style={styles.logoutButton}
        />
          </ScrollView>
        </LinearGradient>
      </View>

      <DrawerMenu 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
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
  infoCard: {
    // padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statsCard: {
    // padding: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  addressesCard: {
    // padding: 16,
    marginBottom: 24,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  addressContent: {
    marginLeft: 12,
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
  },
  addAddressForm: {
    padding: 16,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  logoutButton: {
    
  },
});