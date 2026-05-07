/**
 * BookingConfirmationScreen.js — Success screen after booking is created
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Button from '../../components/Button';
import { formatPrice } from '../../utils/helpers';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="checkmark" size={48} color={COLORS.white} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your service has been booked successfully</Text>

        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.label}>Booking ID</Text><Text style={styles.value}>{booking.bookingId}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.label}>Service</Text><Text style={styles.value}>{booking.serviceName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.value}>{booking.dateDisplay}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Time</Text><Text style={styles.value}>{booking.timeSlotLabel}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Provider</Text><Text style={styles.value}>{booking.providerName}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatPrice(booking.price + 49)}</Text></View>
        </View>

        <Button title="Track Booking" icon="location" onPress={() => navigation.replace('TrackBooking', { booking })} style={{ marginBottom: 12 }} />
        <Button title="Go Home" variant="outline" icon="home" onPress={() => navigation.popToTop()} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', paddingHorizontal: 24 },
  checkCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  content: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, width: '100%', marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 13, color: COLORS.textSecondary },
  value: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 4 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
});

export default BookingConfirmationScreen;
