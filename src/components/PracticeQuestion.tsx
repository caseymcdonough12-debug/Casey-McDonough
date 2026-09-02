import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MiniSpreadsheet from './MiniSpreadsheet';
import PrimaryButton from './PrimaryButton';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { LessonQuestion } from '../types';
import { isFormulaCorrect } from '../utils/formula';
import { isNumericCorrect } from '../utils/numeric';

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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchSelections, setMatchSelections] = useState<Record<string, number>>({});

  const matchingPairs = question.kind === 'matching' ? question.pairs : null;
  const shuffledRight = useMemo(() => {
    if (!matchingPairs) return [];
    const arr = matchingPairs.map((p) => ({ text: p.right }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);
  const usedRightIndices = new Set(Object.values(matchSelections));

  const handleLeftPress = (pairId: string) => {
    if (feedback !== null) return;
    if (matchSelections[pairId] !== undefined) {
      setMatchSelections((prev) => {
        const next = { ...prev };
        delete next[pairId];
        return next;
      });
      setSelectedLeftId(pairId);
      return;
    }
    setSelectedLeftId(pairId);
  };

  const handleRightPress = (rightIdx: number) => {
    if (feedback !== null || usedRightIndices.has(rightIdx) || !selectedLeftId) return;
    setMatchSelections((prev) => ({ ...prev, [selectedLeftId]: rightIdx }));
    setSelectedLeftId(null);
  };

  const canCheck =
    question.kind === 'multipleChoice'
      ? selectedOptionId !== null
      : question.kind === 'matching'
        ? Object.keys(matchSelections).length === question.pairs.length
        : !!input.trim();

  const handleCheck = async () => {
    if (!canCheck) return;
    let correct = false;
    if (question.kind === 'formula') {
      correct = isFormulaCorrect(input, question.acceptedFormulas);
    } else if (question.kind === 'numeric') {
      correct = isNumericCorrect(input, question.correctValue, question.tolerance);
    } else if (question.kind === 'matching') {
      correct = question.pairs.every(
        (p) => shuffledRight[matchSelections[p.id]]?.text === p.right
      );
    } else {
      correct = selectedOptionId === question.correctOptionId;
    }
    await onSubmit(correct);
    setFeedback(correct ? 'correct' : 'incorrect');
  };

  const correctAnswerDisplay =
    question.kind === 'formula'
      ? question.correctFormula
      : question.kind === 'numeric'
        ? `${question.targetLabel}: ${question.correctValue}${question.unit ?? ''}`
        : question.kind === 'matching'
          ? question.pairs.map((p) => `${p.left} → ${p.right}`).join('   •   ')
          : question.options.find((o) => o.id === question.correctOptionId)?.text ?? '';

  return (
    <View style={styles.container}>
      <Text style={[styles.progress, { color: colors.textMuted }]}>{progressLabel}</Text>

      {question.scenarioTag && (
        <View style={[styles.scenarioTag, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <Text style={[styles.scenarioTagText, { color: colors.textMuted }]}>{question.scenarioTag}</Text>
        </View>
      )}

      {'context' in question && question.context && (
        <Text style={[styles.context, { color: colors.textMuted }]}>{question.context}</Text>
      )}

      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>

      {question.kind === 'formula' && (
        <>
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
        </>
      )}

      {question.kind === 'numeric' && (
        <>
          {question.cells && question.columnHeaders && (
            <MiniSpreadsheet columnHeaders={question.columnHeaders} cells={question.cells} />
          )}
          <View style={styles.inputRow}>
            <Text style={[styles.cellLabel, { color: colors.textMuted }]}>
              {question.targetLabel}
            </Text>
            <TextInput
              value={input}
              onChangeText={setInput}
              editable={feedback === null}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
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
            {question.unit && (
              <Text style={[styles.unit, { color: colors.textMuted }]}>{question.unit}</Text>
            )}
          </View>
        </>
      )}

      {question.kind === 'multipleChoice' && (
        <View style={styles.optionsList}>
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === question.correctOptionId;
            const showResult = feedback !== null;
            const borderColor = showResult
              ? isCorrectOption
                ? colors.success
                : isSelected
                  ? colors.danger
                  : colors.border
              : isSelected
                ? colors.primary
                : colors.border;

            return (
              <Pressable
                key={option.id}
                disabled={feedback !== null}
                onPress={() => setSelectedOptionId(option.id)}
                style={[
                  styles.option,
                  {
                    backgroundColor: colors.surface,
                    borderColor,
                    borderWidth: isSelected || (showResult && isCorrectOption) ? 2 : 1,
                  },
                ]}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{option.text}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {question.kind === 'matching' && (
        <>
          <Text style={[styles.matchingHint, { color: colors.textMuted }]}>
            Tap a line item, then tap the statement it belongs to.
          </Text>
          <View style={styles.matchingRow}>
            <View style={styles.matchingCol}>
              {question.pairs.map((p) => {
                const rightIdx = matchSelections[p.id];
                const isMatched = rightIdx !== undefined;
                const isSelected = selectedLeftId === p.id;
                const isPairCorrect = feedback !== null && isMatched && shuffledRight[rightIdx]?.text === p.right;
                const borderColor =
                  feedback !== null
                    ? isPairCorrect
                      ? colors.success
                      : colors.danger
                    : isSelected
                      ? colors.primary
                      : isMatched
                        ? colors.textMuted
                        : colors.border;
                return (
                  <Pressable
                    key={p.id}
                    disabled={feedback !== null}
                    onPress={() => handleLeftPress(p.id)}
                    style={[
                      styles.matchItem,
                      { backgroundColor: colors.surface, borderColor, borderWidth: isSelected ? 2 : 1.5 },
                    ]}
                  >
                    <Text style={[styles.matchItemText, { color: colors.text }]}>{p.left}</Text>
                    {isMatched && (
                      <Text
                        style={[
                          styles.matchItemArrow,
                          { color: feedback !== null ? borderColor : colors.textMuted },
                        ]}
                      >
                        → {shuffledRight[rightIdx]?.text}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.matchingCol}>
              {shuffledRight.map((r, idx) => {
                const isUsed = usedRightIndices.has(idx);
                return (
                  <Pressable
                    key={idx}
                    disabled={feedback !== null || isUsed}
                    onPress={() => handleRightPress(idx)}
                    style={[
                      styles.matchItem,
                      {
                        backgroundColor: colors.surface,
                        borderColor: isUsed ? colors.textMuted : colors.border,
                        borderWidth: 1.5,
                        opacity: isUsed ? 0.4 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.matchItemText, { color: colors.text }]}>{r.text}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </>
      )}

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
          <Text style={[styles.feedbackAnswer, { color: colors.text }]}>
            {correctAnswerDisplay}
          </Text>
          <Text style={[styles.feedbackExplanation, { color: colors.textMuted }]}>
            {question.explanation}
          </Text>
        </View>
      )}

      <View style={styles.spacer} />

      {feedback === null ? (
        <PrimaryButton title="Check" onPress={handleCheck} disabled={!canCheck} />
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
  scenarioTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  scenarioTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  context: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
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
  unit: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionsList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  matchingHint: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  matchingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  matchingCol: {
    flex: 1,
    gap: spacing.sm,
  },
  matchItem: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  matchItemText: {
    fontSize: 13,
    fontWeight: '600',
  },
  matchItemArrow: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
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
  feedbackAnswer: {
    fontSize: 15,
    fontWeight: '700',
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
