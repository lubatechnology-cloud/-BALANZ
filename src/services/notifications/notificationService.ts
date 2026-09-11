import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Transaction, Budget } from '../types';

export async function initializeNotifications(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('transactions', {
        name: 'Transações',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6C5CE7',
      });

      await Notifications.setNotificationChannelAsync('budgets', {
        name: 'Orçamentos',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FDCB6E',
      });

      await Notifications.setNotificationChannelAsync('goals', {
        name: 'Metas',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00B894',
      });
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Erro ao inicializar notificações:', error);
    return false;
  }
}

export async function sendTransactionNotification(
  transaction: Transaction
): Promise<void> {
  const isIncome = transaction.type === 'income';
  const title = isIncome ? 'Receita registrada' : 'Despesa registrada';
  const body = `${transaction.description} - R$ ${transaction.amount.toFixed(2)}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { transactionId: transaction.id },
      sound: true,
    },
    trigger: null,
  });
}

export async function sendBudgetAlert(
  category: string,
  percentage: number
): Promise<void> {
  const title = 'Alerta de Orçamento';
  let body: string;

  if (percentage >= 100) {
    body = `Orçamento de ${category} estourado! (${percentage.toFixed(0)}%)`;
  } else {
    body = `Você já gastou ${percentage.toFixed(0)}% do orçamento de ${category}`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: 'budget_alert', category },
      sound: true,
    },
    trigger: null,
  });
}

export async function sendGoalReminder(
  goalName: string,
  monthlyContribution: number
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de Meta',
      body: `Para atingir "${goalName}", contribua R$ ${monthlyContribution.toFixed(2)} por mês`,
      data: { type: 'goal_reminder' },
      sound: true,
    },
    trigger: null,
  });
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('daily_reminder');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'BALANZ',
      body: 'Não esqueça de registrar suas transações de hoje!',
      data: { type: 'daily_reminder' },
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
    identifier: 'daily_reminder',
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getNotificationStatus(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export function setupNotificationListeners(
  onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationTapped: (notification: Notifications.Notification) => void
): void {
  Notifications.addNotificationReceivedListener(onNotificationReceived);
  Notifications.addNotificationResponseReceivedListener(onNotificationTapped);
}
