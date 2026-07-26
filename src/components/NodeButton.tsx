import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export type NodeStatus = 'completed' | 'unlocked' | 'locked';

interface Props {
  title: string;
  status: NodeStatus;
  isLive: boolean;
  accentColor: string;
  onPress: () => void;
}

export default function NodeButton({
  title,
  status,
  isLive,
  accentColor,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const isTappable = status !== 'locked';

  const circleColor =
    status === 'completed'
      ? colors.success
      : status === 'unlocked' && isLive
        ? accentColor
        : colors.locked;

  const icon = status === 'completed' ? '✓' : status === 'locked' ? '🔒' : isLive ? '' : '⏳';

  return (
    <Pressable
      onPress={onPress}
      disabled={!isTappable}
      style={styles.wrapper}
    >
      <View style={[styles.circle, { backgroundColor: circleColor }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text
        style={[
          styles.title,
          { color: status === 'locked' ? colors.textMuted : colors.text },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      {status !== 'locked' && !isLive && (
        <Text style={[styles.badge, { color: colors.textMuted }]}>Coming soon</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 96,
    marginBottom: spacing.lg,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 22,
    color: '#fff',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  badge: {
    fontSize: 10,
    marginTop: 2,
  },
});
