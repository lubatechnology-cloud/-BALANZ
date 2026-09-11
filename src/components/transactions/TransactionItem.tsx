import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const categoryIcons: Record<string, string> = {
  food: 'cart',
  transport: 'car',
  salary: 'briefcase',
  health: 'heart',
  housing: 'home',
  leisure: 'play-circle',
  shopping: 'bag',
  bills: 'file-text',
  education: 'book',
  investment: 'trending-up',
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const iconName = categoryIcons[transaction.category] || 'wallet';
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: (isIncome ? colors.income : colors.expense) + '20' }]}>
          <Ionicons name={iconName as any} size={20} color={isIncome ? colors.income : colors.expense} />
        </View>
        <View style={styles.info}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={styles.date}>{formatDate(new Date(transaction.date), 'relative')}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        {!transaction.isConfirmed && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Pendente</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  pendingBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: typography.fontWeight.medium,
  },
});
