import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { TRACK_ORDER, TRACKS } from '../data/tracks';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { TrackId } from '../types';

interface Props {
  visible: boolean;
  currentTrack: TrackId;
  onSelectTrack: (track: TrackId) => void;
  onSelectExplore: () => void;
  onClose: () => void;
}

export default function TrackSwitcherModal({
  visible,
  currentTrack,
  onSelectTrack,
  onSelectExplore,
  onClose,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: colors.text }]}>Switch track</Text>
          <View style={styles.grid}>
            {TRACK_ORDER.map((trackId) => {
              const track = TRACKS[trackId];
              const isCurrent = trackId === currentTrack;
              return (
                <Pressable
                  key={trackId}
                  onPress={() => onSelectTrack(trackId)}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isCurrent ? track.color : colors.border,
                      borderWidth: isCurrent ? 2 : 1,
                    },
                  ]}
                >
                  {isCurrent && <Text style={styles.check}>✓</Text>}
                  <Text style={styles.cardIcon}>{track.icon}</Text>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {track.name}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={onSelectExplore}
              style={[
                styles.card,
                styles.dashedCard,
                { backgroundColor: colors.surface, borderColor: colors.textMuted },
              ]}
            >
              <Text style={styles.cardIcon}>🤔</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Not sure yet
              </Text>
            </Pressable>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '31%',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  dashedCard: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 13,
    fontWeight: '800',
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
