import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import MiniSpreadsheet from './MiniSpreadsheet';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { ConceptTeaching } from '../types';

interface Props {
  concept: ConceptTeaching;
  onReady: () => void;
}

export default function ConceptTeachingCard({ concept, onReady }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.eyebrow, { color: colors.primary }]}>New concept</Text>
      <Text style={[styles.title, { color: colors.text }]}>{concept.title}</Text>

      <Text style={[styles.body, { color: colors.text }]}>{concept.whatItDoes}</Text>

      <View
        style={[
          styles.scenarioBox,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.scenarioLabel, { color: colors.textMuted }]}>
          WHEN YOU'D ACTUALLY USE THIS
        </Text>
        <Text style={[styles.scenarioText, { color: colors.text }]}>
          {concept.realWorldScenario}
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>WORKED EXAMPLE</Text>
      <Text style={[styles.body, { color: colors.text }]}>{concept.example.scenarioPrompt}</Text>

      {concept.example.cells && concept.example.columnHeaders && (
        <MiniSpreadsheet
          columnHeaders={concept.example.columnHeaders}
          cells={concept.example.cells}
        />
      )}

      <View
        style={[
          styles.formulaBox,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.primary },
        ]}
      >
        <Text style={[styles.formulaCellLabel, { color: colors.textMuted }]}>
          {concept.example.targetLabel}
        </Text>
        <Text style={[styles.formulaText, { color: colors.primary }]}>
          {concept.example.answer}
        </Text>
      </View>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        {concept.example.resultExplanation}
      </Text>

      <View style={styles.spacer} />

      <PrimaryButton title="Try it yourself" onPress={onReady} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  scenarioBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  scenarioLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  scenarioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  formulaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  formulaCellLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  formulaText: {
    fontSize: 16,
    fontWeight: '700',
  },
  spacer: {
    height: spacing.lg,
  },
});
