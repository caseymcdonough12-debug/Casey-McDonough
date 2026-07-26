export interface ThemeColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  primary: string;
  primaryDark: string;
  onPrimary: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  locked: string;
  success: string;
  danger: string;
}

export const lightColors: ThemeColors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  primary: '#10B981',
  primaryDark: '#059669',
  onPrimary: '#FFFFFF',
  accent: '#F59E0B',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  locked: '#D1D5DB',
  success: '#10B981',
  danger: '#EF4444',
};

export const darkColors: ThemeColors = {
  background: '#0B1120',
  surface: '#151C2C',
  surfaceRaised: '#1C2438',
  primary: '#34D399',
  primaryDark: '#10B981',
  onPrimary: '#0B1120',
  accent: '#FBBF24',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  border: '#263248',
  locked: '#374151',
  success: '#34D399',
  danger: '#F87171',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};
