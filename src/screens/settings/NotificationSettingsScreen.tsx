import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks';
import { getNotificationStatus, initializeNotifications, scheduleDailyReminder } from '../../services/notifications/notificationService';

export default function NotificationSettingsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const status = await getNotificationStatus();
    setNotificationsEnabled(status);
  };

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const success = await initializeNotifications();
      if (success) {
        setNotificationsEnabled(true);
        Alert.alert('Sucesso', 'Notificações ativadas');
      } else {
        Alert.alert('Erro', 'Ative as notificações nas configurações do dispositivo');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const toggleDailyReminder = async (value: boolean) => {
    setDailyReminder(value);
    if (value) {
      await scheduleDailyReminder(20, 0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mainToggle}>
          <View style={styles.toggleInfo}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <View>
              <Text style={styles.toggleLabel}>Notificações</Text>
              <Text style={styles.toggleDescription}>
                Ativar notificações do app
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
            thumbColor={notificationsEnabled ? colors.primary : colors.textMuted}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>Tipos de Notificação</Text>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.optionLabel}>Lembrete diário</Text>
                  <Text style={styles.optionDescription}>
                    Lembre às 20h para registrar transações
                  </Text>
                </View>
              </View>
              <Switch
                value={dailyReminder}
                onValueChange={toggleDailyReminder}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                thumbColor={dailyReminder ? colors.primary : colors.textMuted}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Ionicons name="wallet" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.optionLabel}>Alertas de orçamento</Text>
                  <Text style={styles.optionDescription}>
                    Avisar quando ultrapassar 80% do orçamento
                  </Text>
                </View>
              </View>
              <Switch
                value={budgetAlerts}
                onValueChange={setBudgetAlerts}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                thumbColor={budgetAlerts ? colors.primary : colors.textMuted}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Ionicons name="flag" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.optionLabel}>Lembretes de metas</Text>
                  <Text style={styles.optionDescription}>
                    Lembrete mensal de contribuição
                  </Text>
                </View>
              </View>
              <Switch
                value={goalReminders}
                onValueChange={setGoalReminders}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                thumbColor={goalReminders ? colors.primary : colors.textMuted}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.optionLabel}>Transações</Text>
                  <Text style={styles.optionDescription}>
                    Notificar ao registrar transação
                  </Text>
                </View>
              </View>
              <Switch
                value={transactionAlerts}
                onValueChange={setTransactionAlerts}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                thumbColor={transactionAlerts ? colors.primary : colors.textMuted}
              />
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            As notificações são enviadas apenas quando relevante. Você pode
            desativar qualquer tipo a qualquer momento.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  mainToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  toggleDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  optionLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
