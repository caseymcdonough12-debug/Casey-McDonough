import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NodeButton, { NodeStatus } from '../components/NodeButton';
import TrackSwitcherModal from '../components/TrackSwitcherModal';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';
import { getDailyQuestionCount } from '../data/dailyQuestions';
import { LESSON_NODES, TRACKS } from '../data/tracks';
import { RootStackParamList } from '../navigation/types';
import { radius, spacing } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';
import { TrackId } from '../types';
import { displayStreak, todayStr } from '../utils/date';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MapScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { profile, setCurrentTrack } = useUser();
  const { getTrackProgress } = useProgress();
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const trackId = profile.currentTrack;
  const track = TRACKS[trackId];
  const nodes = [...LESSON_NODES[trackId]].sort((a, b) => a.order - b.order);
  const trackProgress = getTrackProgress(trackId);
  const streak = displayStreak(trackProgress.streak, trackProgress.lastActiveDate);

  const firstLiveNode = nodes.find((n) => n.live);
  const dailyPracticeUnlocked =
    track.live && !!firstLiveNode && trackProgress.completedNodeIds.includes(firstLiveNode.id);
  const dailyPracticeDoneToday = trackProgress.lastDailyPracticeDate === todayStr();
  const dailyQuestionCount = getDailyQuestionCount(trackId);

  const completedCount = nodes.filter((n) =>
    trackProgress.completedNodeIds.includes(n.id)
  ).length;
  const progressPct = nodes.length === 0 ? 0 : Math.round((completedCount / nodes.length) * 100);

  // The lesson to point the user at: first unlocked, playable, not-yet-done node.
  const nextNodeId = nodes.find((node, index) => {
    const isCompleted = trackProgress.completedNodeIds.includes(node.id);
    const previousCompleted =
      index === 0 || trackProgress.completedNodeIds.includes(nodes[index - 1].id);
    return !isCompleted && previousCompleted && node.live;
  })?.id;

  const activeToday = trackProgress.lastActiveDate === todayStr();
  const showComeBackNudge = track.live && !activeToday;

  const handleSelectTrack = async (newTrack: TrackId) => {
    setSwitcherVisible(false);
    if (newTrack !== trackId) {
      await setCurrentTrack(newTrack);
    }
  };

  const handleSelectExplore = () => {
    setSwitcherVisible(false);
    navigation.navigate('MainTabs', { screen: 'Explore' });
  };

  const handleStartDailyPractice = () => {
    navigation.navigate('DailyPractice', { trackId });
  };

  const handleNodePress = (nodeId: string, isLive: boolean, status: NodeStatus) => {
    if (status === 'locked') return;
    if (!isLive) {
      Alert.alert('Coming soon', 'This lesson is still being built — check back soon.');
      return;
    }
    navigation.navigate('Lesson', { trackId, nodeId, fromExplore: false });
  };

  const handleNudgePress = () => {
    if (nextNodeId) {
      navigation.navigate('Lesson', { trackId, nodeId: nextNodeId, fromExplore: false });
    } else if (dailyPracticeUnlocked && !dailyPracticeDoneToday) {
      handleStartDailyPractice();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setSwitcherVisible(true)}
          style={[styles.trackPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={styles.trackPillIcon}>{track.icon}</Text>
          <Text style={[styles.trackPillText, { color: colors.text }]}>{track.name}</Text>
          <Text style={[styles.trackPillCaret, { color: colors.textMuted }]}>▾</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={[styles.statText, { color: colors.text }]}>{trackProgress.xp} XP</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={[styles.statText, { color: colors.text }]}>{streak}</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabelRow}>
          <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
            {completedCount} of {nodes.length} lessons complete
          </Text>
          <Text style={[styles.progressPct, { color: colors.textMuted }]}>{progressPct}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: track.color, width: `${progressPct}%` },
            ]}
          />
        </View>
      </View>

      {showComeBackNudge && (
        <Pressable
          onPress={handleNudgePress}
          style={[
            styles.comeBackCard,
            { backgroundColor: colors.surface, borderColor: track.color },
          ]}
        >
          <Text style={styles.comeBackIcon}>{streak > 0 ? '🔥' : '👋'}</Text>
          <View style={styles.comeBackTextGroup}>
            <Text style={[styles.comeBackTitle, { color: colors.text }]}>
              {streak > 0
                ? `Keep your ${streak}-day streak alive`
                : 'Start your streak today'}
            </Text>
            <Text style={[styles.comeBackSubtitle, { color: colors.textMuted }]}>
              You haven't practiced yet today — one lesson is all it takes.
            </Text>
          </View>
          <Text style={[styles.comeBackChevron, { color: track.color }]}>›</Text>
        </Pressable>
      )}

      {!track.live && (
        <View style={[styles.noticeBanner, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <Text style={[styles.noticeText, { color: colors.textMuted }]}>
            {track.name} lessons are still being built — only Finance has full content right now.
          </Text>
        </View>
      )}

      {track.live && !dailyPracticeUnlocked && (
        <View
          style={[
            styles.dailyCard,
            { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
          ]}
        >
          <Text style={styles.dailyIcon}>🔒</Text>
          <View style={styles.dailyTextGroup}>
            <Text style={[styles.dailyTitle, { color: colors.textMuted }]}>
              Today's Practice
            </Text>
            <Text style={[styles.dailySubtitle, { color: colors.textMuted }]}>
              Finish {firstLiveNode?.title ?? 'the first lesson'} to unlock daily practice.
            </Text>
          </View>
        </View>
      )}

      {track.live && dailyPracticeUnlocked && (
        <Pressable
          onPress={dailyPracticeDoneToday ? undefined : handleStartDailyPractice}
          style={[
            styles.dailyCard,
            {
              backgroundColor: dailyPracticeDoneToday ? colors.surfaceRaised : colors.surface,
              borderColor: dailyPracticeDoneToday ? colors.border : track.color,
              borderWidth: dailyPracticeDoneToday ? 1 : 2,
            },
          ]}
        >
          <Text style={styles.dailyIcon}>{dailyPracticeDoneToday ? '✅' : '🗓️'}</Text>
          <View style={styles.dailyTextGroup}>
            <Text style={[styles.dailyTitle, { color: colors.text }]}>
              {dailyPracticeDoneToday ? "Today's practice done" : "Today's Practice"}
            </Text>
            <Text style={[styles.dailySubtitle, { color: colors.textMuted }]}>
              {dailyPracticeDoneToday
                ? 'New problems tomorrow — keep the habit going.'
                : `${dailyQuestionCount} fresh problems, fresh numbers every day — about 30 minutes.`}
            </Text>
          </View>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={styles.nodesContainer}>
        {nodes.map((node, index) => {
          const isCompleted = trackProgress.completedNodeIds.includes(node.id);
          const previousCompleted =
            index === 0 || trackProgress.completedNodeIds.includes(nodes[index - 1].id);
          const status: NodeStatus = isCompleted
            ? 'completed'
            : previousCompleted
              ? 'unlocked'
              : 'locked';

          return (
            <View key={node.id} style={styles.nodeRow}>
              {index > 0 && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor: trackProgress.completedNodeIds.includes(nodes[index - 1].id)
                        ? colors.success
                        : colors.border,
                    },
                  ]}
                />
              )}
              <NodeButton
                title={node.title}
                status={status}
                isLive={node.live}
                isNext={node.id === nextNodeId}
                accentColor={track.color}
                onPress={() => handleNodePress(node.id, node.live, status)}
              />
            </View>
          );
        })}
      </ScrollView>

      <TrackSwitcherModal
        visible={switcherVisible}
        currentTrack={trackId}
        onSelectTrack={handleSelectTrack}
        onSelectExplore={handleSelectExplore}
        onClose={() => setSwitcherVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 6,
  },
  trackPillIcon: {
    fontSize: 16,
  },
  trackPillText: {
    ...typography.label,
    fontWeight: '700',
  },
  trackPillCaret: {
    ...typography.caption,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    ...typography.label,
    fontWeight: '700',
  },
  progressBlock: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.caption,
  },
  progressPct: {
    ...typography.caption,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  comeBackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.sm,
  },
  comeBackIcon: {
    fontSize: 24,
  },
  comeBackTextGroup: {
    flex: 1,
  },
  comeBackTitle: {
    ...typography.label,
    fontWeight: '800',
    marginBottom: 2,
  },
  comeBackSubtitle: {
    ...typography.caption,
    fontWeight: '400',
  },
  comeBackChevron: {
    fontSize: 24,
    fontWeight: '700',
  },
  noticeBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  noticeText: {
    ...typography.caption,
    fontWeight: '400',
  },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  dailyIcon: {
    fontSize: 24,
  },
  dailyTextGroup: {
    flex: 1,
  },
  dailyTitle: {
    ...typography.label,
    fontWeight: '700',
    marginBottom: 2,
  },
  dailySubtitle: {
    ...typography.caption,
    fontWeight: '400',
  },
  nodesContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  nodeRow: {
    alignItems: 'center',
  },
  connector: {
    width: 4,
    height: 28,
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
});
