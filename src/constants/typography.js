/**
 * typography.js — Global typography constants for ServeNow
 * 
 * Defines font sizes, weights, and reusable text styles.
 * Uses system fonts for simplicity — works great on both Android and iOS.
 */

import { Platform } from 'react-native';

const FONTS = {
  // Font families — using platform-appropriate system fonts
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto',
};

const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 32,
  hero: 40,

  // Spacing
  paddingXS: 4,
  paddingSM: 8,
  paddingMD: 12,
  padding: 16,
  paddingLG: 20,
  paddingXL: 24,
  paddingXXL: 32,

  // Border radius
  radiusSM: 6,
  radius: 10,
  radiusMD: 12,
  radiusLG: 16,
  radiusXL: 20,
  radiusFull: 999,

  // Icon sizes
  iconSM: 16,
  icon: 20,
  iconMD: 24,
  iconLG: 28,
  iconXL: 32,
};

const TEXT_STYLES = {
  hero: {
    fontSize: SIZES.hero,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  h1: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: '#0F172A',
  },
  h2: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: '#0F172A',
  },
  h3: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: '#0F172A',
  },
  h4: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: '#0F172A',
  },
  body: {
    fontSize: SIZES.base,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: SIZES.md,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 20,
  },
  caption: {
    fontSize: SIZES.sm,
    fontWeight: '400',
    color: '#94A3B8',
    lineHeight: 16,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: '#334155',
  },
  button: {
    fontSize: SIZES.base,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: SIZES.md,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
};

export { FONTS, SIZES, TEXT_STYLES };
