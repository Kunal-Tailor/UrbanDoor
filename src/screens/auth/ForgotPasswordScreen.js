/**
 * ForgotPasswordScreen.js — Firebase password reset email
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { isValidEmail } from '../../utils/helpers';

const ForgotPasswordScreen = ({ navigation }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    const result = await resetPassword(email.trim().toLowerCase());
    setLoading(false);
    if (result.success) { setSent(true); }
    else { setError(result.error); }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}><Ionicons name="mail-open" size={40} color={COLORS.success} /></View>
          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successText}>We've sent a password reset link to{'\n'}{email}</Text>
          <Button title="Back to Login" onPress={() => navigation.goBack()} style={{ marginTop: 24, width: '100%' }} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header title="Forgot Password" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.iconWrap}><Ionicons name="key" size={36} color={COLORS.primary} /></View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a link to reset your password.</Text>
        <Input label="Email Address" value={email} onChangeText={(v) => { setEmail(v); setError(''); }}
          placeholder="john@example.com" icon="mail-outline" keyboardType="email-address" error={error} />
        <Button title="Send Reset Link" onPress={handleReset} loading={loading} style={{ marginTop: 8 }} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  iconWrap: { width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
  successText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});

export default ForgotPasswordScreen;
