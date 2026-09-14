import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import { useTransactions, useAuth } from '../../hooks';

const { width } = Dimensions.get('window');

export default function ReportsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { transactions, getTotalByType, getExpensesByCategory } = useTransactions(user?.id);

  const income = getTotalByType('income');
  const expense = getTotalByType('expense');
  const balance = income - expense;

  const expensesByCategory = getExpensesByCategory();
  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const categoryColors: Record<string, string> = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    salary: '#2ECC71',
    health: '#E74C3C',
    housing: '#9B59B6',
    leisure: '#F1C40F',
    shopping: '#E67E22',
    supermarket: '#1ABC9C',
    restaurant: '#FF6348',
    delivery: '#FF9F43',
    uber: '#54A0FF',
    fuel: '#5F27CD',
    rent: '#C44569',
    streaming: '#3DC1D3',
    gym: '#F8A5C2',
    other_expense: '#95AABD',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Relatórios</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Receitas</Text>
              <Text style={[styles.summaryValue, { color: colors.income }]}>
                {formatCurrency(income)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Despesas</Text>
              <Text style={[styles.summaryValue, { color: colors.expense }]}>
                {formatCurrency(Math.abs(expense))}
              </Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Saldo</Text>
            <Text
              style={[
                styles.balanceValue,
                { color: balance >= 0 ? colors.income : colors.expense },
              ]}
            >
              {formatCurrency(balance)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
          {topCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Sem dados para exibir</Text>
            </View>
          ) : (
            topCategories.map(([category, amount], index) => {
              const maxAmount = topCategories[0][1];
              const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
              const color = categoryColors[category] || colors.textMuted;

              return (
                <View key={category} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[styles.categoryDot, { backgroundColor: color }]}
                    />
                    <Text style={styles.categoryName}>{category}</Text>
                  </View>
                  <View style={styles.categoryBar}>
                    <View
                      style={[
                        styles.categoryBarFill,
                        { width: `${percentage}%`, backgroundColor: color },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(amount)}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Summary')}
            >
              <Ionicons name="document-text" size={24} color={colors.primary} />
              <Text style={styles.actionLabel}>Resumo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('FinancialHealth')}
            >
              <Ionicons name="heart" size={24} color={colors.primary} />
              <Text style={styles.actionLabel}>Saúde</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('TransactionList')}
            >
              <Ionicons name="list" size={24} color={colors.primary} />
              <Text style={styles.actionLabel}>Transações</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Budget')}
            >
              <Ionicons name="wallet" size={24} color={colors.primary} />
              <Text style={styles.actionLabel}>Orçamentos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Mensal</Text>
          <View style={styles.monthlyCard}>
            <Text style={styles.monthLabel}>
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Text>
            <View style={styles.monthlyStats}>
              <View style={styles.monthlyStat}>
                <Text style={styles.monthlyStatLabel}>Transações</Text>
                <Text style={styles.monthlyStatValue}>{transactions.length}</Text>
              </View>
              <View style={styles.monthlyStat}>
                <Text style={styles.monthlyStatLabel}>Ticket Médio</Text>
                <Text style={styles.monthlyStatValue}>
                  {transactions.length > 0
                    ? formatCurrency(expense / transactions.length)
                    : 'R$ 0,00'}
                </Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  summaryCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    paddingTop: spacing.md,
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    width: 80,
    textAlign: 'right',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    textAlign: 'center',
  },
  monthlyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  monthLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  monthlyStats: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  monthlyStat: {
    flex: 1,
  },
  monthlyStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  monthlyStatValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
});
