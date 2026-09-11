import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  containerStyle?: any;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {leftIcon && (
          <Ionicons name={leftIcon as any} size={20} color={colors.textMuted} />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          {...props}
        />
        {rightIcon && (
          <Ionicons name={rightIcon as any} size={20} color={colors.textMuted} />
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    height: 56,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  error: {
    fontSize: typography.fontSize.sm,
    color: colors.danger,
  },
});
