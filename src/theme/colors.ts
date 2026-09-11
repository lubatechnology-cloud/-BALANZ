export const colors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5A4BD1',

  secondary: '#00D2D3',
  secondaryLight: '#55EFC4',
  secondaryDark: '#01A3A4',

  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  info: '#74B9FF',

  background: '#0A0F1C',
  surface: '#141B2D',
  surfaceLight: '#1E2A42',
  surfaceElevated: '#243352',

  text: '#FFFFFF',
  textSecondary: '#B2BEC3',
  textMuted: '#636E72',
  textInverse: '#0A0F1C',

  border: '#2D3436',
  borderLight: '#3D4446',
  divider: '#1E272E',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  income: '#00B894',
  expense: '#E17055',
  transfer: '#74B9FF',
} as const;

export type ColorKey = keyof typeof colors;
