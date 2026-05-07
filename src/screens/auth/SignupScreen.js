/**
 * SignupScreen.js — Registration with name, email, password, role selection
 * Creates Firebase Auth account + Firestore user document.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { isValidEmail } from '../../utils/helpers';

const SignupScreen = ({ navigation }) => {
  const { signup, authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [errors, setErrors] = useState({});

  // Refs for input chaining (tap "next" on keyboard to go to next field)
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    const result = await signup(name.trim(), email.trim().toLowerCase(), password, role);
    if (!result.success) setErrors({ general: result.error });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join ServeNow and get started</Text>
      </View>

      {errors.general ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={COLORS.error} />
          <Text style={styles.errorBannerText}>{errors.general}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        {/* Role Selection */}
        <Text style={styles.sectionLabel}>I am a</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'customer' && styles.roleActive]}
            onPress={() => setRole('customer')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={24} color={role === 'customer' ? COLORS.primary : COLORS.textTertiary} />
            <Text style={[styles.roleLabel, role === 'customer' && styles.roleLabelActive]}>Customer</Text>
            {role === 'customer' && (
              <View style={styles.roleCheck}><Ionicons name="checkmark" size={14} color={COLORS.white} /></View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleOption, role === 'provider' && styles.roleActive]}
            onPress={() => setRole('provider')}
            activeOpacity={0.7}
          >
            <Ionicons name="construct-outline" size={24} color={role === 'provider' ? COLORS.primary : COLORS.textTertiary} />
            <Text style={[styles.roleLabel, role === 'provider' && styles.roleLabelActive]}>Service Provider</Text>
            {role === 'provider' && (
              <View style={styles.roleCheck}><Ionicons name="checkmark" size={14} color={COLORS.white} /></View>
            )}
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          icon="person-outline"
          autoCapitalize="words"
          error={errors.name}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Input
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="john@example.com"
          icon="mail-outline"
          keyboardType="email-address"
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
          placeholder="Min. 6 characters"
          icon="lock-closed-outline"
          secureTextEntry
          error={errors.password}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        <Input
          ref={confirmRef}
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          icon="lock-closed-outline"
          secureTextEntry
          error={errors.confirmPassword}
          returnKeyType="done"
          onSubmitEditing={handleSignup}
        />

        <Button title="Create Account" onPress={handleSignup} loading={authLoading} style={{ marginTop: 8 }} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorLight, padding: 12, borderRadius: 10, marginBottom: 16 },
  errorBannerText: { fontSize: 13, color: COLORS.error, marginLeft: 8, flex: 1 },
  form: { marginBottom: 32 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: COLORS.inputBackground, borderWidth: 1.5, borderColor: 'transparent' },
  roleActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  roleLabel: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary, marginLeft: 8, flex: 1 },
  roleLabelActive: { color: COLORS.primary, fontWeight: '600' },
  roleCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  footerLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});

export default SignupScreen;
