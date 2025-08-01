import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    HelpCircle,
    History,
    Home,
    LogOut,
    Moon,
    Settings,
    Shield,
    Star,
    User,
    X
} from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (route: string) => {
    console.log('🚀 Attempting navigation to:', route);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onClose();
    
    // Add delay to ensure drawer closes first
    setTimeout(() => {
      try {
        console.log('🔄 Executing router.push to:', route);
        router.push(route as any);
      } catch (error) {
        console.error('❌ Navigation error:', error);
        Alert.alert('Navigation Error', `Failed to navigate to ${route}`);
      }
    }, 300);
  };

  const handleLogout = () => {
    console.log('🚪 Attempting logout...');
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            console.log('✅ User confirmed logout');
            
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            
            onClose();
            
            setTimeout(() => {
              try {
                console.log('🔄 Executing logout...');
                logout();
                console.log('🔄 Navigating to auth selection...');
                router.replace('/(auth)/auth-selection');
              } catch (error) {
                console.error('❌ Logout error:', error);
                // Force navigation even if logout fails
                router.replace('/');
              }
            }, 300);
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };

  const MenuItem = ({ 
    icon, 
    title, 
    onPress, 
    showToggle = false, 
    toggleValue = false, 
    onToggle,
    isLogout = false
  }: {
    icon: React.ReactNode;
    title: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: () => void;
    isLogout?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: '#FFFFFF' }]} 
      onPress={() => {
        console.log('🔘 Menu item pressed:', title);
        onPress?.();
      }}
      disabled={showToggle}
      activeOpacity={0.7}
    >
      <View style={styles.menuIcon}>
        {icon}
      </View>
      
      <Text style={[
        styles.menuTitle, 
        { 
          color: isLogout ? '#EF4444' : '#000000',
          flex: 1,
          backgroundColor: 'transparent'
        }
      ]}>
        {title}
      </Text>
      
      {showToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ 
            false: 'rgba(0, 0, 0, 0.15)', 
            true: '#22C55E' 
          }}
          thumbColor="#FFFFFF"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        {/* Backdrop */}
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        {/* Drawer */}
        <View style={[styles.drawer, { backgroundColor: '#FFFFFF' }]}>
          <View style={[styles.drawerContent, { backgroundColor: '#FFFFFF' }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: '#FFFFFF' }]}>
              <View style={[styles.headerTop, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.menuText, { color: '#666666', backgroundColor: 'transparent' }]}>
                  Menu
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#000000" />
                </TouchableOpacity>
              </View>
              
              {/* User Profile Section */}
              <TouchableOpacity 
                style={[styles.userSection, { backgroundColor: 'transparent' }]}
                onPress={() => {
                  console.log('👤 Profile section pressed');
                  handleNavigation('/(rider-tabs)/profile');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, { backgroundColor: '#000000' }]}>
                  <User size={24} color="#FFFFFF" />
                </View>
                <View style={[styles.userInfo, { backgroundColor: 'transparent' }]}>
                  <Text style={[styles.userName, { color: '#000000', backgroundColor: 'transparent' }]}>
                    {user?.name || 'John Doe'}
                  </Text>
                  <Text style={[styles.userEmail, { color: '#666666', backgroundColor: 'transparent' }]}>
                    {user?.email || 'john.doe@example.com'}
                  </Text>
                  <View style={[styles.ratingContainer, { backgroundColor: 'transparent' }]}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={[styles.ratingText, { color: '#666666', backgroundColor: 'transparent' }]}>
                      4.8 • 24 trips
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={[styles.menuContainer, { backgroundColor: '#FFFFFF' }]} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ backgroundColor: '#FFFFFF' }}
            >
              <MenuItem
                icon={<Home size={20} color="#000000" />}
                title="Home"
                onPress={() => handleNavigation('/(rider-tabs)')}
              />

              <MenuItem
                icon={<History size={20} color="#000000" />}
                title="Your Rides"
                onPress={() => handleNavigation('/(rider-tabs)/trips')}
              />

              <MenuItem
                icon={<Star size={20} color="#000000" />}
                title="Offers"
                onPress={() => handleNavigation('/offers')}
              />

              <MenuItem
                icon={<HelpCircle size={20} color="#000000" />}
                title="Support"
                onPress={() => handleNavigation('/support')}
              />

              <MenuItem
                icon={<Moon size={20} color="#000000" />}
                title="Dark Mode"
                showToggle={true}
                toggleValue={theme === 'dark'}
                onToggle={handleToggleDarkMode}
              />

              <MenuItem
                icon={<Settings size={20} color="#000000" />}
                title="Settings"
                onPress={() => handleNavigation('/settings')}
              />

              <MenuItem
                icon={<Shield size={20} color="#000000" />}
                title="Safety"
                onPress={() => handleNavigation('/safety')}
              />

              <View style={[styles.divider, { backgroundColor: 'rgba(0, 0, 0, 0.15)' }]} />

              <MenuItem
                icon={<LogOut size={20} color="#EF4444" />}
                title="Sign Out"
                onPress={handleLogout}
                isLogout={true}
              />
              
              {/* Extra spacing at bottom */}
              <View style={{ height: 50, backgroundColor: '#FFFFFF' }} />
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: screenWidth * 0.85,
    maxWidth: 320,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#000000',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: '#000000',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666666',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  menuIcon: {
    width: 24,
    marginRight: 16,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});