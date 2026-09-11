export type RootStackParamList = {
  Onboarding: { onComplete?: () => void } | undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  AddTransaction: { type?: 'income' | 'expense' | 'transfer'; prefill?: any };
  TransactionDetail: { transactionId: string };
  TransactionList: { imported?: any[] } | undefined;
  EditTransaction: { transactionId: string };
  Accounts: undefined;
  AddAccount: undefined;
  Goals: undefined;
  AddGoal: { suggestion?: any } | undefined;
  Budget: undefined;
  Subscription: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  Privacy: undefined;
  PendingTransactions: undefined;
  Notifications: undefined;
  Backup: undefined;
  Help: undefined;
  Summary: undefined;
  CurrencyConverter: undefined;
  FinancialHealth: undefined;
};

export type TabParamList = {
  Home: undefined;
  Capture: undefined;
  Reports: undefined;
  Settings: undefined;
};
