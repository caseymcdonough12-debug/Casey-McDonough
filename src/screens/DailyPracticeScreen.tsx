import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import PracticeQuestion from '../components/PracticeQuestion';
import { useProgress } from '../context/ProgressContext';
import { DAILY_PRACTICE_NODE_ID, generateDailyQuestions } from '../data/dailyQuestions';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { todayStr } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyPractice'>;

export default function DailyPracticeScreen({ route, navigation }: Props) {
  const { trackId } = route.params;
  const { colors } = useTheme();
  const { recordAnswer, completeDailyPractice } = useProgress();

  const questions = useMemo(() => generateDailyQuestions(trackId, todayStr()), [trackId]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  if (!question) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 24 }}>
          Daily practice isn't available for this track yet.
        </Text>
      </View>
    );
  }

  const handleSubmit = async (correct: boolean) => {
    const earned = await recordAnswer(trackId, question.difficultyTier, correct);
    setXpEarned((prev) => prev + earned);
    if (correct) setCorrectCount((prev) => prev + 1);
  };

  const handleContinue = async () => {
    if (isLast) {
      await completeDailyPractice(trackId);
      navigation.replace('Completion', {
        trackId,
        nodeId: DAILY_PRACTICE_NODE_ID,
        xpEarned,
        correctCount,
        totalCount: questions.length,
        fromExplore: false,
        isDaily: true,
      });
      return;
    }
    setIndex((prev) => prev + 1);
  };

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
          key={question.id}
          question={question}
          progressLabel={`Problem ${index + 1} of ${questions.length}`}
          continueLabel={isLast ? "Finish today's practice" : 'Next problem'}
          onSubmit={handleSubmit}
          onContinue={handleContinue}
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
