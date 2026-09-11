import React, { useState } from 'react';
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

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  icon: string;
}

const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Nubank',
    type: 'checking',
    balance: 2450.80,
    color: '#8B5CF6',
    icon: 'card',
  },
  {
    id: '2',
    name: 'Inter',
    type: 'checking',
    balance: 1200.00,
    color: '#FF6B00',
    icon: 'card',
  },
  {
    id: '3',
    name: 'Poupança',
    type: 'savings',
    balance: 15000.00,
    color: '#10B981',
    icon: 'wallet',
  },
  {
    id: '4',
    name: 'Carteira',
    type: 'cash',
    balance: 350.00,
    color: '#F59E0B',
    icon: 'cash',
  },
];

const accountTypeLabels: Record<string, string> = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  credit_card: 'Cartão de Crédito',
  cash: 'Dinheiro',
  investment: 'Investimento',
  other: 'Outro',
};

export default function AccountsScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleDeleteAccount = (account: Account) => {
    Alert.alert(
      'Excluir conta',
      `Tem certeza que deseja excluir "${account.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setAccounts(accounts.filter((a) => a.id !== account.id));
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
        <Text style={styles.title}>Contas</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Saldo total</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalBalance)}</Text>
          <Text style={styles.totalCount}>{accounts.length} contas</Text>
        </View>

        <View style={styles.accountsList}>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={styles.accountCard}
              onLongPress={() => handleDeleteAccount(account)}
            >
              <View style={[styles.accountIcon, { backgroundColor: account.color + '20' }]}>
                <Ionicons name={account.icon as any} size={24} color={account.color} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountType}>
                  {accountTypeLabels[account.type] || account.type}
                </Text>
              </View>
              <Text style={styles.accountBalance}>
                {formatCurrency(account.balance)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addButtonText}>Adicionar conta</Text>
        </TouchableOpacity>
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
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  totalValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  totalCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  accountsList: {
    gap: spacing.md,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    gap: spacing.md,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  accountType: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  accountBalance: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.base,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
});
