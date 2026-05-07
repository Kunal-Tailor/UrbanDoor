/**
 * SplashScreen.js — Initial loading screen
 * Checks if a user is already logged in and redirects accordingly.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { user, userData, loading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user && userData) {
          // User is logged in — go to appropriate navigator
          // Navigation is handled by RootNavigator based on auth state
        } else {
          navigation.replace('Onboarding');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, user, userData]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconCircle}>
          <Ionicons name="construct" size={40} color={COLORS.white} />
        </View>
        <Text style={styles.appName}>ServeNow</Text>
        <Text style={styles.tagline}>Home services at your doorstep</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 36, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
});

export default SplashScreen;
