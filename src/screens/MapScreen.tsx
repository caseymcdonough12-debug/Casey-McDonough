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
            <NodeButton
              key={node.id}
              title={node.title}
              status={status}
              isLive={node.live}
              accentColor={track.color}
              onPress={() => handleNodePress(node.id, node.live, status)}
            />
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
    fontSize: 14,
    fontWeight: '700',
  },
  trackPillCaret: {
    fontSize: 12,
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
    fontSize: 14,
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
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  dailySubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  nodesContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
