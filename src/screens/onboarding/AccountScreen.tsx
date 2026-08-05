import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useUser } from '../../context/UserContext';
import { radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function AccountScreen() {
  const { colors } = useTheme();
  const { createAccount } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canContinue = name.trim().length > 0 && isValidEmail(email) && password.length >= 6;

  const handleCreate = () => {
    if (!canContinue) return;
    createAccount(name.trim(), email.trim());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.eyebrow, { color: colors.primary }]}>Welcome to Rung</Text>
      <Text style={[styles.title, { color: colors.text }]}>Create your free account</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        We'll track your progress and send you a report every Sunday on what you're getting good at.
      </Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
        />
      </View>

      <View style={styles.spacer} />

      <PrimaryButton title="Create account" onPress={handleCreate} disabled={!canContinue} />
      <Text style={[styles.fineprint, { color: colors.textMuted }]}>
        By continuing you agree to get a weekly progress email. You can unsubscribe anytime.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 15,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  fineprint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 17,
  },
});
