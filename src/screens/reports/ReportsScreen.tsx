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
import { formatCurrency } from '../../utils/formatters';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatórios</Text>
          <Text style={styles.subtitle}>Visão geral das suas finanças</Text>
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.periodButton, styles.periodButtonActive]}>
            <Text style={[styles.periodText, styles.periodTextActive]}>Mês</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Ano</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do mês</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Receitas</Text>
              <Text style={[styles.summaryValue, { color: colors.income }]}>
                {formatCurrency(8500)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Despesas</Text>
              <Text style={[styles.summaryValue, { color: colors.expense }]}>
                {formatCurrency(3079.5)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart" size={48} color={colors.textMuted} />
          <Text style={styles.chartPlaceholderText}>Gráficos em breve</Text>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Top categorias</Text>
          {[
            { name: 'Alimentação', amount: 1200, color: colors.danger },
            { name: 'Transporte', amount: 800, color: colors.warning },
            { name: 'Moradia', amount: 1500, color: colors.info },
          ].map((cat, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <Text style={styles.categoryAmount}>{formatCurrency(cat.amount)}</Text>
            </View>
          ))}
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
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  summaryCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.xl,
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
  chartPlaceholder: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  chartPlaceholderText: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
  },
  categoriesSection: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.base,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  categoryAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
});
