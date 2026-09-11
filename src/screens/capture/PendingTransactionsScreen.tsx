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
import {
  getPendingTransactions,
  confirmPendingTransaction,
  rejectPendingTransaction,
  PendingTransaction,
} from '../../services/capture/smsService';
import { useAuth, useTransactions } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';

export default function PendingTransactionsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { addTransaction } = useTransactions(user?.id);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    const data = await getPendingTransactions();
    setPendingTransactions(data);
  };

  const handleConfirm = async (transaction: PendingTransaction) => {
    try {
      await addTransaction({
        userId: user?.id || '',
        accountId: '',
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        source: transaction.source,
        bank: transaction.bank,
        rawMessage: transaction.rawMessage,
        isConfirmed: true,
        isRecurring: false,
      });
      await confirmPendingTransaction(transaction.id);
      setPendingTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      Alert.alert('Sucesso', 'Transação confirmada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível confirmar');
    }
  };

  const handleReject = async (transaction: PendingTransaction) => {
    await rejectPendingTransaction(transaction.id);
    setPendingTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
  };

  const sourceIcons: Record<string, string> = {
    sms: 'chatbubble',
    email: 'mail',
    notification: 'notifications',
    ocr: 'camera',
    voice: 'mic',
  };

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
                  name={(sourceIcons[transaction.source] || 'document') as any}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.source}>{transaction.source}</Text>
                {transaction.bank && (
                  <Text style={styles.bank}>{transaction.bank}</Text>
                )}
              </View>
              <Text style={styles.description}>{transaction.description}</Text>
              <Text style={styles.date}>
                {new Date(transaction.date).toLocaleDateString('pt-BR')}
              </Text>
              <Text
                style={[
                  styles.amount,
                  { color: transaction.type === 'income' ? colors.income : colors.expense },
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}{' '}
                {formatCurrency(transaction.amount)}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(transaction)}
                >
                  <Ionicons name="close" size={20} color={colors.expense} />
                  <Text style={styles.rejectText}>Rejeitar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirm(transaction)}
                >
                  <Ionicons name="checkmark" size={20} color={colors.income} />
                  <Text style={styles.confirmText}>Confirmar</Text>
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
  bank: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.expense + '15',
  },
  rejectText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.expense,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.income + '15',
  },
  confirmText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.income,
  },
});
