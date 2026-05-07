/**
 * BookingCard.js — Card component for displaying a booking
 * 
 * Used in BookingHistoryScreen to show past and active bookings.
 * Shows service name, date, status badge, and price.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { SIZES } from '../constants/typography';
import StatusBadge from './StatusBadge';
import { formatPrice, formatDate } from '../utils/helpers';

const BookingCard = ({ booking, onPress }) => {
  const getServiceIcon = (category) => {
    const iconMap = {
      'Plumber': 'water',
      'Electrician': 'flash',
      'Cleaner': 'sparkles',
      'Carpenter': 'hammer',
      'Painter': 'color-palette',
      'AC Repair': 'snow',
    };
    return iconMap[category] || 'construct';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.primarySoft }]}>
          <Ionicons
            name={getServiceIcon(booking.category)}
            size={22}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.bookingId}>ID: {booking.bookingId}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.detailText}>{booking.timeSlot}</Text>
        </View>
        <Text style={styles.price}>{formatPrice(booking.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMD,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 'auto',
  },
});

export default BookingCard;
