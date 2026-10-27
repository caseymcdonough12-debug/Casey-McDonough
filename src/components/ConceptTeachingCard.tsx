import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import MiniSpreadsheet from './MiniSpreadsheet';
import { radius, spacing } from '../theme/colors';
import { typography } from '../theme/typography';
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

      {concept.depthNote && (
        <Text style={[styles.body, { color: colors.textMuted }]}>{concept.depthNote}</Text>
      )}

      <View
        style={[
          styles.jobBox,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.jobLabel, { color: colors.textMuted }]}>
          {concept.scenarioBoxLabel ?? 'ON THE JOB'}
        </Text>
        <Text style={[styles.jobRole, { color: colors.text }]}>{concept.jobRole}</Text>
        <Text style={[styles.jobScenario, { color: colors.text }]}>{concept.jobScenario}</Text>
      </View>

      <View style={styles.tagsRow}>
        <Text style={[styles.tagsLabel, { color: colors.textMuted }]}>
          {concept.alsoAppliesLabel ?? 'Also comes up in:'}
        </Text>
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
    ...typography.micro,
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
    ...typography.mono,
    fontWeight: '800',
  },
  body: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  jobBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  jobLabel: {
    ...typography.micro,
    marginBottom: spacing.xs,
  },
  jobRole: {
    ...typography.bodyStrong,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  jobScenario: {
    ...typography.body,
  },
  tagsRow: {
    marginBottom: spacing.lg,
  },
  tagsLabel: {
    ...typography.caption,
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
    ...typography.caption,
  },
  sectionLabel: {
    ...typography.micro,
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
    ...typography.label,
    fontWeight: '700',
  },
  formulaText: {
    ...typography.mono,
  },
  spacer: {
    height: spacing.lg,
  },
});
