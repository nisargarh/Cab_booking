import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import colors from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';
import * as Linking from 'expo-linking';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, HelpCircle, Phone, ShieldAlert } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// FAQ item type
type FaqItem = {
  id: string;
  category: 'booking' | 'payment' | 'safety';
  question: string;
  answer: string;
};

const ALL_FAQS: FaqItem[] = [
  // Booking & Rides
  { id: 'b1', category: 'booking', question: 'How do I book a ride?', answer: 'Go to Home, enter pickup and drop, pick date/time, then choose a car.' },
  { id: 'b2', category: 'booking', question: 'Can I cancel my booking?', answer: 'Yes. Open Trips, select the booking, and tap Cancel (cancellation policy applies).' },
  { id: 'b3', category: 'booking', question: 'How do I modify my booking?', answer: 'Open Trips, choose your trip, and tap Modify to change time or details.' },
  { id: 'b4', category: 'booking', question: 'Can I schedule a ride in advance?', answer: 'Yes, pick a future time from the time picker while booking.' },
  // Payment & Billing
  { id: 'p1', category: 'payment', question: 'What payment methods are accepted?', answer: 'Cards, UPI, wallets, and cash (where available).' },
  { id: 'p2', category: 'payment', question: 'How is the fare calculated?', answer: 'Base fare + distance/time charges + taxes; surge and tolls may apply.' },
  { id: 'p3', category: 'payment', question: 'Can I get a receipt for my ride?', answer: 'Yes, view and download invoices from Billing History.' },
  { id: 'p4', category: 'payment', question: 'How do refunds work?', answer: 'Eligible refunds are processed to the original payment method within 5–7 days.' },
  // Safety & Security
  { id: 's1', category: 'safety', question: 'How do you ensure rider safety?', answer: 'Verified driver profiles, trip tracking, SOS options, and 24/7 helpline.' },
  { id: 's2', category: 'safety', question: 'What should I do in case of emergency?', answer: 'Use Emergency Call or Safety Helpline and share your live location.' },
];

