/**
 * LoginScreen.js — Email + password login with Firebase Auth
 * Includes Demo Mode buttons for testing without Firebase.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { isValidEmail } from '../../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const { login, demoLogin, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const passwordRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const result = await login(email.trim().toLowerCase(), password);
    if (!result.success) {
      setErrors({ general: result.error });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="construct" size={28} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue booking services</Text>
      </View>

      {errors.general ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={COLORS.error} />
          <Text style={styles.errorBannerText}>{errors.general}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          icon="lock-closed-outline"
          secureTextEntry
          error={errors.password}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button title="Sign In" onPress={handleLogin} loading={authLoading} style={styles.loginButton} />
      </View>

      {/* ====== DEMO MODE SECTION ====== */}
      <View style={styles.demoSection}>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or try demo mode</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.demoButton} onPress={() => demoLogin('customer')} activeOpacity={0.7}>
          <View style={[styles.demoIcon, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="person" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Customer</Text>
            <Text style={styles.demoDesc}>Browse services, book & track</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.demoButton} onPress={() => demoLogin('provider')} activeOpacity={0.7}>
          <View style={[styles.demoIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="construct" size={18} color={COLORS.success} />
          </View>
          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Provider</Text>
            <Text style={styles.demoDesc}>View dashboard, earnings & jobs</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 80 : 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: { width: 60, height: 60, borderRadius: 18, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorLight, padding: 12, borderRadius: 10, marginBottom: 16 },
  errorBannerText: { fontSize: 13, color: COLORS.error, marginLeft: 8, flex: 1 },
  form: { marginBottom: 16 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  forgotText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  loginButton: { marginTop: 8 },
  // Demo section styles
  demoSection: { marginBottom: 24 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { paddingHorizontal: 12, fontSize: 13, color: COLORS.textTertiary, fontWeight: '500' },
  demoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  demoIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  demoInfo: { flex: 1 },
  demoTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  demoDesc: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  footerLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});

export default LoginScreen;
