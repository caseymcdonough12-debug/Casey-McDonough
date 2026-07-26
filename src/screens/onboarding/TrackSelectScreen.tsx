import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TRACK_ORDER, TRACKS } from '../../data/tracks';
import { RootStackParamList } from '../../navigation/types';
import { radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { TrackId } from '../../types';
import PrimaryButton from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'TrackSelect'>;

const NOT_SURE = 'not-sure' as const;
type Selection = TrackId | typeof NOT_SURE | null;

export default function TrackSelectScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<Selection>(null);

  const handleContinue = () => {
    if (selected === null) return;
    const track = selected === NOT_SURE ? null : selected;
    navigation.navigate('LifeStage', { track });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        What part of the business world do you want to learn?
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Pick a track to start with. You can switch anytime.
      </Text>

      <View style={styles.grid}>
        {TRACK_ORDER.map((trackId) => {
          const track = TRACKS[trackId];
          const isSelected = selected === trackId;
          return (
            <Pressable
              key={trackId}
              onPress={() => setSelected(trackId)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? track.color : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <Text style={styles.cardIcon}>{track.icon}</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {track.name}
              </Text>
              <Text
                style={[styles.cardTagline, { color: colors.textMuted }]}
                numberOfLines={2}
              >
                {track.tagline}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => setSelected(NOT_SURE)}
          style={[
            styles.card,
            styles.dashedCard,
            {
              backgroundColor: colors.surface,
              borderColor: selected === NOT_SURE ? colors.primary : colors.textMuted,
              borderWidth: selected === NOT_SURE ? 2 : 1.5,
            },
          ]}
        >
          <Text style={styles.cardIcon}>🤔</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Not sure yet
          </Text>
          <Text
            style={[styles.cardTagline, { color: colors.textMuted }]}
            numberOfLines={2}
          >
            Explore a bit of everything
          </Text>
        </Pressable>
      </View>

      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
        disabled={selected === null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  card: {
    width: '47%',
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 130,
  },
  dashedCard: {
    borderStyle: 'dashed',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cardTagline: {
    fontSize: 12,
  },
});
