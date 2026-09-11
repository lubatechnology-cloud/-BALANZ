export type RootStackParamList = {
  Onboarding: { onComplete?: () => void } | undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  TransactionDetail: { transactionId: string };
  AddTransaction: { type?: 'income' | 'expense' | 'transfer' };
  EditTransaction: { transactionId: string };
  Goals: undefined;
  AddGoal: undefined;
  Accounts: undefined;
  AddAccount: undefined;
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
