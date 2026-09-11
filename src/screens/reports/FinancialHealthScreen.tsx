import React, { useState, useEffect } from 'react';
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
import { formatCurrency } from '../../utils/formatters';
import { useAuth, useTransactions } from '../../hooks';

export default function FinancialHealthScreen({ navigation }: any) {
  const { user } = useAuth();
  const { transactions, getTotalByType } = useTransactions(user?.id);

  const income = getTotalByType('income');
  const expense = getTotalByType('expense');
  const balance = income - expense;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  const healthScore = Math.min(100, Math.max(0,
    (savingsRate * 0.4) +
    (transactions.length > 0 ? 30 : 0) +
    (balance > 0 ? 30 : 0)
  ));

  const getHealthColor = () => {
    if (healthScore >= 80) return colors.income;
    if (healthScore >= 50) return colors.warning;
    return colors.expense;
  };

  const getHealthLabel = () => {
    if (healthScore >= 80) return 'Excelente';
    if (healthScore >= 60) return 'Bom';
    if (healthScore >= 40) return 'Regular';
    return 'Atenção';
  };

  const tips = [
    {
      icon: 'wallet',
      title: 'Reserva de Emergência',
      description: 'Mantenha 3-6 meses de despesas guardadas',
      status: balance > expense * 3,
    },
    {
      icon: 'trending-up',
      title: 'Poupança',
      description: 'Tente poupar pelo menos 20% da renda',
      status: savingsRate >= 20,
    },
    {
      icon: 'card',
      title: 'Contas em Dia',
      description: 'Mantenha todas as contas pagas',
      status: true,
    },
    {
      icon: 'pie-chart',
      title: 'Orçamento',
      description: 'Defina e acompanhe seus orçamentos',
      status: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Saúde Financeira</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.scoreCard, { borderColor: getHealthColor() }]}>
          <View style={[styles.scoreCircle, { borderColor: getHealthColor() }]}>
            <Text style={[styles.scoreValue, { color: getHealthColor() }]}>
              {Math.round(healthScore)}
            </Text>
            <Text style={styles.scoreLabel}>pontos</Text>
          </View>
          <Text style={[styles.healthLabel, { color: getHealthColor() }]}>
            {getHealthLabel()}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Renda Mensal</Text>
            <Text style={[styles.statValue, { color: colors.income }]}>
              {formatCurrency(income)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gastos Mensais</Text>
            <Text style={[styles.statValue, { color: colors.expense }]}>
              {formatCurrency(Math.abs(expense))}
            </Text>
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Dicas para Melhorar</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: tip.status ? colors.income + '20' : colors.warning + '20' }]}>
                <Ionicons
                  name={tip.icon as any}
                  size={24}
                  color={tip.status ? colors.income : colors.warning}
                />
              </View>
              <View style={styles.tipInfo}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
              <Ionicons
                name={tip.status ? 'checkmark-circle' : 'alert-circle'}
                size={24}
                color={tip.status ? colors.income : colors.warning}
              />
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Budget')}>
            <Ionicons name="wallet" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Orçamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Goals')}>
            <Ionicons name="flag" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Metas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Reports')}>
            <Ionicons name="bar-chart" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Relatórios</Text>
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
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 2,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  scoreLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  healthLabel: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  tipsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  tipDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
});
