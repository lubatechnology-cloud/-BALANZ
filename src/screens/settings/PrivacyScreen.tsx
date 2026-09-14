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
import {
  verifyBiometric,
  checkDeviceSecurity,
  exportUserData,
  deleteUserData,
} from '../../services/security/encryptionService';
import { useAuth } from '../../hooks';

export default function PrivacyScreen({ navigation }: any) {
  const { user } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [deviceSecure, setDeviceSecure] = useState(true);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);

  useEffect(() => {
    checkSecurity();
  }, []);

  const checkSecurity = async () => {
    const { isSecure, warnings } = await checkDeviceSecurity();
    setDeviceSecure(isSecure);
    setSecurityWarnings(warnings);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const success = await verifyBiometric();
      if (success) {
        setBiometricEnabled(true);
        Alert.alert('Sucesso', 'Biometria ativada');
      } else {
        Alert.alert('Erro', 'Não foi possível verificar biometria');
      }
    } else {
      setBiometricEnabled(false);
    }
  };

  const handleExportData = async () => {
    if (!user?.id) return;
    const data = await exportUserData(user.id);
    Alert.alert('Exportar Dados', 'Dados exportados com sucesso');
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'Esta ação é irreversível. Todos os seus dados serão apagados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            if (user?.id) {
              await deleteUserData(user.id);
              Alert.alert('Sucesso', 'Dados apagados');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidade e Segurança</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {!deviceSecure && (
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color={colors.warning} />
            <View style={styles.warningInfo}>
              <Text style={styles.warningTitle}>Aviso de Segurança</Text>
              {securityWarnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>
                  • {warning}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autenticação</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print" size={24} color={colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Bloqueio biométrico</Text>
                <Text style={styles.settingDescription}>
                  Use impressão digital ou Face ID
                </Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
              thumbColor={biometricEnabled ? colors.primary : colors.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={24} color={colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Bloqueio automático</Text>
                <Text style={styles.settingDescription}>
                  Bloquear ao fechar o app
                </Text>
              </View>
            </View>
            <Switch
              value={autoLock}
              onValueChange={setAutoLock}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
              thumbColor={autoLock ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Criptografia</Text>
                <Text style={styles.settingDescription}>
                  Dados criptografados no dispositivo
                </Text>
              </View>
            </View>
            <Switch
              value={dataEncryption}
              onValueChange={setDataEncryption}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
              thumbColor={dataEncryption ? colors.primary : colors.textMuted}
              disabled
            />
          </View>

          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <Ionicons name="download" size={24} color={colors.primary} />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Exportar dados</Text>
              <Text style={styles.actionDescription}>
                Baixe uma cópia dos seus dados
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, styles.dangerItem]}
            onPress={handleDeleteData}
          >
            <Ionicons name="trash" size={24} color={colors.expense} />
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, { color: colors.expense }]}>
                Apagar todos os dados
              </Text>
              <Text style={styles.actionDescription}>
                Esta ação é irreversível
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Políticas</Text>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Ionicons name="document-text" size={20} color={colors.textSecondary} />
            <Text style={styles.linkLabel}>Política de Privacidade</Text>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('TermsOfUse')}
          >
            <Ionicons name="document-text" size={20} color={colors.textSecondary} />
            <Text style={styles.linkLabel}>Termos de Uso</Text>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Seus dados são armazenados apenas no seu dispositivo. Nenhuma
            informação é compartilhada sem sua permissão.
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
  warningCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.warning + '15',
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  warningInfo: {
    flex: 1,
  },
  warningTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  dangerItem: {
    backgroundColor: colors.expense + '10',
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  actionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  linkLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
