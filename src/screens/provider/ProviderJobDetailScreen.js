/**
 * ProviderJobDetailScreen.js — Full booking details for the provider with status update buttons
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Header from '../../components/Header';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import { formatPrice } from '../../utils/helpers';

const ProviderJobDetailScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const [status, setStatus] = useState(booking.status || 'confirmed');

  const handleStartJob = () => {
    Alert.alert('Start Job', 'Mark this job as in progress?', [
      { text: 'Cancel' },
      { text: 'Start', onPress: () => setStatus('in_progress') },
    ]);
  };

  const handleCompleteJob = () => {
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel' },
      { text: 'Complete', onPress: () => setStatus('completed') },
    ]);
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210').catch(() => Alert.alert('Error', 'Could not open phone app'));
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.textTertiary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Job Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <StatusBadge status={status} size="large" />
        </View>

        {/* Booking Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Details</Text>
          <InfoRow icon="document-text-outline" label="Booking ID" value={booking.bookingId} />
          <InfoRow icon="construct-outline" label="Service" value={booking.serviceName} />
          <InfoRow icon="calendar-outline" label="Date" value={booking.date || booking.dateDisplay || 'N/A'} />
          <InfoRow icon="time-outline" label="Time" value={booking.timeSlot || booking.timeSlotLabel || 'N/A'} />
          <InfoRow icon="cash-outline" label="Payment" value={formatPrice(booking.price)} />
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer</Text>
          <InfoRow icon="person-outline" label="Name" value={booking.customerName || booking.userName || 'Customer'} />
          <InfoRow icon="location-outline" label="Address" value={booking.address || 'Not provided'} />
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={40} color={COLORS.textTertiary} />
          <Text style={styles.mapText}>Customer Location</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button title="Call Customer" variant="outline" icon="call" onPress={handleCall} style={{ marginBottom: 10 }} />
          {status === 'confirmed' || status === 'provider_assigned' || status === 'on_the_way' ? (
            <Button title="Start Job" icon="play" onPress={handleStartJob} />
          ) : status === 'in_progress' ? (
            <Button title="Complete Job" icon="checkmark-circle" onPress={handleCompleteJob} style={{ backgroundColor: COLORS.success }} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 40 },
  statusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 16 },
  statusLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  infoContent: { marginLeft: 12, flex: 1 },
  infoLabel: { fontSize: 12, color: COLORS.textTertiary },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginTop: 2 },
  mapPlaceholder: { height: 160, backgroundColor: COLORS.white, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  mapText: { fontSize: 14, color: COLORS.textTertiary, marginTop: 8 },
  actions: { marginTop: 8 },
});

export default ProviderJobDetailScreen;
