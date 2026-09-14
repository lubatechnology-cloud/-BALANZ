import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import { ProgressBar } from '../../components/charts/Charts';
import { useAuth, useTransactions } from '../../hooks';
import { getBudgets, createBudget, deleteBudget, updateBudgetSpending, Budget } from '../../services/budget/budgetService';

export default function BudgetScreen({ navigation }: any) {
  const { user } = useAuth();
  const { transactions } = useTransactions(user?.id);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    if (!user?.id) return;
    const data = await getBudgets(user.id);
    setBudgets(data);
    await updateBudgetSpending(user.id, transactions);
  };

  const handleDeleteBudget = (budget: Budget) => {
    Alert.alert(
      'Excluir orçamento',
      `Excluir orçamento de ${budget.category}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (user?.id) {
              await deleteBudget(user.id, budget.id);
              loadBudgets();
            }
          },
        },
      ]
    );
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Orçamentos</Text>
        <TouchableOpacity onPress={() => Alert.alert('Em breve', 'Criação de orçamento disponível em breve')}>
          <Ionicons name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Orçado</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalBudgeted)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Gasto</Text>
              <Text style={[styles.summaryValue, { color: colors.expense }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Restante</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: totalBudgeted - totalSpent >= 0 ? colors.income : colors.expense },
                ]}
              >
                {formatCurrency(totalBudgeted - totalSpent)}
              </Text>
            </View>
          </View>
        </View>

        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Sem orçamentos</Text>
            <Text style={styles.emptySubtitle}>
              Crie orçamentos para controlar seus gastos
            </Text>
          </View>
        ) : (
          budgets.map((budget) => (
            <TouchableOpacity
              key={budget.id}
              style={styles.budgetCard}
              onLongPress={() => handleDeleteBudget(budget)}
            >
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetCategory}>{budget.category}</Text>
                <Text style={styles.budgetPeriod}>{budget.period}</Text>
              </View>
              <ProgressBar progress={budget.percentage} height={8} />
              <View style={styles.budgetFooter}>
                <Text style={styles.budgetSpent}>
                  {formatCurrency(budget.spent)} gasto
                </Text>
                <Text style={styles.budgetRemaining}>
                  {formatCurrency(budget.remaining)} restante
                </Text>
              </View>
              <Text style={[styles.budgetPercentage, { color: budget.percentage >= 100 ? colors.expense : colors.textSecondary }]}>
                {budget.percentage.toFixed(0)}%
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  budgetCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  budgetCategory: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    textTransform: 'capitalize',
  },
  budgetPeriod: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  budgetSpent: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  budgetRemaining: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  budgetPercentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});
