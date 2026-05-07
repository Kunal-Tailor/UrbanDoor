/**
 * BookingScreen.js — Date/time/address picker with booking confirmation
 * Saves the booking to Firestore when confirmed.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { TIME_SLOTS } from '../../constants/mockData';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { formatPrice, formatDateShort, getNextDays, generateBookingId } from '../../utils/helpers';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

const BookingScreen = ({ route, navigation }) => {
  const { service, provider } = route.params;
  const { user, userData } = useAuth();
  const nextDays = getNextDays(7);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (selectedSlot === null) { Alert.alert('Select Time', 'Please select a time slot'); return; }
    if (!address.trim()) { Alert.alert('Address Required', 'Please enter your address'); return; }

    setLoading(true);
    const bookingId = generateBookingId();
    const dateInfo = formatDateShort(nextDays[selectedDate]);
    const slot = TIME_SLOTS[selectedSlot];

    const bookingData = {
      bookingId,
      userId: user.uid,
      userName: userData?.name || 'Customer',
      userEmail: userData?.email || '',
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      providerId: provider.id,
      providerName: provider.name,
      price: service.price,
      date: dateInfo.full,
      dateDisplay: `${dateInfo.date} ${dateInfo.month}`,
      timeSlot: slot.time,
      timeSlotLabel: slot.label,
      address: address.trim(),
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), bookingData);
      setLoading(false);
      navigation.replace('BookingConfirmation', { booking: { ...bookingData, bookingId } });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
      console.log('Booking error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Book Service" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryName}>{service.name}</Text>
          <Text style={styles.summaryProvider}>By {provider.name}</Text>
          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
            <Text style={styles.summaryText}>{service.duration}</Text>
            <Text style={styles.summaryPrice}>{formatPrice(service.price)}</Text>
          </View>
        </View>

        {/* Date Picker */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {nextDays.map((date, index) => {
            const d = formatDateShort(date);
            const isSelected = selectedDate === index;
            return (
              <TouchableOpacity key={index} style={[styles.dateCard, isSelected && styles.dateCardActive]}
                onPress={() => setSelectedDate(index)} activeOpacity={0.7}>
                <Text style={[styles.dateDay, isSelected && styles.dateTextActive]}>{d.day}</Text>
                <Text style={[styles.dateNum, isSelected && styles.dateTextActive]}>{d.date}</Text>
                <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>{d.month}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slots */}
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map((slot, index) => {
            const isSelected = selectedSlot === index;
            return (
              <TouchableOpacity key={slot.id} style={[styles.slotCard, isSelected && styles.slotCardActive]}
                onPress={() => setSelectedSlot(index)} activeOpacity={0.7}>
                <Ionicons name={slot.icon} size={20} color={isSelected ? COLORS.white : COLORS.primary} />
                <Text style={[styles.slotLabel, isSelected && styles.slotTextActive]}>{slot.label}</Text>
                <Text style={[styles.slotTime, isSelected && styles.slotTextActive]}>{slot.time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Address */}
        <Text style={styles.sectionTitle}>Service Address</Text>
        <Input value={address} onChangeText={setAddress} placeholder="Enter your full address"
          icon="location-outline" multiline numberOfLines={3} />

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Service charge</Text><Text style={styles.priceValue}>{formatPrice(service.price)}</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Platform fee</Text><Text style={styles.priceValue}>₹49</Text></View>
          <View style={styles.divider} />
          <View style={styles.priceRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatPrice(service.price + 49)}</Text></View>
        </View>

        <Button title="Confirm Booking" onPress={handleConfirm} loading={loading} icon="checkmark-circle" style={{ marginBottom: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16 },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  summaryName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  summaryProvider: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  summaryText: { fontSize: 13, color: COLORS.textTertiary, marginLeft: 4, flex: 1 },
  summaryPrice: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  dateRow: { paddingBottom: 4, marginBottom: 24 },
  dateCard: { width: 68, alignItems: 'center', paddingVertical: 12, borderRadius: 14, backgroundColor: COLORS.white, marginRight: 10, borderWidth: 1.5, borderColor: COLORS.border },
  dateCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateDay: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '500' },
  dateNum: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginVertical: 2 },
  dateMonth: { fontSize: 11, color: COLORS.textTertiary },
  dateTextActive: { color: COLORS.white },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  slotCard: { width: '48%', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border },
  slotCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginTop: 6 },
  slotTime: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  slotTextActive: { color: COLORS.white },
  priceCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: 14, color: COLORS.textSecondary },
  priceValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
});

export default BookingScreen;
