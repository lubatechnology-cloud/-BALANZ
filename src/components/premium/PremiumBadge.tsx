import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ size = 'md' }: PremiumBadgeProps) {
  const sizes = {
    sm: { fontSize: 10, paddingHorizontal: 6, paddingVertical: 2 },
    md: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4 },
    lg: { fontSize: 14, paddingHorizontal: 12, paddingVertical: 6 },
  };

  return (
    <View style={[styles.badge, { paddingHorizontal: sizes[size].paddingHorizontal, paddingVertical: sizes[size].paddingVertical }]}>
      <Ionicons name="diamond" size={sizes[size].fontSize} color={colors.warning} />
      <Text style={[styles.text, { fontSize: sizes[size].fontSize }]}>PRO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    borderRadius: 6,
    gap: 4,
  },
  text: {
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
  },
});
