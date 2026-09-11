export const APP_NAME = 'BALANZ';
export const APP_VERSION = '1.0.0';

export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export const REVENUECAT_CONFIG = {
  apiKey: 'YOUR_REVENUECAT_API_KEY',
};

export const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
] as const;

export const DEFAULT_CURRENCY = 'BRL';

export const CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salário', icon: 'briefcase', color: '#00B894' },
    { id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#55EFC4' },
    { id: 'investment', name: 'Investimento', icon: 'trending-up', color: '#00CEC9' },
    { id: 'other_income', name: 'Outros', icon: 'plus-circle', color: '#81ECEC' },
  ],
  expense: [
    { id: 'food', name: 'Alimentação', icon: 'shopping-cart', color: '#E17055' },
    { id: 'transport', name: 'Transporte', icon: 'car', color: '#FDCB6E' },
    { id: 'housing', name: 'Moradia', icon: 'home', color: '#74B9FF' },
    { id: 'health', name: 'Saúde', icon: 'heart', color: '#FD79A8' },
    { id: 'education', name: 'Educação', icon: 'book', color: '#A29BFE' },
    { id: 'leisure', name: 'Lazer', icon: 'play-circle', color: '#6C5CE7' },
    { id: 'shopping', name: 'Compras', icon: 'shopping-bag', color: '#E84393' },
    { id: 'bills', name: 'Contas', icon: 'file-text', color: '#FF7675' },
    { id: 'other_expense', name: 'Outros', icon: 'more-horizontal', color: '#636E72' },
  ],
} as const;

export const ACCOUNT_COLORS = [
  '#6C5CE7',
  '#00B894',
  '#E17055',
  '#74B9FF',
  '#FDCB6E',
  '#FD79A8',
  '#00CEC9',
  '#A29BFE',
] as const;

export const ONBOARDING_STEPS = [
  {
    title: 'Bem-vindo ao BALANZ',
    description: 'Controle total das suas finanças na palma da mão',
    icon: 'wallet',
  },
  {
    title: 'Detecte seus gastos',
    description: 'O BALANZ detecta pagamentos automaticamente via SMS, email e notificações',
    icon: 'scan',
  },
  {
    title: 'Comando de voz',
    description: 'Adicione gastos rapidamente usando sua voz: "Gastei 50 no supermercado"',
    icon: 'mic',
  },
  {
    title: 'Relatórios inteligentes',
    description: 'Veja gráficos e relatórios para entender para onde vai seu dinheiro',
    icon: 'bar-chart-2',
  },
] as const;
