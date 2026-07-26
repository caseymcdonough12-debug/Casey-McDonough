import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { RootStackParamList } from '../../navigation/types';
import { radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ExploreFeedback'>;

export default function ExploreFeedbackScreen({ route, navigation }: Props) {
  const { trackId } = route.params;
  const { colors } = useTheme();
  const { recordExploreFeedback } = useProgress();
  const [submitting, setSubmitting] = useState(false);

  const goToExplore = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            state: {
              routes: [{ name: 'Explore' }],
            },
          },
        ],
      })
    );
  };

  const handleFeedback = async (liked: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    await recordExploreFeedback(trackId, liked);
    goToExplore();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Did that feel interesting?</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => handleFeedback(false)}
          style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={styles.emoji}>👎</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFeedback(true)}
          style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={styles.emoji}>👍</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  button: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 36,
  },
});
