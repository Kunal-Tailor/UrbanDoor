/**
 * StatusBadge.js — Color-coded status pill component
 * 
 * Shows booking status as a colored badge (Confirmed, In Progress, Completed, etc.)
 * Used in BookingCard and TrackBookingScreen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const StatusBadge = ({ status, size = 'small' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', bg: COLORS.infoLight, color: COLORS.info };
      case 'provider_assigned':
        return { label: 'Assigned', bg: '#F3E8FF', color: '#8B5CF6' };
      case 'on_the_way':
        return { label: 'On the Way', bg: COLORS.warningLight, color: COLORS.warning };
      case 'in_progress':
        return { label: 'In Progress', bg: COLORS.successLight, color: COLORS.success };
      case 'completed':
        return { label: 'Completed', bg: '#D1FAE5', color: '#059669' };
      case 'cancelled':
        return { label: 'Cancelled', bg: COLORS.errorLight, color: COLORS.error };
      default:
        return { label: status, bg: COLORS.divider, color: COLORS.textSecondary };
    }
  };

  const config = getStatusConfig();
  const isLarge = size === 'large';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isLarge && styles.badgeLarge]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }, isLarge && styles.textLarge]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: 13,
  },
});

export default StatusBadge;
