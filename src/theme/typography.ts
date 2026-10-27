import { Platform, TextStyle } from 'react-native';

/**
 * One type scale for the whole app. Screens compose these instead of
 * hardcoding fontSize/fontWeight, so a change here lands everywhere.
 */
export type TypographyKey =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'micro'
  | 'button'
  | 'mono';

export const typography: Record<TypographyKey, TextStyle> = {
  // Celebration / completion headline
  display: { fontSize: 28, fontWeight: '800', lineHeight: 34 },
  // Screen titles
  title: { fontSize: 24, fontWeight: '800', lineHeight: 30 },
  // Section headers, stat values
  heading: { fontSize: 20, fontWeight: '800', lineHeight: 26 },
  // Question prompts, card headlines
  subheading: { fontSize: 17, fontWeight: '700', lineHeight: 24 },
  // Default reading text
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  // Field labels, list items, buttons
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  // Taglines, helper text
  caption: { fontSize: 12, fontWeight: '600', lineHeight: 17 },
  // Uppercase eyebrows and badges
  micro: { fontSize: 11, fontWeight: '800', lineHeight: 15, letterSpacing: 0.5 },
  // Button labels
  button: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  // Formulas and skill-name chips
  mono: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
};
