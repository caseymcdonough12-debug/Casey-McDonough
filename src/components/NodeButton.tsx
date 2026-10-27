import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';

export type NodeStatus = 'completed' | 'unlocked' | 'locked';

interface Props {
  title: string;
  status: NodeStatus;
  isLive: boolean;
  isNext?: boolean;
  accentColor: string;
  onPress: () => void;
}

export default function NodeButton({
  title,
  status,
  isLive,
  isNext = false,
  accentColor,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const isTappable = status !== 'locked';

  // Slow halo pulse draws the eye to the lesson the user should do next.
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isNext) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1100,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isNext, pulse]);

  const circleColor =
    status === 'completed'
      ? colors.success
      : status === 'unlocked' && isLive
        ? accentColor
        : colors.locked;

  const icon =
    status === 'completed' ? '✓' : status === 'locked' ? '🔒' : isLive ? '▶' : '⏳';

  return (
    <Pressable onPress={onPress} disabled={!isTappable} style={styles.wrapper}>
      <View style={styles.circleSlot}>
        {isNext && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.halo,
              {
                borderColor: accentColor,
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
                transform: [
                  { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] }) },
                ],
              },
            ]}
          />
        )}
        <View style={[styles.circle, { backgroundColor: circleColor }]}>
          <Text style={[styles.icon, { color: colors.onPrimary }]}>{icon}</Text>
        </View>
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

      {isNext && (
        <Text style={[styles.nextBadge, { color: accentColor }]}>NEXT UP</Text>
      )}
      {status !== 'locked' && !isLive && (
        <Text style={[styles.badge, { color: colors.textMuted }]}>Coming soon</Text>
      )}
    </Pressable>
  );
}

const CIRCLE_SIZE = 64;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 112,
  },
  circleSlot: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  halo: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radius.pill,
    borderWidth: 3,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    ...typography.heading,
  },
  title: {
    ...typography.caption,
    textAlign: 'center',
  },
  nextBadge: {
    ...typography.micro,
    marginTop: 3,
  },
  badge: {
    ...typography.micro,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 2,
  },
});
