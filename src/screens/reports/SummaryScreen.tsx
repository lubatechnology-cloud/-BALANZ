import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { CountUp } from '../../components/ui/Animations';
import { formatCurrency } from '../../utils/formatters';
import { useAuth, useTransactions } from '../../hooks';

export default function SummaryScreen({ navigation }: any) {
  const { user } = useAuth();
  const { transactions, getTotalByType, getExpensesByCategory } = useTransactions(user?.id);

  const income = getTotalByType('income');
  const expense = getTotalByType('expense');
  const balance = income - expense;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  const expensesByCategory = getExpensesByCategory();
  const topCategory = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0];

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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Resumo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <CountUp
            value={balance}
            style={[styles.balanceValue, { color: balance >= 0 ? colors.income : colors.expense }]}
            prefix="R$ "
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: colors.income }]}>
            <Ionicons name="trending-up" size={24} color={colors.income} />
            <Text style={styles.statLabel}>Receitas</Text>
            <Text style={[styles.statValue, { color: colors.income }]}>
              {formatCurrency(income)}
            </Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: colors.expense }]}>
            <Ionicons name="trending-down" size={24} color={colors.expense} />
            <Text style={styles.statLabel}>Despesas</Text>
            <Text style={[styles.statValue, { color: colors.expense }]}>
              {formatCurrency(Math.abs(expense))}
            </Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
            <Ionicons name="pie-chart" size={24} color={colors.primary} />
            <Text style={styles.statLabel}>Taxa de Poupança</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {savingsRate.toFixed(1)}%
            </Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
            <Ionicons name="receipt" size={24} color={colors.warning} />
            <Text style={styles.statLabel}>Transações</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {transactions.length}
            </Text>
          </View>
        </View>

        {topCategory && (
          <View style={styles.insightCard}>
            <Ionicons name="bulb" size={24} color={colors.primary} />
            <View style={styles.insightInfo}>
              <Text style={styles.insightTitle}>Maior Gasto</Text>
              <Text style={styles.insightText}>
                Sua maior categoria de gastos é{' '}
                <Text style={{ fontWeight: 'bold', color: categoryColors[topCategory[0]] || colors.primary }}>
                  {topCategory[0]}
                </Text>{' '}
                com {formatCurrency(topCategory[1])}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('TransactionList')}>
            <Ionicons name="list" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Ver Transações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Reports')}>
            <Ionicons name="bar-chart" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="download" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Exportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="share" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Compartilhar</Text>
          </TouchableOpacity>
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
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  balanceLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  balanceValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    borderLeftWidth: 3,
    gap: spacing.sm,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  insightCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  insightText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
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
});
