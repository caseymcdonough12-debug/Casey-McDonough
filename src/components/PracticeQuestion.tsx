import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import MiniSpreadsheet from './MiniSpreadsheet';
import PrimaryButton from './PrimaryButton';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { LessonQuestion } from '../types';
import { isFormulaCorrect } from '../utils/formula';

interface Props {
  question: LessonQuestion;
  progressLabel: string;
  continueLabel: string;
  onSubmit: (correct: boolean) => void | Promise<void>;
  onContinue: () => void;
}

export default function PracticeQuestion({
  question,
  progressLabel,
  continueLabel,
  onSubmit,
  onContinue,
}: Props) {
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleCheck = async () => {
    if (!input.trim()) return;
    const correct = isFormulaCorrect(input, question.acceptedFormulas);
    await onSubmit(correct);
    setFeedback(correct ? 'correct' : 'incorrect');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.progress, { color: colors.textMuted }]}>{progressLabel}</Text>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>

      <MiniSpreadsheet columnHeaders={question.columnHeaders} cells={question.cells} />

      <View style={styles.inputRow}>
        <Text style={[styles.cellLabel, { color: colors.textMuted }]}>
          {question.targetCellLabel}
        </Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          editable={feedback === null}
          placeholder="=SUM(...)"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor:
                feedback === 'correct'
                  ? colors.success
                  : feedback === 'incorrect'
                    ? colors.danger
                    : colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        />
      </View>

      {feedback && (
        <View
          style={[
            styles.feedbackBox,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: feedback === 'correct' ? colors.success : colors.danger,
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackTitle,
              { color: feedback === 'correct' ? colors.success : colors.danger },
            ]}
          >
            {feedback === 'correct' ? 'Correct!' : 'Not quite'}
          </Text>
          <Text style={[styles.feedbackFormula, { color: colors.text }]}>
            {question.correctFormula}
          </Text>
          <Text style={[styles.feedbackExplanation, { color: colors.textMuted }]}>
            {question.explanation}
          </Text>
        </View>
      )}

      <View style={styles.spacer} />

      {feedback === null ? (
        <PrimaryButton title="Check" onPress={handleCheck} disabled={!input.trim()} />
      ) : (
        <PrimaryButton title={continueLabel} onPress={onContinue} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  progress: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  prompt: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cellLabel: {
    fontSize: 13,
    fontWeight: '700',
    width: 32,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  feedbackBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  feedbackFormula: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: spacing.xs,
  },
  feedbackExplanation: {
    fontSize: 13,
    lineHeight: 19,
  },
  spacer: {
    height: spacing.xl,
  },
});
