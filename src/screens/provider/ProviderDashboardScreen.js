/**
 * ProviderDashboardScreen.js — Provider's main screen with stats, incoming requests, and active jobs
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatPrice, getGreeting } from '../../utils/helpers';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const ProviderDashboardScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);

  // Mock incoming requests for demo
  const incomingRequests = [
    { id: 'b1', bookingId: 'SN-001', customerName: 'Priya Mehta', customerImage: 'https://randomuser.me/api/portraits/women/1.jpg', serviceName: 'Full Home Cleaning', date: '15 Dec', timeSlot: '09:00 AM - 12:00 PM', address: '123 MG Road, Mumbai', price: 1499, status: 'confirmed' },
    { id: 'b2', bookingId: 'SN-002', customerName: 'Rahul Nair', customerImage: 'https://randomuser.me/api/portraits/men/8.jpg', serviceName: 'Bathroom Cleaning', date: '15 Dec', timeSlot: '12:00 PM - 03:00 PM', address: '45 Andheri West, Mumbai', price: 599, status: 'confirmed' },
  ];

  const activeJobs = [
    { id: 'b3', bookingId: 'SN-003', customerName: 'Sneha Reddy', serviceName: 'Kitchen Cleaning', status: 'in_progress', price: 899 },
  ];

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.name}>{userData?.name || 'Provider'}</Text>
          </View>
          <View style={[styles.onlineBadge, { backgroundColor: userData?.isOnline ? COLORS.successLight : COLORS.divider }]}>
            <View style={[styles.onlineDot, { backgroundColor: userData?.isOnline ? COLORS.success : COLORS.textTertiary }]} />
            <Text style={[styles.onlineText, { color: userData?.isOnline ? COLORS.success : COLORS.textTertiary }]}>
              {userData?.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="briefcase" label="Today's Jobs" value="3" color={COLORS.primary} />
          <StatCard icon="wallet" label="Earnings" value="₹4,497" color={COLORS.success} />
          <StatCard icon="star" label="Rating" value={userData?.rating?.toFixed(1) || '4.8'} color={COLORS.secondary} />
        </View>

        {/* Incoming Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incoming Requests</Text>
          {incomingRequests.length === 0 ? (
            <EmptyState icon="notifications-off-outline" title="No new requests" message="New booking requests will appear here" style={{ paddingVertical: 30 }} />
          ) : (
            incomingRequests.map(req => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestTop}>
                  <Image source={{ uri: req.customerImage }} style={styles.customerImage} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.customerName}>{req.customerName}</Text>
                    <Text style={styles.requestService}>{req.serviceName}</Text>
                    <View style={styles.requestMeta}>
                      <Ionicons name="calendar-outline" size={12} color={COLORS.textTertiary} />
                      <Text style={styles.metaText}>{req.date}, {req.timeSlot}</Text>
                    </View>
                  </View>
                  <Text style={styles.requestPrice}>{formatPrice(req.price)}</Text>
                </View>
                <View style={styles.requestAddress}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textTertiary} />
                  <Text style={styles.addressText} numberOfLines={1}>{req.address}</Text>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.rejectBtn}><Text style={styles.rejectText}>Reject</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => navigation.navigate('ProviderJobDetail', { booking: req })}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Active Jobs */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Active Jobs</Text>
          {activeJobs.map(job => (
            <TouchableOpacity key={job.id} style={styles.activeJobCard}
              onPress={() => navigation.navigate('ProviderJobDetail', { booking: job })}>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobService}>{job.serviceName}</Text>
                <Text style={styles.jobCustomer}>{job.customerName}</Text>
              </View>
              <StatusBadge status={job.status} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16, paddingBottom: 8 },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  onlineText: { fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  requestCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  requestTop: { flexDirection: 'row', alignItems: 'flex-start' },
  customerImage: { width: 44, height: 44, borderRadius: 14, marginRight: 12 },
  requestInfo: { flex: 1 },
  customerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  requestService: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  requestMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { fontSize: 11, color: COLORS.textTertiary, marginLeft: 4 },
  requestPrice: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  requestAddress: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.divider },
  addressText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 6, flex: 1 },
  requestActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  rejectBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.errorLight, alignItems: 'center' },
  rejectText: { fontSize: 14, fontWeight: '600', color: COLORS.error },
  acceptBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center' },
  acceptText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  activeJobCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  jobService: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  jobCustomer: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});

export default ProviderDashboardScreen;
