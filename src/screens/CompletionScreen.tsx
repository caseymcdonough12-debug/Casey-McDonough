import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useProgress } from '../context/ProgressContext';
import { RootStackParamList } from '../navigation/types';
import { radius, spacing } from '../theme/colors';
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>{isDaily ? '🔥' : '🎉'}</Text>
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

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>+{xpEarned}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>XP earned</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>🔥 {streak}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>day streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{accuracy}%</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>accuracy</Text>
        </View>
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
});
