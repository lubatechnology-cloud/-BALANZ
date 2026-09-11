export type RootStackParamList = {
  Onboarding: { onComplete?: () => void } | undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  AddTransaction: { type?: 'income' | 'expense' | 'transfer' };
  TransactionDetail: { transactionId: string };
  TransactionList: undefined;
  EditTransaction: { transactionId: string };
  Accounts: undefined;
  AddAccount: undefined;
  Goals: undefined;
  AddGoal: undefined;
  Subscription: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Capture: undefined;
  Reports: undefined;
  Settings: undefined;
};
