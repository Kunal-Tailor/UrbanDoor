/**
 * LoadingSpinner.js — Centered activity indicator for loading states
 */
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const LoadingSpinner = ({ message = 'Loading...', size = 'large', color = COLORS.primary }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  message: { marginTop: 12, fontSize: 14, color: COLORS.textSecondary },
});

export default LoadingSpinner;
