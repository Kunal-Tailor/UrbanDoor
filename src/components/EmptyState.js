/**
 * EmptyState.js — Empty state component with icon and message
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const EmptyState = ({ icon = 'file-tray-outline', title = 'Nothing here yet', message = '', style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={48} color={COLORS.textTertiary} />
    </View>
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.divider, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});

export default EmptyState;
