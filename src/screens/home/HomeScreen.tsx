import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks';
import { startSMSListener, stopSMSListener } from '../../services/capture/smsService';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [smsActive, setSmsActive] = useState(false);

  useEffect(() => {
    return () => {
      stopSMSListener();
    };
  }, []);

  const toggleSMS = async () => {
    if (smsActive) {
      stopSMSListener();
      setSmsActive(false);
    } else {
      Alert.alert(
        'Captura SMS',
        'Ativar detecção automática de transações via SMS?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Ativar',
            onPress: async () => {
              await startSMSListener((transaction) => {
                Alert.alert(
                  'Transação detectada',
                  `${transaction.description} - R$ ${transaction.amount}`,
                  [
                    { text: 'Rejeitar', style: 'cancel' },
                    {
                      text: 'Confirmar',
                      onPress: () => {
                        navigation.navigate('AddTransaction', {
                          prefill: transaction,
                        });
                      },
                    },
                  ]
                );
              });
              setSmsActive(true);
            },
          },
        ]
      );
    }
  };

  const quickActions = [
    {
      icon: 'add-circle',
      label: 'Adicionar',
      color: colors.primary,
      onPress: () => navigation.navigate('AddTransaction'),
    },
    {
      icon: 'mic',
      label: 'Voz',
      color: colors.income,
      onPress: () => navigation.navigate('Capture'),
    },
    {
      icon: 'camera',
      label: 'OCR',
      color: colors.warning,
      onPress: () => navigation.navigate('Capture'),
    },
    {
      icon: 'chatbubble',
      label: 'SMS',
      color: smsActive ? colors.income : colors.textMuted,
      onPress: toggleSMS,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá!</Text>
            <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAction}
              onPress={action.onPress}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + '20' },
                ]}
              >
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionList')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma transação</Text>
            <Text style={styles.emptySubtext}>
              Adicione sua primeira transação
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Captura Inteligente</Text>
          <View style={styles.captureCard}>
            <Ionicons name="fingerprint" size={32} color={colors.primary} />
            <View style={styles.captureInfo}>
              <Text style={styles.captureTitle}>Detectar automaticamente</Text>
              <Text style={styles.captureSubtitle}>
                Configure SMS, Email ou Notificações
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => navigation.navigate('Capture')}
          >
            <Text style={styles.captureButtonText}>Configurar Captura</Text>
          </TouchableOpacity>
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
  greeting: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  seeAll: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  captureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  captureInfo: {
    flex: 1,
  },
  captureTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  captureSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  captureButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
});
