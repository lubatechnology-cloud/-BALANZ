import { create } from 'zustand';
import { Transaction, TransactionType } from '../types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByDateRange: (start: Date, end: Date) => Transaction[];
  getTotalByType: (type: TransactionType) => number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  setTransactions: (transactions) => set({ transactions }),

  setLoading: (isLoading) => set({ isLoading }),

  getTransactionsByType: (type) => {
    return get().transactions.filter((t) => t.type === type);
  },

  getTransactionsByDateRange: (start, end) => {
    return get().transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });
  },

  getTotalByType: (type) => {
    return get()
      .transactions.filter((t) => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  },
}));
