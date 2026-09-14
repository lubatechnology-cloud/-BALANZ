export const colors = {
  background: '#0A0F1C',
  backgroundSecondary: '#111827',
  surface: '#1A2332',
  surfaceLight: '#243044',
  surfaceHighlight: '#2D3B50',

  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5A4BD1',

  secondary: '#00CEC9',
  secondaryLight: '#81ECEC',

  income: '#00B894',
  incomeLight: '#55EFC4',
  expense: '#FF6B6B',
  expenseLight: '#FF8787',
  warning: '#FDCB6E',
  warningLight: '#FFEAA7',
  info: '#74B9FF',

  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  border: '#2D3B50',
  borderLight: '#374357',

  danger: '#FF6B6B',
  divider: '#2D3B50',
  white: '#FFFFFF',
  black: '#000000',

  gradient: {
    primary: ['#6C5CE7', '#A29BFE'] as const,
    dark: ['#0A0F1C', '#1A2332'] as const,
    card: ['#1A2332', '#243044'] as const,
    income: ['#00B894', '#55EFC4'] as const,
    expense: ['#FF6B6B', '#FF8787'] as const,
    premium: ['#6C5CE7', '#00CEC9'] as const,
  },
};

export type ColorKey = keyof typeof colors;
