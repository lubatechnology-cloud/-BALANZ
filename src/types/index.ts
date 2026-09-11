export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'cash'
  | 'investment'
  | 'other';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  source: TransactionSource;
  bank?: string;
  merchant?: string;
  tags?: string[];
  isRecurring: boolean;
  isConfirmed: boolean;
  rawMessage?: string;
  receiptImageUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionSource =
  | 'manual'
  | 'sms'
  | 'email'
  | 'voice'
  | 'ocr'
  | 'csv'
  | 'notification';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isDefault: boolean;
  parentId?: string;
}

export interface Goal {
  id: string;
  userId?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  color: string;
  icon: string;
  percentage: number;
  monthlyContribution: number;
  createdAt: Date;
  updatedAt?: Date;
}

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

export interface BackupMetadata {
  id: string;
  date: Date;
  size: number;
  transactionCount: number;
  type: 'manual' | 'auto';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate?: Date;
  revenueCatId?: string;
}

export interface AppSettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  smsCaptureEnabled: boolean;
  emailCaptureEnabled: boolean;
  voiceCaptureEnabled: boolean;
  monthlyBudget?: number;
}

export interface PendingTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  bank?: string;
  date: Date;
  source: TransactionSource;
  rawMessage: string;
  isConfirmed: boolean;
}

export interface BankSMSProfile {
  name: string;
  senderPatterns: string[];
  keywords: string[];
}
