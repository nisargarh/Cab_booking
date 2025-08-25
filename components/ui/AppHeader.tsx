import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { MoreVertical } from 'lucide-react-native';
import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AppHeaderProps {
  title?: string;
  onMenuPress: () => void;
  showMenu?: boolean;
}

export function AppHeader({ onMenuPress, showMenu = true }: AppHeaderProps) {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMenuPress();
  };

  return (
    <View style={[styles.header, { backgroundColor: colorScheme.background, borderBottomColor: colorScheme.border }]}>
      <View style={styles.leftContainer}>
        <Image
          // Path: C:\\Users\\dell\\Desktop\\Cab_booking\\assets\\images\\sdm.png
          source={require('../../assets/images/sdm.png')}
          style={styles.logo}
        />
      </View>

      {showMenu ? (
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <MoreVertical size={22} color={colorScheme.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.menuButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 40,
    borderRadius: 6,
  },
  menuButton: {
    padding: 4,
    width: 44,
    alignItems: 'flex-end',
  },
});