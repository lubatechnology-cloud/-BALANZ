import { PendingTransaction } from '../types';
import { parseSMSMessage } from './parser';

export function parseCSVData(csvContent: string): PendingTransaction[] {
  const lines = csvContent.split('\n');
  const transactions: PendingTransaction[] = [];

  if (lines.length < 2) return transactions;

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  const dateIndex = headers.findIndex((h) =>
    ['data', 'date', 'data transação', 'transaction date'].includes(h)
  );
  const descIndex = headers.findIndex((h) =>
    ['descrição', 'description', 'histórico', 'memo', 'details'].includes(h)
  );
  const amountIndex = headers.findIndex((h) =>
    ['valor', 'amount', 'montante'].includes(h)
  );
  const typeIndex = headers.findIndex((h) =>
    ['tipo', 'type', 'entrada/saída'].includes(h)
  );

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',').map((c) => c.trim().replace(/"/g, ''));

    if (columns.length < 2) continue;

    const amountStr = amountIndex >= 0 ? columns[amountIndex] : columns[2];
    const amount = parseFloat(amountStr?.replace(/[^\d.-]/g, '') || '0');

    if (isNaN(amount) || amount === 0) continue;

    const description = descIndex >= 0 ? columns[descIndex] : columns[1] || 'Importado';
    const dateStr = dateIndex >= 0 ? columns[dateIndex] : columns[0];
    const typeStr = typeIndex >= 0 ? columns[typeIndex] : '';

    let date: Date;
    try {
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(dateStr);
      }
    } catch {
      date = new Date();
    }

    let type: 'income' | 'expense' = amount >= 0 ? 'income' : 'expense';
    if (typeStr) {
      const lowerType = typeStr.toLowerCase();
      if (['crédito', 'credit', 'receita', 'income', '+'].includes(lowerType)) {
        type = 'income';
      } else if (['débito', 'debit', 'despesa', 'expense', '-'].includes(lowerType)) {
        type = 'expense';
      }
    }

    transactions.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      amount: Math.abs(amount),
      type,
      category: 'other_expense',
      description,
      date,
      source: 'csv',
      rawMessage: line,
      isConfirmed: false,
    });
  }

  return transactions;
}

export function generateCSVTemplate(): string {
  return 'Data,Descrição,Valor,Tipo\n2024-01-15,Supermercado,-150.00,Despesa\n2024-01-16,Salário,5000.00,Receita';
}

export async function importCSVFile(): Promise<PendingTransaction[]> {
  const FileSystem = require('expo-file-system');
  const DocumentPicker = require('expo-document-picker');

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/csv',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) {
      return [];
    }

    const csvContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    return parseCSVData(csvContent);
  } catch (error) {
    console.error('Erro ao importar CSV:', error);
    return [];
  }
}
