import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '../theme/typography';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  /** Hide the "Rung" text and show the ladder mark alone. */
  markOnly?: boolean;
}

/**
 * The Rung ladder mark, drawn with views so it stays crisp at any size and
 * picks up the current theme. Top rung is accent-coloured — the next step up.
 */
export default function Wordmark({ markOnly = false }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.mark}>
        <View style={[styles.rail, styles.railLeft, { backgroundColor: colors.primary }]} />
        <View style={[styles.rail, styles.railRight, { backgroundColor: colors.primary }]} />
        <View style={[styles.rung, { top: 5, backgroundColor: colors.accent }]} />
        <View style={[styles.rung, { top: 13, backgroundColor: colors.primary }]} />
        <View style={[styles.rung, { top: 21, backgroundColor: colors.primary }]} />
      </View>
      {!markOnly && <Text style={[styles.word, { color: colors.text }]}>Rung</Text>}
    </View>
  );
}

const MARK_W = 26;
const MARK_H = 30;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: MARK_W,
    height: MARK_H,
  },
  rail: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: MARK_H,
    borderRadius: 2,
  },
  railLeft: {
    left: 0,
  },
  railRight: {
    right: 0,
  },
  rung: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  word: {
    ...typography.title,
    letterSpacing: -0.5,
  },
});
