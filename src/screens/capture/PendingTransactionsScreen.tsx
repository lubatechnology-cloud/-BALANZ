import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

export default function PendingTransactionsScreen({ navigation }: any) {
  const pendingTransactions: any[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Pendentes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {pendingTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color={colors.income} />
            <Text style={styles.emptyTitle}>Tudo em dia!</Text>
            <Text style={styles.emptySubtitle}>
              Nenhuma transação pendente de confirmação
            </Text>
          </View>
        ) : (
          pendingTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Ionicons
                  name={transaction.source === 'sms' ? 'chatbubble' : 'mail'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.source}>{transaction.source}</Text>
              </View>
              <Text style={styles.description}>{transaction.description}</Text>
              <Text style={styles.amount}>
                {transaction.type === 'income' ? '+' : '-'} R${' '}
                {transaction.amount.toFixed(2)}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.rejectButton}>
                  <Ionicons name="close" size={20} color={colors.expense} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton}>
                  <Ionicons name="checkmark" size={20} color={colors.income} />
                </TouchableOpacity>
              </View>
            </View>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
  transactionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  source: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  rejectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.expense + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.income + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
