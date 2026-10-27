import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const MAX_WIDTH = 480;

/**
 * Rung is a phone-shaped product. On a wide screen the layout would otherwise
 * stretch edge to edge, so centre it in a phone-width column and let the
 * surrounding area fall back to a muted backdrop.
 */
export default function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.backdrop,
        { backgroundColor: isDark ? '#060A14' : '#E8EBF0' },
      ]}
    >
      <View style={[styles.column, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_WIDTH,
  },
});
