import { parseSMSMessage } from './parser';
import { PendingTransaction } from '../../types';

const STORAGE_KEY = '@balanz_pending_transactions';

let smsListener: any = null;

export async function startSMSListener(
  onTransactionDetected: (transaction: PendingTransaction) => void
): Promise<void> {
  try {
    const { AppState } = require('react-native');
    const { Platform } = require('react-native');

    if (Platform.OS === 'android') {
      console.log('SMS Listener: Aguardando notificações Android...');
      return;
    }

    console.log('SMS Listener: iOS requer ILMessageFilterExtension');
  } catch (error) {
    console.error('Erro ao iniciar SMS listener:', error);
  }
}

export function stopSMSListener(): void {
  if (smsListener) {
    smsListener = null;
  }
}

export function processSMSMessage(
  sender: string,
  body: string
): PendingTransaction | null {
  const fullMessage = `De: ${sender}\n${body}`;
  const parsed = parseSMSMessage(fullMessage);

  if (!parsed) return null;

  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    amount: parsed.amount,
    type: parsed.type,
    category: parsed.category,
    description: parsed.description,
    bank: parsed.bank,
    date: new Date(),
    source: 'sms',
    rawMessage: fullMessage,
    isConfirmed: false,
  };
}

export async function savePendingTransaction(
  transaction: PendingTransaction
): Promise<void> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const existing = await getPendingTransactions();
  existing.push(transaction);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export async function getPendingTransactions(): Promise<PendingTransaction[]> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function confirmPendingTransaction(
  id: string
): Promise<PendingTransaction | null> {
  const transactions = await getPendingTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const transaction = transactions[index];
  transactions.splice(index, 1);

  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

  return transaction;
}

export async function rejectPendingTransaction(id: string): Promise<void> {
  const transactions = await getPendingTransactions();
  const filtered = transactions.filter((t) => t.id !== id);

  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
