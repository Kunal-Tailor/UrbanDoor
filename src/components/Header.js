/**
 * Header.js — Reusable screen header with back button and optional right action
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const Header = ({ title, onBack, rightIcon, onRightPress, transparent = false, style }) => (
  <View style={[styles.header, transparent && styles.transparent, style]}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color={transparent ? COLORS.white : COLORS.textPrimary} />
      </TouchableOpacity>
    ) : <View style={styles.placeholder} />}
    <Text style={[styles.title, transparent && styles.titleWhite]} numberOfLines={1}>{title}</Text>
    {rightIcon ? (
      <TouchableOpacity onPress={onRightPress} style={styles.rightButton} activeOpacity={0.7}>
        <Ionicons name={rightIcon} size={22} color={transparent ? COLORS.white : COLORS.textPrimary} />
      </TouchableOpacity>
    ) : <View style={styles.placeholder} />}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  transparent: { backgroundColor: 'transparent', borderBottomWidth: 0, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.divider, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginHorizontal: 8 },
  titleWhite: { color: COLORS.white },
  rightButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.divider, alignItems: 'center', justifyContent: 'center' },
  placeholder: { width: 40 },
});

export default Header;
