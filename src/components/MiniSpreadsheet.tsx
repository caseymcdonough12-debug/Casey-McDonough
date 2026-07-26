import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { LessonQuestion } from '../types';

interface Props {
  columnHeaders: string[];
  cells: LessonQuestion['cells'];
}

const CELL_WIDTH = 82;
const ROW_LABEL_WIDTH = 32;

export default function MiniSpreadsheet({ columnHeaders, cells }: Props) {
  const { colors } = useTheme();

  const rows = Array.from(new Set(cells.map((c) => c.row))).sort((a, b) => a - b);
  const columnLetters = columnHeaders.map((_, i) => String.fromCharCode(65 + i));

  const valueAt = (row: number, col: number) =>
    cells.find((c) => c.row === row && c.col === col)?.value ?? '';

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.table, { borderColor: colors.border }]}>
        <View style={[styles.row, { backgroundColor: colors.surfaceRaised }]}>
          <View style={[styles.cell, { width: ROW_LABEL_WIDTH, borderColor: colors.border }]} />
          {columnLetters.map((letter) => (
            <View key={letter} style={[styles.cell, { width: CELL_WIDTH, borderColor: colors.border }]}>
              <Text style={[styles.letterText, { color: colors.textMuted }]}>{letter}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <View style={[styles.cell, { width: ROW_LABEL_WIDTH, borderColor: colors.border }]}>
            <Text style={[styles.rowLabelText, { color: colors.textMuted }]}>1</Text>
          </View>
          {columnHeaders.map((header, i) => (
            <View key={i} style={[styles.cell, { width: CELL_WIDTH, borderColor: colors.border }]}>
              <Text style={[styles.headerText, { color: colors.text }]} numberOfLines={1}>
                {header}
              </Text>
            </View>
          ))}
        </View>

        {rows.map((row) => (
          <View key={row} style={[styles.row, { backgroundColor: colors.surface }]}>
            <View style={[styles.cell, { width: ROW_LABEL_WIDTH, borderColor: colors.border }]}>
              <Text style={[styles.rowLabelText, { color: colors.textMuted }]}>{row}</Text>
            </View>
            {columnLetters.map((_, i) => (
              <View key={i} style={[styles.cell, { width: CELL_WIDTH, borderColor: colors.border }]}>
                <Text style={[styles.valueText, { color: colors.text }]} numberOfLines={1}>
                  {valueAt(row, i + 1)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    padding: spacing.xs,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 36,
  },
  letterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rowLabelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  valueText: {
    fontSize: 12,
  },
});
