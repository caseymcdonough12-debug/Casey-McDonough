import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { buildWeeklyReport } from '../../data/weeklyReport';
import { useProgress } from '../../context/ProgressContext';
import { useUser } from '../../context/UserContext';
import { RootStackParamList } from '../../navigation/types';
import { radius, spacing } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyReport'>;

function nextSundayLabel(): string {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  return next.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
}

export default function WeeklyReportScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { profile } = useUser();
  const { progress } = useProgress();

  const report = buildWeeklyReport(progress);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>PREVIEW</Text>
      <Text style={[styles.title, { color: colors.text }]}>Your Weekly Report</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Every Sunday, {profile.accountName ?? 'you'} gets an email like this. Next one lands {nextSundayLabel()}.
      </Text>

      {!report ? (
        <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Answer a few practice questions this week and your first Sunday report will show up here.
          </Text>
        </View>
      ) : (
        <>
          <ReportCard number={1} section={report.report1} colors={colors} />
          <ReportCard number={2} section={report.report2} colors={colors} />
          <ReportCard number={3} section={report.report3} colors={colors} />
        </>
      )}

      <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
        ✉️ This is a preview built from your practice activity — in the full version it arrives in your inbox
        every Sunday morning. Not professional or financial advice.
      </Text>
    </ScrollView>
  );
}

function ReportCard({
  number,
  section,
  colors,
}: {
  number: number;
  section: { headline: string; detail: string; items?: string[] };
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
        <Text style={[styles.numberBadgeText, { color: colors.onPrimary }]}>{number}</Text>
      </View>
      <Text style={[styles.cardHeadline, { color: colors.text }]}>{section.headline}</Text>
      {section.detail ? (
        <Text style={[styles.cardDetail, { color: colors.textMuted }]}>{section.detail}</Text>
      ) : null}
      {section.items && (
        <View style={styles.itemsList}>
          {section.items.map((item) => (
            <View key={item} style={styles.itemRow}>
              <Text style={[styles.itemBullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.itemText, { color: colors.text }]}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptyBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardHeadline: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  cardDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemsList: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  itemBullet: {
    fontSize: 14,
    fontWeight: '800',
  },
  itemText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});
