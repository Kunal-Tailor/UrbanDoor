/**
 * ProviderEarningsScreen.js — Earnings overview with bar chart and job history
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { formatPrice } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const ProviderEarningsScreen = () => {
  const [period, setPeriod] = useState('week');

  const weekData = { total: 12450, jobs: 8, data: [1200, 1800, 2100, 900, 2400, 1500, 2550] };
  const monthData = { total: 48900, jobs: 32, data: [8500, 12400, 15000, 13000] };
  const currentData = period === 'week' ? weekData : monthData;
  const maxVal = Math.max(...currentData.data);

  const completedJobs = [
    { id: '1', service: 'Full Home Cleaning', customer: 'Priya M.', date: 'Dec 15', payout: 1499 },
    { id: '2', service: 'Bathroom Cleaning', customer: 'Ankit J.', date: 'Dec 14', payout: 599 },
    { id: '3', service: 'Kitchen Deep Clean', customer: 'Neha G.', date: 'Dec 13', payout: 899 },
    { id: '4', service: 'Full Home Cleaning', customer: 'Rahul N.', date: 'Dec 12', payout: 1499 },
    { id: '5', service: 'Office Cleaning', customer: 'Sneha R.', date: 'Dec 11', payout: 2499 },
  ];

  const dayLabels = period === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Earnings</Text>
        </View>

        {/* Period Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity style={[styles.toggle, period === 'week' && styles.toggleActive]} onPress={() => setPeriod('week')}>
            <Text style={[styles.toggleText, period === 'week' && styles.toggleTextActive]}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggle, period === 'month' && styles.toggleActive]} onPress={() => setPeriod('month')}>
            <Text style={[styles.toggleText, period === 'month' && styles.toggleTextActive]}>This Month</Text>
          </TouchableOpacity>
        </View>

        {/* Total Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>{formatPrice(currentData.total)}</Text>
          <Text style={styles.earningsJobs}>{currentData.jobs} jobs completed</Text>
        </View>

        {/* Simple Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Earnings Overview</Text>
          <View style={styles.chart}>
            {currentData.data.map((val, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={[styles.bar, { height: (val / maxVal) * 120, backgroundColor: COLORS.primary }]} />
                <Text style={styles.barLabel}>{dayLabels[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Job List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Jobs</Text>
          {completedJobs.map(job => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobIcon}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              </View>
              <View style={styles.jobInfo}>
                <Text style={styles.jobService}>{job.service}</Text>
                <Text style={styles.jobMeta}>{job.customer} • {job.date}</Text>
              </View>
              <Text style={styles.jobPayout}>+{formatPrice(job.payout)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  toggleRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: COLORS.white, borderRadius: 12, padding: 4 },
  toggle: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  toggleTextActive: { color: COLORS.white },
  earningsCard: { backgroundColor: COLORS.primary, borderRadius: 20, margin: 16, padding: 24, alignItems: 'center' },
  earningsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  earningsAmount: { fontSize: 36, fontWeight: '800', color: COLORS.white, marginTop: 4 },
  earningsJobs: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 },
  chartCard: { backgroundColor: COLORS.white, borderRadius: 16, margin: 16, padding: 16 },
  chartTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, paddingBottom: 24 },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { width: 24, borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 10, color: COLORS.textTertiary, marginTop: 6 },
  section: { paddingHorizontal: 16, marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  jobCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8 },
  jobIcon: { marginRight: 12 },
  jobInfo: { flex: 1 },
  jobService: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  jobMeta: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  jobPayout: { fontSize: 15, fontWeight: '700', color: COLORS.success },
});

export default ProviderEarningsScreen;
