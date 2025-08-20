import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { Menu, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppHeaderProps {
  title: string;
  onMenuPress: () => void;
  showMenu?: boolean;
}

export function AppHeader({ title, onMenuPress, showMenu = true }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMenuPress();
  };

  const handleThemeToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };

  return (
    <View style={[styles.header, { backgroundColor: colorScheme.background }]}>
      <View style={styles.leftContainer}>
        {showMenu ? (
          <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
            <Menu size={24} color={colorScheme.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.menuButton} />
        )}
        
        <Text style={[styles.headerTitle, { color: colorScheme.text }]}>
          {title}
        </Text>
      </View>
      
      <TouchableOpacity onPress={handleThemeToggle} style={styles.themeButton}>
        {theme === 'dark' ? (
          <Sun size={24} color={colorScheme.text} />
        ) : (
          <Moon size={24} color={colorScheme.text} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
    width: 32,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 4,
    width: 32,
    alignItems: 'center',
  },
});