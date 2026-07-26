import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import NudgeBanner from '../../components/NudgeBanner';
import PrimaryButton from '../../components/PrimaryButton';
import { useProgress } from '../../context/ProgressContext';
import { useUser } from '../../context/UserContext';
import { TRACK_ORDER, TRACKS, LESSON_NODES } from '../../data/tracks';
import { MainTabsParamList, RootStackParamList } from '../../navigation/types';
import { radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { TrackId } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Explore'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ExploreHubScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { setCurrentTrack } = useUser();
  const { exploreFeedback, dismissNudge } = useProgress();

  const nudgeTrackId = TRACK_ORDER.find(
    (id) => (exploreFeedback[id]?.thumbsUp ?? 0) >= 2 && !exploreFeedback[id]?.nudgeDismissed
  );

  const handleTryIt = (trackId: TrackId) => {
    const track = TRACKS[trackId];
    if (!track.live) {
      Alert.alert('Still being built', `${track.name} lessons are on the way — check back soon.`);
      return;
    }
    const firstLiveNode = LESSON_NODES[trackId].find((n) => n.live);
    if (!firstLiveNode) {
      Alert.alert('Still being built', `${track.name} lessons are on the way — check back soon.`);
      return;
    }
    navigation.navigate('Lesson', { trackId, nodeId: firstLiveNode.id, fromExplore: true });
  };

  const handleSwitch = async (trackId: TrackId) => {
    await setCurrentTrack(trackId);
    await dismissNudge(trackId);
    navigation.navigate('Learn');
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Sample any track before committing to it.
      </Text>

      {nudgeTrackId && (
        <NudgeBanner
          trackName={TRACKS[nudgeTrackId].name}
          onSwitch={() => handleSwitch(nudgeTrackId)}
          onDismiss={() => dismissNudge(nudgeTrackId)}
        />
      )}

      {TRACK_ORDER.map((trackId) => {
        const track = TRACKS[trackId];
        return (
          <View
            key={trackId}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={styles.cardIcon}>{track.icon}</Text>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{track.name}</Text>
              <Text style={[styles.cardTagline, { color: colors.textMuted }]}>{track.tagline}</Text>
              {!track.live && (
                <Text style={[styles.comingSoon, { color: colors.accent }]}>Still being built</Text>
              )}
            </View>
            <View style={styles.cardAction}>
              <PrimaryButton
                title="Try it"
                onPress={() => handleTryIt(trackId)}
                variant={track.live ? 'primary' : 'secondary'}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardTagline: {
    fontSize: 12,
    marginTop: 2,
  },
  comingSoon: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  cardAction: {
    minWidth: 84,
  },
});