export default function FAQScreen() {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'booking' | 'payment' | 'safety'>('all');
  const [page, setPage] = useState(0); // for 4-per-slide carousel
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filteredFaqs = useMemo(() => {
    const list = category === 'all' ? ALL_FAQS : ALL_FAQS.filter(f => f.category === category);
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }, [category, query]);

  // 4 per slide (as requested)
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / pageSize));
  const currentItems = filteredFaqs.slice(page * pageSize, page * pageSize + pageSize);

  const goPrev = () => setPage(p => Math.max(0, p - 1));
  const goNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

  const toggleItem = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const CategoryChip = ({ label, value }: { label: string; value: 'all' | 'booking' | 'payment' | 'safety' }) => (
    <TouchableOpacity
      onPress={() => { setCategory(value); setPage(0); }}
      style={[
        styles.chip,
        { borderColor: colorScheme.border, backgroundColor: category === value ? 'rgba(22,163,74,0.15)' : colorScheme.card }
      ]}
    >
      <Text style={{ color: category === value ? colorScheme.primary : colorScheme.text, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );

  const callNumber = (num: string) => Linking.openURL(`tel:${num}`);
  const openChat = () => Linking.openURL('https://example.com/support');
  const shareLocation = () => Linking.openURL('sms:&body=Sharing my location via SDM App');

  return (
    <View style={{ flex: 1, backgroundColor: colorScheme.background }}>
      <AppHeader onMenuPress={() => {}} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Search */}
        <View style={[styles.searchBox, { borderColor: colorScheme.border, backgroundColor: colorScheme.card }]}> 
          <TextInput
            placeholder="Search FAQs..."
            placeholderTextColor={colorScheme.subtext}
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, color: colorScheme.text }}
          />
          {/* <Filter size={18} color={colorScheme.subtext} /> */}
        </View>

        {/* Filters (single horizontal row, scrollable) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          style={{ marginBottom: 16 }}
        >
          <CategoryChip label="All Categories" value="all" />
          <CategoryChip label="Booking & Rides" value="booking" />
          <CategoryChip label="Payment & Billing" value="payment" />
          <CategoryChip label="Safety & Security" value="safety" />
        </ScrollView>

        {/* Title */}
        <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>Frequently Asked Questions</Text>
        <Text style={{ color: colorScheme.subtext, marginBottom: 12 }}>Browse through 4 questions per slide</Text>

        {/* Carousel list with collapsible answers */}
        <View style={{ gap: 12 }}>
          {currentItems.map(item => {
            const isOpen = !!expanded[item.id];
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => toggleItem(item.id)}
                style={[styles.card, { backgroundColor: colorScheme.card, borderColor: colorScheme.border, shadowColor: colorScheme.shadow }]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <View style={[ { backgroundColor: colorScheme.card, borderColor: colorScheme.primary }]}>
                      <Text style={{ color: colorScheme.primary, fontWeight: '600' }}>
                        {item.category === 'booking' ? 'Booking & Rides' : item.category === 'payment' ? 'Payment & Billing' : 'Safety & Security'}
                      </Text>
                    </View>
                    <Text style={{ color: colorScheme.text, fontWeight: '700', fontSize: 16, marginTop: 6 }}>{item.question}</Text>
                  </View>
                  {isOpen ? <ChevronUp size={18} color={colorScheme.subtext} /> : <ChevronDown size={18} color={colorScheme.subtext} />}
                </View>
                {isOpen && (
                  <Text style={{ color: colorScheme.subtext, marginTop: 8 }}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Carousel nav */}
          <View style={styles.carouselNav}>
            <TouchableOpacity onPress={goPrev} disabled={page === 0} style={[styles.navBtn, { borderColor: colorScheme.border, backgroundColor: colorScheme.card, opacity: page === 0 ? 0.5 : 1 }]}>
              <ChevronLeft size={18} color={colorScheme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goNext} disabled={page >= totalPages - 1} style={[styles.navBtn, { borderColor: colorScheme.border, backgroundColor: colorScheme.card, opacity: page >= totalPages - 1 ? 0.5 : 1 }]}>
              <ChevronRight size={18} color={colorScheme.text} />
            </TouchableOpacity>
          </View>

          {/* Dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 6 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <View key={i} style={{ width: 6, height: 6, borderRadius: 3, marginHorizontal: 4, backgroundColor: i === page ? colorScheme.primary : colorScheme.border }} />
            ))}
          </View>
        </View>

        {/* Emergency Support section */}
        <View style={[styles.sectionCard, { backgroundColor: colorScheme.card, borderColor: colorScheme.border }]}> 
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <ShieldAlert size={18} color={colorScheme.error} />
            <Text style={[styles.sectionTitle, { marginLeft: 8, color: colorScheme.text }]}>Emergency Support</Text>
          </View>

          <Button title="Emergency Call - 911" onPress={() => callNumber('911')} style={{ backgroundColor: '#EF4444' }} />

          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBox, { borderColor: colorScheme.border, backgroundColor: 'rgba(239,68,68,0.08)' }]} onPress={() => callNumber('911')}>
              <Phone size={20} color={'#EF4444'} />
              <Text style={{ color: colorScheme.text, fontWeight: '600', marginTop: 8 }}>Safety Helpline</Text>
              <Text style={{ color: colorScheme.subtext, fontSize: 12 }}>24/7 Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBox, { borderColor: colorScheme.border, backgroundColor: 'rgba(245,158,11,0.08)' }]} onPress={shareLocation}>
              <HelpCircle size={20} color={'#F59E0B'} />
              <Text style={{ color: colorScheme.text, fontWeight: '600', marginTop: 8 }}>Share Location</Text>
              <Text style={{ color: colorScheme.subtext, fontSize: 12 }}>Send to contacts</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subHeader, { color: colorScheme.text }]}>Emergency Services</Text>

          {[{label: 'Police', sub: 'Emergency: 100'}, {label: 'Medical Emergency', sub: 'Ambulance: 108'}, {label: 'SDM Safety Team', sub: '24/7 Available'}].map((item, idx) => (
            <TouchableOpacity key={idx} style={[styles.listItem, { borderColor: colorScheme.border, backgroundColor: colorScheme.card }]} onPress={() => callNumber(idx === 0 ? '100' : idx === 1 ? '108' : '911')}>
              <Text style={{ color: colorScheme.text, fontWeight: '600' }}>{item.label}</Text>
              <ChevronRight size={18} color={colorScheme.subtext} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Tips (separate card) */}
        <View style={[styles.tipsBox, { backgroundColor: '#16A34A)', borderColor: colorScheme.primary }]}>
          <Text style={{ color: colorScheme.text, fontWeight: '700', marginBottom: 8 }}>Safety Tips</Text>
          {[
            'Always share your trip details with family or friends',
            'Verify driver details before getting into the vehicle',
            'Keep your phone charged and emergency contacts updated',
            "Trust your instincts and don't hesitate to ask for help",
          ].map((tip, i) => (
            <Text key={i} style={{ color: colorScheme.text, marginBottom: 4 }}>• {tip}</Text>
          ))}
        </View>

        {/* Non-emergency help */}
        <View style={[styles.supportBox, { borderColor: colorScheme.primary }]}>
          <HelpCircle size={28} color={colorScheme.primary} />
          <Text style={{ color: colorScheme.text, fontWeight: '700', marginTop: 8 }}>Need non-emergency help?</Text>
          <Text style={{ color: colorScheme.subtext, textAlign: 'center', marginTop: 4 }}>For booking issues, payment queries, or general support</Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button title="Call Support" onPress={() => callNumber('1800123456')}  variant="outlined" style={{ flex: 1 }} />
            <Button title="Live Chat" onPress={openChat} variant="outlined" style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  carouselNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  navBtn: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionCard: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  tipsBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  supportBox: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
});