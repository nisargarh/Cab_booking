import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    CreditCard,
    HelpCircle,
    History,
    Home,
    LogOut,
    Moon,
    Settings,
    Shield,
    Star,
    User,
    Wallet,
    X
} from 'lucide-react-native';
import React from 'react';
import {
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
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  const handleNavigation = (route: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
    router.push(route as any);
  };

  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onClose();
    logout();
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
      style={styles.menuItem} 
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={styles.menuIcon}>
        {icon}
      </View>
      
      <Text style={[
        styles.menuTitle, 
        { 
          color: isLogout ? colorScheme.error : colorScheme.text,
          flex: 1
        }
      ]}>
        {title}
      </Text>
      
      {showToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ 
            false: colorScheme.border, 
            true: colorScheme.success 
          }}
          thumbColor={colorScheme.background}
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
    >
      <View style={styles.overlay}>
        <View style={[styles.drawer, { backgroundColor: colorScheme.background }]}>
          <LinearGradient
            colors={[
              theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
              theme === 'dark' ? '#1a1a1a' : '#ffffff',
            ]}
            style={styles.drawerContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={[styles.menuText, { color: colorScheme.subtext }]}>
                  Menu
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colorScheme.text} />
                </TouchableOpacity>
              </View>
              
              {/* User Profile Section */}
              <View style={styles.userSection}>
                <View style={[styles.avatar, { backgroundColor: colorScheme.primary }]}>
                  <User size={24} color={theme === 'dark' ? colors.dark.background : colors.light.background} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colorScheme.text }]}>
                    {user?.name || 'John Doe'}
                  </Text>
                  <Text style={[styles.userEmail, { color: colorScheme.subtext }]}>
                    {user?.email || 'john.doe@example.com'}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color={colorScheme.warning} fill={colorScheme.warning} />
                    <Text style={[styles.ratingText, { color: colorScheme.subtext }]}>
                      4.8 • 24 trips
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
              <MenuItem
                icon={<Home size={20} color={colorScheme.text} />}
                title="Home"
                onPress={() => handleNavigation('/(rider-tabs)/')}
              />

              <MenuItem
                icon={<History size={20} color={colorScheme.text} />}
                title="Your Rides"
                onPress={() => handleNavigation('/(rider-tabs)/trips')}
              />

              <MenuItem
                icon={<Wallet size={20} color={colorScheme.text} />}
                title="Wallet"
                onPress={() => handleNavigation('/payment-methods')}
              />

              <MenuItem
                icon={<Star size={20} color={colorScheme.text} />}
                title="Offers"
                onPress={() => handleNavigation('/offers')}
              />

              <MenuItem
                icon={<HelpCircle size={20} color={colorScheme.text} />}
                title="Support"
                onPress={() => handleNavigation('/support')}
              />

              <MenuItem
                icon={<Moon size={20} color={colorScheme.text} />}
                title="Dark Mode"
                showToggle={true}
                toggleValue={theme === 'dark'}
                onToggle={handleToggleDarkMode}
              />

              <MenuItem
                icon={<Settings size={20} color={colorScheme.text} />}
                title="Settings"
                onPress={() => handleNavigation('/settings')}
              />

              <MenuItem
                icon={<Shield size={20} color={colorScheme.text} />}
                title="Safety"
                onPress={() => handleNavigation('/safety')}
              />

              <MenuItem
                icon={<CreditCard size={20} color={colorScheme.text} />}
                title="Payment Methods"
                onPress={() => handleNavigation('/payment-methods')}
              />

              <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />

              <MenuItem
                icon={<LogOut size={20} color={colorScheme.error} />}
                title="Sign Out"
                onPress={handleLogout}
                isLogout={true}
              />
            </ScrollView>
          </LinearGradient>
        </View>
        
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
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
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  },
});