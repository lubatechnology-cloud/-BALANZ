import { Transaction } from '../../types';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface BudgetAlert {
  budgetId: string;
  category: string;
  percentage: number;
  message: string;
}

const STORAGE_KEY = '@balanz_budgets';

export async function getBudgets(userId: string): Promise<Budget[]> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const data = await AsyncStorage.getItem(`${STORAGE_KEY}_${userId}`);
  return data ? JSON.parse(data) : [];
}

export async function createBudget(
  userId: string,
  budget: Omit<Budget, 'id' | 'spent' | 'remaining' | 'percentage'>
): Promise<Budget> {
  const budgets = await getBudgets(userId);

  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    spent: 0,
    remaining: budget.amount,
    percentage: 0,
  };

  budgets.push(newBudget);
  await saveBudgets(userId, budgets);
  return newBudget;
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  updates: Partial<Budget>
): Promise<Budget | null> {
  const budgets = await getBudgets(userId);
  const index = budgets.findIndex((b) => b.id === budgetId);
  if (index === -1) return null;

  budgets[index] = { ...budgets[index], ...updates };
  await saveBudgets(userId, budgets);
  return budgets[index];
}

export async function deleteBudget(
  userId: string,
  budgetId: string
): Promise<void> {
  const budgets = await getBudgets(userId);
  const filtered = budgets.filter((b) => b.id !== budgetId);
  await saveBudgets(userId, filtered);
}

export async function updateBudgetSpending(
  userId: string,
  transactions: Transaction[]
): Promise<BudgetAlert[]> {
  const budgets = await getBudgets(userId);
  const alerts: BudgetAlert[] = [];
  const now = new Date();

  for (const budget of budgets) {
    const relevantTransactions = transactions.filter((t) => {
      if (t.type !== 'expense') return false;
      if (t.category !== budget.category) return false;

      const transDate = new Date(t.date);
      return transDate >= new Date(budget.startDate) && transDate <= new Date(budget.endDate);
    });

    const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    budget.spent = spent;
    budget.remaining = remaining;
    budget.percentage = percentage;

    if (percentage >= 80 && percentage < 100) {
      alerts.push({
        budgetId: budget.id,
        category: budget.category,
        percentage,
        message: `Você já gastou ${percentage.toFixed(0)}% do orçamento de ${budget.category}`,
      });
    } else if (percentage >= 100) {
      alerts.push({
        budgetId: budget.id,
        category: budget.category,
        percentage,
        message: `Orçamento de ${budget.category} estourado!`,
      });
    }
  }

  await saveBudgets(userId, budgets);
  return alerts;
}

async function saveBudgets(userId: string, budgets: Budget[]): Promise<void> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(budgets));
}

export function createDefaultBudgets(): Omit<Budget, 'id' | 'spent' | 'remaining' | 'percentage'>[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return [
    {
      category: 'food',
      amount: 800,
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
    },
    {
      category: 'transport',
      amount: 400,
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
    },
    {
      category: 'leisure',
      amount: 300,
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
    },
    {
      category: 'shopping',
      amount: 500,
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
    },
  ];
}
