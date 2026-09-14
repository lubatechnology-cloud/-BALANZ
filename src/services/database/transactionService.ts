import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../../types';

const getStorageKey = (userId: string) => `@balanz_transactions_${userId}`;

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const data = await AsyncStorage.getItem(getStorageKey(userId));
  if (!data) return [];
  const transactions = JSON.parse(data);
  return transactions.sort(
    (a: Transaction, b: Transaction) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function createTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> {
  const transactions = await getTransactions(userId);

  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  transactions.push(newTransaction);
  await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(transactions));

  return newTransaction;
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const transactionKeys = allKeys.filter((k) => k.startsWith('@balanz_transactions_'));

  for (const key of transactionKeys) {
    const data = await AsyncStorage.getItem(key);
    if (!data) continue;
    const transactions: Transaction[] = JSON.parse(data);
    const index = transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date() };
      await AsyncStorage.setItem(key, JSON.stringify(transactions));
      return;
    }
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const transactionKeys = allKeys.filter((k) => k.startsWith('@balanz_transactions_'));

  for (const key of transactionKeys) {
    const data = await AsyncStorage.getItem(key);
    if (!data) continue;
    const transactions: Transaction[] = JSON.parse(data);
    const filtered = transactions.filter((t) => t.id !== id);
    if (filtered.length !== transactions.length) {
      await AsyncStorage.setItem(key, JSON.stringify(filtered));
      return;
    }
  }
}
