import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack } from '@/store/logitrack-store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useLogiTrack();
  const theme = useThemeColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'rider'>('customer');

  const handleSignIn = () => {
    login(role);
    router.replace('/(tabs)' as any);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>AUTHENTICATE</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>Enter your credentials to access the LogiTrack Command Terminal.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleSelector}>
            <Pressable
              style={[styles.roleOption, role === 'customer' && { backgroundColor: theme.primary }]}
              onPress={() => setRole('customer')}
            >
              <Text style={[styles.roleText, role === 'customer' ? { color: theme.primaryText } : { color: theme.muted }]}>CUSTOMER</Text>
            </Pressable>
            <Pressable
              style={[styles.roleOption, role === 'rider' && { backgroundColor: theme.primary }]}
              onPress={() => setRole('rider')}
            >
              <Text style={[styles.roleText, role === 'rider' ? { color: theme.primaryText } : { color: theme.muted }]}>RIDER</Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.primary }]}>OPERATOR IDENTIFIER (EMAIL)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. operator@logitrack.net"
              placeholderTextColor="#71717A"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.primary }]}>ACCESS CLEARANCE (PASSWORD)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#71717A"
              secureTextEntry
            />
          </View>

          <Pressable style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleSignIn}>
            <IconSymbol name="chevron.right" size={20} color={theme.primaryText} />
            <Text style={[styles.submitButtonText, { color: theme.primaryText }]}>AUTHORIZE LOGIN</Text>
          </Pressable>

          <Pressable style={styles.linkButton} onPress={() => router.push('/auth/sign-up' as any)}>
            <Text style={[styles.linkText, { color: theme.muted }]}>REQUEST NEW CLEARANCE (SIGN UP)</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  submitButtonText: {
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  linkButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
