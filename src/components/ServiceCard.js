/**
 * ServiceCard.js — Card component for displaying a service
 * 
 * Used on HomeScreen (featured services) and ServiceListScreen.
 * Shows service image, name, rating, price, and provider info.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { SIZES } from '../constants/typography';
import { formatPrice } from '../utils/helpers';

const ServiceCard = ({ service, onPress, variant = 'default' }) => {
  // variant: 'default' = vertical card, 'horizontal' = horizontal card

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: service.image }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text style={styles.category}>{service.category}</Text>
          <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
          <View style={styles.bottomRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={COLORS.secondary} />
              <Text style={styles.rating}>{service.rating}</Text>
              <Text style={styles.reviewCount}>({service.reviewCount})</Text>
            </View>
            <Text style={styles.price}>{formatPrice(service.price)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: service.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{service.category}</Text>
        <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={13} color={COLORS.secondary} />
            <Text style={styles.ratingSmall}>{service.rating}</Text>
          </View>
          <Text style={styles.priceSmall}>{formatPrice(service.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Vertical card (used in featured section)
  card: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMD,
    marginRight: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: SIZES.radiusMD,
    borderTopRightRadius: SIZES.radiusMD,
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Horizontal card (used in list screen)
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMD,
    marginBottom: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: 110,
    height: 130,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginLeft: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default ServiceCard;
