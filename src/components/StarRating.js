/**
 * StarRating.js — Star rating display and input component
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const StarRating = ({ rating = 0, maxStars = 5, size = 18, color = COLORS.secondary, interactive = false, onRatingChange, showLabel = false, style }) => {
  const handlePress = (val) => { if (interactive && onRatingChange) onRatingChange(val); };

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const iconName = i <= Math.floor(rating) ? 'star' : i === Math.ceil(rating) && rating % 1 !== 0 ? 'star-half' : 'star-outline';
    stars.push(
      <TouchableOpacity key={i} onPress={() => handlePress(i)} disabled={!interactive} activeOpacity={interactive ? 0.7 : 1} style={{ marginRight: 2 }}>
        <Ionicons name={iconName} size={size} color={i <= Math.ceil(rating) ? color : '#D1D5DB'} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      <View style={{ flexDirection: 'row' }}>{stars}</View>
      {showLabel && <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginLeft: 6 }}>{rating.toFixed(1)}</Text>}
    </View>
  );
};

export default StarRating;
