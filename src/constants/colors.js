/**
 * colors.js — Global color palette for ServeNow
 * 
 * All colors used throughout the app are defined here.
 * This ensures consistent branding and makes it easy to update the theme.
 */

const COLORS = {
  // Primary brand colors
  primary: '#4F46E5',        // Indigo — main brand color
  primaryDark: '#3730A3',    // Darker indigo for pressed states
  primaryLight: '#818CF8',   // Lighter indigo for backgrounds
  primarySoft: '#EEF2FF',   // Very light indigo for subtle backgrounds

  // Secondary accent
  secondary: '#F59E0B',      // Amber — accent for highlights, stars, badges
  secondaryDark: '#D97706',
  secondaryLight: '#FCD34D',

  // Success / Error / Warning / Info
  success: '#10B981',        // Emerald green
  successLight: '#D1FAE5',
  error: '#EF4444',          // Red
  errorLight: '#FEE2E2',
  warning: '#F59E0B',        // Amber
  warningLight: '#FEF3C7',
  info: '#3B82F6',           // Blue
  infoLight: '#DBEAFE',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAFC',     // Soft off-white background
  surface: '#FFFFFF',        // Card / surface background
  border: '#E2E8F0',         // Light border
  borderDark: '#CBD5E1',

  // Text colors
  textPrimary: '#0F172A',    // Near-black for headings
  textSecondary: '#475569',  // Medium gray for body text
  textTertiary: '#94A3B8',   // Light gray for placeholders
  textWhite: '#FFFFFF',
  textLink: '#4F46E5',       // Same as primary for links

  // Status colors (for booking status badges)
  statusConfirmed: '#3B82F6',
  statusAssigned: '#8B5CF6',
  statusOnTheWay: '#F59E0B',
  statusInProgress: '#10B981',
  statusCompleted: '#059669',
  statusCancelled: '#EF4444',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  inputBackground: '#F1F5F9',
  tabBarBackground: '#FFFFFF',
  divider: '#F1F5F9',
};

export default COLORS;
