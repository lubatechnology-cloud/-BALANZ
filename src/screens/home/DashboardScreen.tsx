import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { formatCurrency, getGreeting } from '../../utils/formatters';
import { useAuth, useTransactions } from '../../hooks';

const categoryIcons: Record<string, string> = {
  food: 'cart',
  transport: 'car',
  salary: 'briefcase',
  health: 'heart',
  housing: 'home',
  leisure: 'play-circle',
  shopping: 'bag',
  supermarket: 'cart',
  restaurant: 'restaurant',
  delivery: 'bicycle',
  uber: 'car',
  fuel: 'speedometer',
  rent: 'home',
  streaming: 'play',
  gym: 'fitness',
};

export default function DashboardScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = React.useState(false);
  const { user, logout } = useAuth();
  const { transactions, getBalance, getTotalByType } = useTransactions(user?.id);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const balance = getBalance();
  const income = getTotalByType('income');
  const expense = getTotalByType('expense');
  const balanceColor = balance >= 0 ? colors.income : colors.expense;

  const recentTransactions = transactions.slice(0, 5);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <Text style={[styles.balanceValue, { color: balanceColor }]}>
            {formatCurrency(balance)}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetail}>
              <View style={[styles.indicator, { backgroundColor: colors.income }]} />
              <Text style={styles.balanceDetailLabel}>Receitas</Text>
              <Text style={[styles.balanceDetailValue, { color: colors.income }]}>
                {formatCurrency(income)}
              </Text>
            </View>
            <View style={styles.balanceDetail}>
              <View style={[styles.indicator, { backgroundColor: colors.expense }]} />
              <Text style={styles.balanceDetailLabel}>Despesas</Text>
              <Text style={[styles.balanceDetailValue, { color: colors.expense }]}>
                {formatCurrency(Math.abs(expense))}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.income + '20' }]}>
              <Ionicons name="add-circle" size={24} color={colors.income} />
            </View>
            <Text style={styles.quickActionLabel}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.expense + '20' }]}>
              <Ionicons name="remove-circle" size={24} color={colors.expense} />
            </View>
            <Text style={styles.quickActionLabel}>Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Accounts')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="wallet" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>Contas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="mic" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.quickActionLabel}>Voz</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionList')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
              <Text style={styles.emptySubtext}>
                Toque em "Adicionar" para começar
              </Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              return (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionItem}
                  onPress={() =>
                    navigation.navigate('TransactionDetail', {
                      transactionId: transaction.id,
                    })
                  }
                >
                  <View style={styles.transactionLeft}>
                    <View style={styles.transactionIcon}>
                      <Ionicons
                        name={(categoryIcons[transaction.category] || 'wallet') as any}
                        size={20}
                        color={isIncome ? colors.income : colors.expense}
                      />
                    </View>
                    <View>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: isIncome ? colors.income : colors.expense },
                    ]}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
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
  greeting: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
  },
  balanceLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
  },
  balanceDetails: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  balanceDetail: {
    flex: 1,
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  balanceDetailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  balanceDetailValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  seeAll: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDescription: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  transactionDate: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
  },
});
