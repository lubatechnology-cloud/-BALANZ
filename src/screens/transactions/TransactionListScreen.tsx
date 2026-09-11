import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth, useTransactions } from '../../hooks';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { TransactionType } from '../../types';

interface Props {
  navigation: any;
}

type FilterType = 'all' | TransactionType;

export default function TransactionListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { transactions } = useTransactions(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(lowerQuery) ||
          t.category.toLowerCase().includes(lowerQuery) ||
          t.merchant?.toLowerCase().includes(lowerQuery) ||
          t.bank?.toLowerCase().includes(lowerQuery)
      );
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, searchQuery]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof filteredTransactions> = {};

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(transaction);
    });

    return Object.entries(groups);
  }, [filteredTransactions]);

  const renderSectionHeader = (date: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionDate}>{date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar transações..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'expense', 'income'] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              filterType === filter && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType(filter)}
          >
            <Text
              style={[
                styles.filterText,
                filterType === filter && styles.filterTextActive,
              ]}
            >
              {filter === 'all' ? 'Todas' : filter === 'expense' ? 'Despesas' : 'Receitas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={groupedTransactions}
        keyExtractor={([date]) => date}
        contentContainerStyle={styles.listContent}
        renderItem={([date, items]) => (
          <View>
            {renderSectionHeader(date)}
            {items.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() =>
                  navigation.navigate('TransactionDetail', {
                    transactionId: transaction.id,
                  })
                }
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          </View>
        }
      />
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
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.base,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionDate: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
    gap: spacing.base,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
});
