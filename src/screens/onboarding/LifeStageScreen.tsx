import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useUser } from '../../context/UserContext';
import { RootStackParamList } from '../../navigation/types';
import { radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { ExperienceLevel, LifeStage } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LifeStage'>;

const LIFE_STAGES: { id: LifeStage; label: string }[] = [
  { id: 'figuring-it-out', label: 'Still figuring it out' },
  { id: 'know-my-major', label: 'I know my major' },
  { id: 'starting-soon', label: 'Starting a job soon' },
  { id: 'just-curious', label: 'Just curious' },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: '1-3', label: '1–3 years' },
  { id: '4+', label: '4+ years' },
];

export default function LifeStageScreen({ route }: Props) {
  const { colors } = useTheme();
  const { completeOnboarding } = useUser();
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canContinue = lifeStage !== null && experience !== null && !submitting;

  const handleContinue = async () => {
    if (!lifeStage || !experience) return;
    setSubmitting(true);
    await completeOnboarding(route.params.track, lifeStage, experience);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Where are you in your work life right now?
      </Text>

      <View style={styles.optionList}>
        {LIFE_STAGES.map((option) => {
          const isSelected = lifeStage === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setLifeStage(option.id)}
              style={[
                styles.option,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.title, styles.secondTitle, { color: colors.text }]}>
        Roughly how much work experience do you have?
      </Text>
      <View style={styles.segmentRow}>
        {EXPERIENCE_LEVELS.map((option) => {
          const isSelected = experience === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setExperience(option.id)}
              style={[
                styles.segment,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: isSelected ? colors.onPrimary : colors.text },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />

      <PrimaryButton
        title={submitting ? 'Setting up...' : 'Start learning'}
        onPress={handleContinue}
        disabled={!canContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  secondTitle: {
    marginTop: spacing.lg,
  },
  optionList: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
});
