import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ConceptTeachingCard from '../components/ConceptTeachingCard';
import PracticeQuestion from '../components/PracticeQuestion';
import { useProgress } from '../context/ProgressContext';
import { ACCOUNTING_CYCLE_CONCEPTS } from '../data/accountingCycleConcepts';
import { ACCOUNTING_CYCLE_QUESTIONS } from '../data/accountingCycle';
import { CONSULTING_CASE_BASICS_CONCEPTS } from '../data/consultingCaseBasicsConcepts';
import { CONSULTING_CASE_BASICS_QUESTIONS } from '../data/consultingCaseBasics';
import { ECONOMICS_PRINCIPLES_CONCEPTS } from '../data/economicsPrinciplesConcepts';
import { ECONOMICS_PRINCIPLES_QUESTIONS } from '../data/economicsPrinciples';
import { ENTREPRENEURSHIP_PITCH_DECK_CONCEPTS } from '../data/entrepreneurshipPitchDeckConcepts';
import { ENTREPRENEURSHIP_PITCH_DECK_QUESTIONS } from '../data/entrepreneurshipPitchDeck';
import { FINANCE_STATEMENTS_CONCEPTS } from '../data/financeStatementsConcepts';
import { FINANCE_STATEMENTS_QUESTIONS } from '../data/financeStatements';
import { MARKETING_METRICS_CONCEPTS } from '../data/marketingMetricsConcepts';
import { MARKETING_METRICS_QUESTIONS } from '../data/marketingMetrics';
import { OPERATIONS_PROCESS_MAPPING_CONCEPTS } from '../data/operationsProcessMappingConcepts';
import { OPERATIONS_PROCESS_MAPPING_QUESTIONS } from '../data/operationsProcessMapping';
import { PERSONAL_FINANCE_BUDGETING_CONCEPTS } from '../data/personalFinanceBudgetingConcepts';
import { PERSONAL_FINANCE_BUDGETING_QUESTIONS } from '../data/personalFinanceBudgeting';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { ConceptTeaching, LessonQuestion } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const QUESTIONS_BY_NODE: Record<string, LessonQuestion[]> = {
  'finance-reading-statements': FINANCE_STATEMENTS_QUESTIONS,
  'personalfinance-budgeting-saving': PERSONAL_FINANCE_BUDGETING_QUESTIONS,
  'economics-core-principles': ECONOMICS_PRINCIPLES_QUESTIONS,
  'accounting-cycle': ACCOUNTING_CYCLE_QUESTIONS,
  'entrepreneurship-pitch-deck': ENTREPRENEURSHIP_PITCH_DECK_QUESTIONS,
  'consulting-case-basics': CONSULTING_CASE_BASICS_QUESTIONS,
  'marketing-campaign-metrics': MARKETING_METRICS_QUESTIONS,
  'operations-process-mapping': OPERATIONS_PROCESS_MAPPING_QUESTIONS,
};

const CONCEPTS_BY_NODE: Record<string, Record<string, ConceptTeaching>> = {
  'finance-reading-statements': FINANCE_STATEMENTS_CONCEPTS,
  'personalfinance-budgeting-saving': PERSONAL_FINANCE_BUDGETING_CONCEPTS,
  'economics-core-principles': ECONOMICS_PRINCIPLES_CONCEPTS,
  'accounting-cycle': ACCOUNTING_CYCLE_CONCEPTS,
  'entrepreneurship-pitch-deck': ENTREPRENEURSHIP_PITCH_DECK_CONCEPTS,
  'consulting-case-basics': CONSULTING_CASE_BASICS_CONCEPTS,
  'marketing-campaign-metrics': MARKETING_METRICS_CONCEPTS,
  'operations-process-mapping': OPERATIONS_PROCESS_MAPPING_CONCEPTS,
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
