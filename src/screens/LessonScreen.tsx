import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ConceptTeachingCard from '../components/ConceptTeachingCard';
import PracticeQuestion from '../components/PracticeQuestion';
import { useProgress } from '../context/ProgressContext';
import { ACCOUNTING_CONCEPTS } from '../data/accountingConcepts';
import { ACCOUNTING_QUESTIONS } from '../data/accountingBasics';
import { CONSULTING_CONCEPTS } from '../data/consultingConcepts';
import { CONSULTING_QUESTIONS } from '../data/consultingBasics';
import { EXCEL_BASICS_QUESTIONS } from '../data/excelBasics';
import { EXCEL_CONCEPTS } from '../data/excelConcepts';
import { MARKETING_CONCEPTS } from '../data/marketingConcepts';
import { MARKETING_QUESTIONS } from '../data/marketingBasics';
import { OPERATIONS_CONCEPTS } from '../data/operationsConcepts';
import { OPERATIONS_QUESTIONS } from '../data/operationsBasics';
import { STARTUPS_CONCEPTS } from '../data/startupsConcepts';
import { STARTUPS_QUESTIONS } from '../data/startupsBasics';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { ConceptTeaching, LessonQuestion } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const QUESTIONS_BY_NODE: Record<string, LessonQuestion[]> = {
  'finance-excel-basics': EXCEL_BASICS_QUESTIONS,
  'accounting-debits-credits': ACCOUNTING_QUESTIONS,
  'marketing-positioning-channels': MARKETING_QUESTIONS,
  'consulting-structured-problem-solving': CONSULTING_QUESTIONS,
  'startups-unit-economics': STARTUPS_QUESTIONS,
  'operations-process-bottlenecks': OPERATIONS_QUESTIONS,
};

const CONCEPTS_BY_NODE: Record<string, Record<string, ConceptTeaching>> = {
  'finance-excel-basics': EXCEL_CONCEPTS,
  'accounting-debits-credits': ACCOUNTING_CONCEPTS,
  'marketing-positioning-channels': MARKETING_CONCEPTS,
  'consulting-structured-problem-solving': CONSULTING_CONCEPTS,
  'startups-unit-economics': STARTUPS_CONCEPTS,
  'operations-process-bottlenecks': OPERATIONS_CONCEPTS,
};

export default function LessonScreen({ route, navigation }: Props) {
  const { trackId, nodeId, fromExplore } = route.params;
  const { colors } = useTheme();
  const { recordAnswer, completeNode } = useProgress();

  const questions = QUESTIONS_BY_NODE[nodeId] ?? [];
  const concepts = CONCEPTS_BY_NODE[nodeId] ?? {};

  const conceptOrder = useMemo(() => {
    const seen: string[] = [];
    for (const q of questions) {
      if (!seen.includes(q.conceptId)) seen.push(q.conceptId);
    }
    return seen;
  }, [questions]);

  const [conceptIndex, setConceptIndex] = useState(0);
  const [withinConceptIndex, setWithinConceptIndex] = useState(0);
  const [phase, setPhase] = useState<'learn' | 'practice'>(
    conceptOrder.length > 0 ? 'learn' : 'practice'
  );
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 24 }}>
          This lesson isn't available yet.
        </Text>
      </View>
    );
  }

  const currentConceptId = conceptOrder[conceptIndex];
  const conceptQuestions = questions.filter((q) => q.conceptId === currentConceptId);
  const currentQuestion = conceptQuestions[withinConceptIndex];
  const isLastConcept = conceptIndex === conceptOrder.length - 1;
  const isLastQuestionInConcept = withinConceptIndex === conceptQuestions.length - 1;
  const isFinalQuestion = isLastConcept && isLastQuestionInConcept;

  const globalQuestionNumber =
    questions.findIndex((q) => q.id === currentQuestion.id) + 1;

  const finishLesson = async () => {
    await completeNode(trackId, nodeId);
    navigation.replace('Completion', {
      trackId,
      nodeId,
      xpEarned,
      correctCount,
      totalCount: questions.length,
      fromExplore,
    });
  };

  const handleSubmit = async (correct: boolean) => {
    const earned = await recordAnswer(trackId, currentQuestion.difficultyTier, correct);
    setXpEarned((prev) => prev + earned);
    if (correct) setCorrectCount((prev) => prev + 1);
  };

  const handlePracticeContinue = async () => {
    if (isFinalQuestion) {
      await finishLesson();
      return;
    }
    if (isLastQuestionInConcept) {
      setConceptIndex((prev) => prev + 1);
      setWithinConceptIndex(0);
      setPhase('learn');
    } else {
      setWithinConceptIndex((prev) => prev + 1);
    }
  };

  if (phase === 'learn' && concepts[currentConceptId]) {
    return (
      <ConceptTeachingCard
        concept={concepts[currentConceptId]}
        onReady={() => setPhase('practice')}
      />
    );
  }

  const continueLabel = isFinalQuestion
    ? 'Finish lesson'
    : isLastQuestionInConcept
      ? 'Continue'
      : 'Next question';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <PracticeQuestion
          key={currentQuestion.id}
          question={currentQuestion}
          progressLabel={`Question ${globalQuestionNumber} of ${questions.length}`}
          continueLabel={continueLabel}
          onSubmit={handleSubmit}
          onContinue={handlePracticeContinue}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
