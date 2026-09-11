import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { startVoiceCapture, stopVoiceCapture } from '../../services/capture/voiceService';
import { takePhoto, pickImage } from '../../services/capture/ocrService';
import { connectToEmail } from '../../services/capture/emailService';
import { importCSVFile } from '../../services/capture/csvService';
import { PendingTransaction } from '../../types';

export default function CaptureScreen({ navigation }: any) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const captureMethods = [
    {
      id: 'sms',
      title: 'SMS',
      subtitle: 'Detectar transações automaticamente',
      icon: 'chatbubble-ellipses',
      color: '#6C5CE7',
      available: true,
    },
    {
      id: 'voice',
      title: 'Comando de Voz',
      subtitle: '"Gastei 50 reais no mercado"',
      icon: 'mic',
      color: '#00B894',
      available: true,
    },
    {
      id: 'ocr',
      title: 'Fotografar Fatura',
      subtitle: 'Escanear recibos e faturas',
      icon: 'camera',
      color: '#FDCB6E',
      available: true,
    },
    {
      id: 'email',
      title: 'Email IMAP',
      subtitle: 'Importar extratos por email',
      icon: 'mail',
      color: '#E17055',
      available: true,
    },
    {
      id: 'notification',
      title: 'Notificações',
      subtitle: 'Ler notificações de banking',
      icon: 'notifications',
      color: '#0984E3',
      available: true,
    },
    {
      id: 'csv',
      title: 'Importar CSV',
      subtitle: 'Extratos bancários',
      icon: 'document-text',
      color: '#00CEC9',
      available: true,
    },
  ];

  const handleCapture = async (methodId: string) => {
    setIsProcessing(true);
    try {
      switch (methodId) {
        case 'voice':
          await startVoiceCapture(
            (transaction) => {
              navigation.navigate('AddTransaction', {
                prefill: transaction,
              });
            },
            (error) => Alert.alert('Erro', error)
          );
          break;

        case 'ocr':
          Alert.alert(
            'Fotografar Fatura',
            'Escolha uma opção',
            [
              {
                text: 'Câmera',
                onPress: async () => {
                  const uri = await takePhoto();
                  if (uri) {
                    navigation.navigate('AddTransaction', {
                      prefill: { source: 'ocr', rawMessage: uri },
                    });
                  }
                },
              },
              {
                text: 'Galeria',
                onPress: async () => {
                  const uri = await pickImage();
                  if (uri) {
                    navigation.navigate('AddTransaction', {
                      prefill: { source: 'ocr', rawMessage: uri },
                    });
                  }
                },
              },
              { text: 'Cancelar', style: 'cancel' },
            ]
          );
          break;

        case 'email':
          Alert.alert(
            'Email IMAP',
            'Configure seu email bancário nas configurações'
          );
          break;

        case 'csv':
          const csvTransactions = await importCSVFile();
          if (csvTransactions.length > 0) {
            navigation.navigate('TransactionList', {
              imported: csvTransactions,
            });
          }
          break;

        case 'sms':
          Alert.alert(
            'Captura SMS',
            'O app detectará transações automaticamente via notificações'
          );
          break;

        case 'notification':
          Alert.alert(
            'Notificações',
            'Ative a permissão de notificações para capturar transações'
          );
          break;
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Captura Inteligente</Text>
        <Text style={styles.subtitle}>
          Detecte transações automaticamente
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {isProcessing && (
          <View style={styles.processingCard}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.processingText}>Processando...</Text>
          </View>
        )}

        {pendingCount > 0 && (
          <TouchableOpacity
            style={styles.pendingCard}
            onPress={() => navigation.navigate('PendingTransactions')}
          >
            <Ionicons name="time" size={24} color={colors.warning} />
            <View style={styles.pendingInfo}>
              <Text style={styles.pendingTitle}>
                {pendingCount} transações pendentes
              </Text>
              <Text style={styles.pendingSubtitle}>
                Toque para revisar e confirmar
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.methodsGrid}>
          {captureMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodCard}
              onPress={() => handleCapture(method.id)}
              disabled={isProcessing}
            >
              <View
                style={[
                  styles.methodIcon,
                  { backgroundColor: method.color + '20' },
                ]}
              >
                <Ionicons
                  name={method.icon as any}
                  size={28}
                  color={method.color}
                />
              </View>
              <Text style={styles.methodTitle}>{method.title}</Text>
              <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Como funciona</Text>
          <View style={styles.infoItem}>
            <Ionicons name="phone-portrait" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              O app detecta transações via SMS, notificações e comandos de voz
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Você confirma ou edita antes de salvar
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Dados ficam seguros no seu dispositivo
            </Text>
          </View>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  processingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.lg,
  },
  processingText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.warning + '15',
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.warning,
  },
  pendingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  methodCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  methodSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
});
