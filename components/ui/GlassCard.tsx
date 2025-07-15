import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'default' | 'light' | 'dark' | 'accent';
  style?: any;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 50,
  tint = 'default',
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const getTintColor = () => {
    switch (tint) {
      case 'light':
        return 'rgba(255, 255, 255, 0.8)';
      case 'dark':
        return 'rgba(0, 0, 0, 0.8)';
      case 'accent':
        return colorScheme.accent;
      default:
        return theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    }
  };

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: getTintColor(),
            borderColor: colorScheme.border,
            ...theme === 'dark' ? styles.shadowDark : styles.shadowLight,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={theme === 'dark' ? 'dark' : 'light'}
      style={[
        styles.container,
        {
          borderColor: colorScheme.border,
          ...theme === 'dark' ? styles.shadowDark : styles.shadowLight,
        },
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={[
          getTintColor(),
          tint === 'accent' ? getTintColor() : 'transparent',
        ]}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  shadowLight: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  shadowDark: {
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});