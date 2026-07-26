import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  trackName: string;
  onSwitch: () => void;
  onDismiss: () => void;
}

export default function NudgeBanner({ trackName, onSwitch, onDismiss }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: colors.surfaceRaised, borderColor: colors.primary }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        You keep coming back to {trackName} — want to go deeper there?
      </Text>
      <View style={styles.actions}>
        <Pressable onPress={onDismiss} style={styles.secondaryAction}>
          <Text style={[styles.secondaryText, { color: colors.textMuted }]}>Keep exploring</Text>
        </Pressable>
        <Pressable
          onPress={onSwitch}
          style={[styles.primaryAction, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.primaryText, { color: colors.onPrimary }]}>Switch</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    alignItems: 'center',
  },
  secondaryAction: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryAction: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  primaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
