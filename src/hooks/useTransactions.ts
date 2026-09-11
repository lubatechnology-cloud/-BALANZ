import { useEffect, useCallback } from 'react';
import { useTransactionStore } from '../store';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/database/transactionService';
import { Transaction, TransactionType } from '../types';

export function useTransactions(userId: string | undefined) {
  const { transactions, isLoading, setTransactions, setLoading, addTransaction: storeAddTransaction } = useTransactionStore();

  useEffect(() => {
    if (userId) {
      loadTransactions();
    }
  }, [userId]);

  const loadTransactions = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!userId) return;
    try {
      const newTransaction = await createTransaction(userId, transaction);
      storeAddTransaction(newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  const editTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await updateTransaction(id, updates);
      const { updateTransaction: storeUpdate } = useTransactionStore.getState();
      storeUpdate(id, updates);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      const { deleteTransaction: storeDelete } = useTransactionStore.getState();
      storeDelete(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const getFilteredTransactions = useCallback(
    (type?: TransactionType, startDate?: Date, endDate?: Date) => {
      let filtered = [...transactions];

      if (type) {
        filtered = filtered.filter((t) => t.type === type);
      }

      if (startDate) {
        filtered = filtered.filter((t) => new Date(t.date) >= startDate);
      }

      if (endDate) {
        filtered = filtered.filter((t) => new Date(t.date) <= endDate);
      }

      return filtered;
    },
    [transactions]
  );

  const getTotalByType = useCallback(
    (type: TransactionType) => {
      return transactions
        .filter((t) => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
    },
    [transactions]
  );

  const getBalance = useCallback(() => {
    const income = getTotalByType('income');
    const expense = getTotalByType('expense');
    return income - expense;
  }, [transactions, getTotalByType]);

  return {
    transactions,
    isLoading,
    addTransaction,
    editTransaction,
    removeTransaction,
    getFilteredTransactions,
    getTotalByType,
    getBalance,
    refresh: loadTransactions,
  };
}
