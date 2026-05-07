/**
 * TrackBookingScreen.js — Real-time booking status tracker with stepper and mock map
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { PROVIDERS } from '../../constants/mockData';

const STEPS = [
  { key: 'confirmed', label: 'Booking Confirmed', icon: 'checkmark-circle', desc: 'Your booking has been confirmed' },
  { key: 'provider_assigned', label: 'Provider Assigned', icon: 'person', desc: 'A provider has been assigned to your job' },
  { key: 'on_the_way', label: 'On the Way', icon: 'car', desc: 'Provider is heading to your location' },
  { key: 'in_progress', label: 'In Progress', icon: 'construct', desc: 'Service is currently being performed' },
  { key: 'completed', label: 'Completed', icon: 'trophy', desc: 'Service completed successfully!' },
];

const TrackBookingScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const [currentStatus, setCurrentStatus] = useState(booking.status || 'confirmed');
  const provider = PROVIDERS.find(p => p.id === booking.providerId) || PROVIDERS[0];

  const currentStepIndex = STEPS.findIndex(s => s.key === currentStatus);
  const canCancel = currentStepIndex < 1; // Only before provider assigned

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => navigation.popToTop() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Track Booking" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Booking ID */}
        <View style={styles.idCard}>
          <Text style={styles.idLabel}>Booking ID</Text>
          <Text style={styles.idValue}>{booking.bookingId}</Text>
        </View>

        {/* Status Stepper */}
        <View style={styles.stepper}>
          {STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <View key={step.key} style={styles.stepRow}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepCircle, isCompleted && styles.stepCircleActive, isCurrent && styles.stepCircleCurrent]}>
                    <Ionicons name={step.icon} size={16} color={isCompleted ? COLORS.white : COLORS.textTertiary} />
                  </View>
                  {index < STEPS.length - 1 && (
                    <View style={[styles.stepLine, isCompleted && styles.stepLineActive]} />
                  )}
                </View>
                <View style={[styles.stepContent, isCurrent && styles.stepContentCurrent]}>
                  <Text style={[styles.stepLabel, isCompleted && styles.stepLabelActive]}>{step.label}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Provider Card */}
        <Text style={styles.sectionTitle}>Service Provider</Text>
        <View style={styles.providerCard}>
          <Image source={{ uri: provider.profileImage }} style={styles.providerImage} />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.providerRatingRow}>
              <Ionicons name="star" size={13} color={COLORS.secondary} />
              <Text style={styles.providerRating}>{provider.rating}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Mock Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={COLORS.textTertiary} />
          <Text style={styles.mapText}>Live map tracking</Text>
          <Text style={styles.mapSubtext}>Provider location will appear here</Text>
        </View>

        {/* Cancel Button */}
        {canCancel && (
          <Button title="Cancel Booking" variant="outline" icon="close-circle" onPress={handleCancel}
            style={{ borderColor: COLORS.error, marginBottom: 30 }}
            textStyle={{ color: COLORS.error }} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16 },
  idCard: { backgroundColor: COLORS.primarySoft, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  idLabel: { fontSize: 13, color: COLORS.textSecondary },
  idValue: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  stepper: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', minHeight: 72 },
  stepIndicator: { alignItems: 'center', width: 40 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.divider, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: COLORS.success },
  stepCircleCurrent: { backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  stepLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  stepLineActive: { backgroundColor: COLORS.success },
  stepContent: { flex: 1, marginLeft: 12, paddingBottom: 16 },
  stepContentCurrent: { backgroundColor: COLORS.primarySoft, marginLeft: 8, padding: 12, borderRadius: 12, marginBottom: 8 },
  stepLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textTertiary },
  stepLabelActive: { color: COLORS.textPrimary },
  stepDesc: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  providerImage: { width: 48, height: 48, borderRadius: 14, marginRight: 12 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  providerRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  providerRating: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginLeft: 4 },
  callButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center' },
  mapPlaceholder: { height: 200, backgroundColor: COLORS.white, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  mapText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary, marginTop: 8 },
  mapSubtext: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
});

export default TrackBookingScreen;
