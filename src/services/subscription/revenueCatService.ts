import { Platform } from 'react-native';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    features: [
      '1 conta bancária',
      '5 capturas OCR por mês',
      '10 comandos de voz por dia',
      'Categorias básicas',
      'Relatórios mensais',
    ],
  },
  {
    id: 'premium_monthly',
    name: 'Premium Mensal',
    price: 'R$ 4,99',
    period: '/mês',
    features: [
      'Contas ilimitadas',
      'OCR ilimitado',
      'Voz ilimitada',
      'Email IMAP',
      'Importação CSV',
      'Relatórios avançados',
      'Exportar dados',
      'Categorias personalizadas',
      'Backup automático',
    ],
  },
  {
    id: 'premium_yearly',
    name: 'Premium Anual',
    price: 'R$ 39,99',
    period: '/ano',
    features: [
      'Tudo do Premium Mensal',
      'Economia de 33%',
      'Suporte prioritário',
      'Acesso antecipado a novidades',
    ],
  },
];

export async function initializeRevenueCat(): Promise<void> {
  try {
    const { Platform } = require('react-native');
    console.log('RevenueCat: Inicializando para', Platform.OS);
    console.log('RevenueCat: Configurar no RevenueCat Dashboard');
  } catch (error) {
    console.error('Erro ao inicializar RevenueCat:', error);
  }
}

export async function getAvailableProducts(): Promise<SubscriptionPlan[]> {
  return PLANS;
}

export async function purchaseSubscription(
  planId: string
): Promise<boolean> {
  try {
    console.log('RevenueCat: Iniciando compra do plano', planId);
    return true;
  } catch (error) {
    console.error('Erro na compra:', error);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    console.log('RevenueCat: Restaurando compras');
    return true;
  } catch (error) {
    console.error('Erro ao restaurar:', error);
    return false;
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  try {
    console.log('RevenueCat: Verificando status premium');
    return false;
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return false;
  }
}

export async function logoutRevenueCat(): Promise<void> {
  try {
    console.log('RevenueCat: Logout');
  } catch (error) {
    console.error('Erro no logout:', error);
  }
}
