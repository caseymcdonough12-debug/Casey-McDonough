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
      <Text style={[styles.eyebrow, { color: colors.primary }]}>New skill</Text>

      <View
        style={[
          styles.chip,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.primary },
        ]}
      >
        <Text style={[styles.chipText, { color: colors.primary }]}>{concept.skillName}</Text>
      </View>

      <Text style={[styles.body, { color: colors.text }]}>{concept.whatItDoes}</Text>

      <View
        style={[
          styles.jobBox,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.jobLabel, { color: colors.textMuted }]}>ON THE JOB</Text>
        <Text style={[styles.jobRole, { color: colors.text }]}>{concept.jobRole}</Text>
        <Text style={[styles.jobScenario, { color: colors.text }]}>{concept.jobScenario}</Text>
      </View>

      <View style={styles.tagsRow}>
        <Text style={[styles.tagsLabel, { color: colors.textMuted }]}>Also comes up in:</Text>
        <View style={styles.tagsList}>
          {concept.alsoAppliesIn.map((role) => (
            <View
              key={role}
              style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <Text style={[styles.tagText, { color: colors.textMuted }]}>{role}</Text>
            </View>
          ))}
        </View>
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
    marginBottom: spacing.sm,
  },
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Menlo',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  jobBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  jobLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  jobRole: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  jobScenario: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagsRow: {
    marginBottom: spacing.lg,
  },
  tagsLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
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
