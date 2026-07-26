import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MiniSpreadsheet from '../components/MiniSpreadsheet';
import PrimaryButton from '../components/PrimaryButton';
import { useProgress } from '../context/ProgressContext';
import { EXCEL_BASICS_QUESTIONS } from '../data/excelBasics';
import { RootStackParamList } from '../navigation/types';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { isFormulaCorrect } from '../utils/formula';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const QUESTIONS_BY_NODE: Record<string, typeof EXCEL_BASICS_QUESTIONS> = {
  'finance-excel-basics': EXCEL_BASICS_QUESTIONS,
};

export default function LessonScreen({ route, navigation }: Props) {
  const { trackId, nodeId, fromExplore } = route.params;
  const { colors } = useTheme();
  const { recordAnswer, completeNode } = useProgress();

  const questions = QUESTIONS_BY_NODE[nodeId] ?? [];
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const question = questions[index];
  const isLastQuestion = index === questions.length - 1;

  if (!question) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>This lesson isn't available yet.</Text>
      </View>
    );
  }

  const handleCheck = async () => {
    if (!input.trim()) return;
    const correct = isFormulaCorrect(input, question.acceptedFormulas);
    const earned = await recordAnswer(trackId, question.difficultyTier, correct);
    setXpEarned((prev) => prev + earned);
    if (correct) setCorrectCount((prev) => prev + 1);
    setFeedback(correct ? 'correct' : 'incorrect');
  };

  const handleContinue = async () => {
    if (isLastQuestion) {
      await completeNode(trackId, nodeId);
      navigation.replace('Completion', {
        trackId,
        nodeId,
        xpEarned,
        correctCount,
        totalCount: questions.length,
        fromExplore,
      });
      return;
    }
    setIndex((prev) => prev + 1);
    setInput('');
    setFeedback(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.progress, { color: colors.textMuted }]}>
          Question {index + 1} of {questions.length}
        </Text>
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
          <PrimaryButton
            title={isLastQuestion ? 'Finish lesson' : 'Next question'}
            onPress={handleContinue}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
