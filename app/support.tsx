import { GlassCard } from '@/components/ui/GlassCard';
import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SupportScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  const supportOptions = [
    {
      id: '1',
      title: 'Call Support',
      description: '24/7 phone support available',
      icon: <Phone size={24} color={colorScheme.primary} />,
      action: 'call',
    },
    {
      id: '2',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <MessageCircle size={24} color={colorScheme.success} />,
      action: 'chat',
    },
    {
      id: '3',
      title: 'Email Support',
      description: 'Send us an email',
      icon: <Mail size={24} color={colorScheme.warning} />,
      action: 'email',
    },
    {
      id: '4',
      title: 'FAQ',
      description: 'Find answers to common questions',
      icon: <HelpCircle size={24} color={colorScheme.error} />,
      action: 'faq',
    },
  ];

  const SupportOption = ({ option }: { option: typeof supportOptions[0] }) => (
    <TouchableOpacity>
      <GlassCard style={styles.optionCard}>
        <View style={styles.optionContent}>
          <View style={[styles.optionIcon, { backgroundColor: colorScheme.border }]}>
            {option.icon}
          </View>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: colorScheme.text }]}>
              {option.title}
            </Text>
            <Text style={[styles.optionDescription, { color: colorScheme.subtext }]}>
              {option.description}
            </Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[
        theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        theme === 'dark' ? '#121212' : '#ffffff',
      ]}
      style={styles.container}
    >
      <View style={[styles.header, { backgroundColor: colorScheme.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text }]}>
          Support
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          How can we help you?
        </Text>
        
        <Text style={[styles.subtitle, { color: colorScheme.subtext }]}>
          Choose from the options below to get the help you need
        </Text>

        <View style={styles.optionsContainer}>
          {supportOptions.map((option) => (
            <SupportOption key={option.id} option={option} />
          ))}
        </View>

        <GlassCard style={styles.emergencyCard}>
          <Text style={[styles.emergencyTitle, { color: colorScheme.error }]}>
            Emergency Support
          </Text>
          <Text style={[styles.emergencyText, { color: colorScheme.text }]}>
            If you're in an emergency situation during a ride, please call emergency services immediately.
          </Text>
          <TouchableOpacity style={[styles.emergencyButton, { backgroundColor: colorScheme.error }]}>
            <Text style={[styles.emergencyButtonText, { color: colorScheme.background }]}>
              Emergency: 911
            </Text>
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  emergencyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});