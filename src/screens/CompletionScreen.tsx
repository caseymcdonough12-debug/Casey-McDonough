import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useProgress } from '../context/ProgressContext';
import { RootStackParamList } from '../navigation/types';
import { radius, spacing } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';
import { displayStreak } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Completion'>;

export default function CompletionScreen({ route, navigation }: Props) {
  const { trackId, nodeId, xpEarned, correctCount, totalCount, fromExplore, isDaily } = route.params;
  const { colors } = useTheme();
  const { getTrackProgress } = useProgress();

  const progress = getTrackProgress(trackId);
  const streak = displayStreak(progress.streak, progress.lastActiveDate);
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Celebration: emoji pops first, then the headline, then the stats stagger in.
  const pop = useRef(new Animated.Value(0)).current;
  const headline = useRef(new Animated.Value(0)).current;
  const stats = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Overlapping, not strictly sequential — a strict sequence left the screen
    // looking empty for nearly a second before the stats appeared.
    Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        friction: 5,
        tension: 110,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(headline, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(220),
        Animated.stagger(
          70,
          stats.map((v) =>
            Animated.timing(v, {
              toValue: 1,
              duration: 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })
          )
        ),
      ]),
    ]).start();
  }, [pop, headline, stats]);

  const handleContinue = () => {
    if (fromExplore) {
      navigation.replace('ExploreFeedback', { trackId, nodeId });
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  const riseFrom = (value: Animated.Value) => ({
    opacity: value,
    transform: [
      { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
    ],
  });

  const statCards = [
    { value: `+${xpEarned}`, label: 'XP earned', color: colors.accent },
    { value: `🔥 ${streak}`, label: 'day streak', color: colors.text },
    { value: `${accuracy}%`, label: 'accuracy', color: colors.text },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.Text
        style={[
          styles.emoji,
          {
            opacity: pop,
            transform: [
              { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
            ],
          },
        ]}
      >
        {isDaily ? '🔥' : '🎉'}
      </Animated.Text>

      <Animated.View style={riseFrom(headline)}>
        <Text
          style={[
            styles.title,
            { color: colors.text, marginBottom: isDaily ? spacing.sm : spacing.xl },
          ]}
        >
          {isDaily ? "Today's practice complete!" : 'Lesson complete!'}
        </Text>
        {isDaily && (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            New problems tomorrow — come back and keep the streak going.
          </Text>
        )}
      </Animated.View>

      <View style={styles.statsRow}>
        {statCards.map((card, i) => (
          <Animated.View
            key={card.label}
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              riseFrom(stats[i]),
            ]}
          >
            <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{card.label}</Text>
          </Animated.View>
        ))}
      </View>

      <View style={styles.spacer} />

      <PrimaryButton title="Continue" onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
    lineHeight: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.heading,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.micro,
    fontWeight: '600',
    letterSpacing: 0,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
});
