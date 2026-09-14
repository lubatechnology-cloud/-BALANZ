import React from 'react';
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
import { useTransactions, useAuth } from '../../hooks';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryById } from '../../utils/categories';

interface Props {
  navigation: any;
  route: any;
}

export default function TransactionDetailScreen({ navigation, route }: Props) {
  const { transactionId } = route.params;
  const { user } = useAuth();
  const { transactions, removeTransaction } = useTransactions(user?.id);

  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transação não encontrada</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert(
      'Excluir transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removeTransaction(transaction.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountCard}>
          <View style={[styles.iconContainer, { backgroundColor: (isIncome ? colors.income : colors.expense) + '20' }]}>
            <Ionicons
              name={(category?.icon || 'wallet') as any}
              size={32}
              color={isIncome ? colors.income : colors.expense}
            />
          </View>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? colors.income : colors.expense },
            ]}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.description}>{transaction.description}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Categoria</Text>
            <View style={styles.detailValueContainer}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: category?.color || colors.textMuted },
                ]}
              />
              <Text style={styles.detailValue}>{category?.name || 'Outros'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data</Text>
            <Text style={styles.detailValue}>
              {formatDate(new Date(transaction.date), 'long')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo</Text>
            <Text style={styles.detailValue}>
              {transaction.type === 'income' ? 'Receita' : transaction.type === 'expense' ? 'Despesa' : 'Transferência'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fonte</Text>
            <Text style={styles.detailValue}>
              {transaction.source === 'manual' ? 'Manual' :
               transaction.source === 'sms' ? 'SMS' :
               transaction.source === 'email' ? 'Email' :
               transaction.source === 'voice' ? 'Voz' :
               transaction.source === 'ocr' ? 'OCR' :
               transaction.source === 'csv' ? 'CSV' :
               transaction.source === 'notification' ? 'Notificação' : 'Outro'}
            </Text>
          </View>

          {transaction.bank && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Banco</Text>
              <Text style={styles.detailValue}>{transaction.bank}</Text>
            </View>
          )}

          {transaction.merchant && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estabelecimento</Text>
              <Text style={styles.detailValue}>{transaction.merchant}</Text>
            </View>
          )}

          {transaction.tags && transaction.tags.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {transaction.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {transaction.rawMessage && (
          <View style={styles.rawMessageCard}>
            <Text style={styles.rawMessageLabel}>Mensagem original</Text>
            <Text style={styles.rawMessage}>{transaction.rawMessage}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditTransaction', { transactionId: transaction.id })}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  amount: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    borderRadius: 16,
    padding: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  tagText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  rawMessageCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    marginBottom: spacing.xl,
    borderRadius: 16,
    padding: spacing.xl,
  },
  rawMessageLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  rawMessage: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.base,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.base,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
