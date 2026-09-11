import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}

function SettingItem({ icon, title, subtitle, right, onPress }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {right || <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [biometric, setBiometric] = React.useState(false);
  const [smsCapture, setSmsCapture] = React.useState(false);
  const [emailCapture, setEmailCapture] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <SettingItem icon="person" title="Perfil" subtitle="Nome, email, foto" />
          <SettingItem icon="wallet" title="Contas" subtitle="Gerenciar contas bancárias" />
          <SettingItem icon="diamond" title="BALANZ Premium" subtitle="Desbloquear todos os recursos" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Captura automática</Text>
          <SettingItem
            icon="chatbubble"
            title="Captura por SMS"
            subtitle="Detectar pagamentos via SMS"
            right={<Switch value={smsCapture} onValueChange={setSmsCapture} trackColor={{ true: colors.primary }} />}
          />
          <SettingItem
            icon="mail"
            title="Captura por Email"
            subtitle="Detectar pagamentos via email"
            right={<Switch value={emailCapture} onValueChange={setEmailCapture} trackColor={{ true: colors.primary }} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          <SettingItem
            icon="finger-print"
            title="Autenticação biométrica"
            subtitle="Face ID / Touch ID"
            right={<Switch value={biometric} onValueChange={setBiometric} trackColor={{ true: colors.primary }} />}
          />
          <SettingItem icon="lock" title="Alterar senha" />
          <SettingItem icon="shield-checkmark" title="Política de Privacidade" />
          <SettingItem icon="document-text" title="Termos de Uso" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          <SettingItem
            icon="notifications"
            title="Notificações"
            right={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary }} />}
          />
          <SettingItem icon="globe" title="Idioma" subtitle="Português" />
          <SettingItem icon="cash" title="Moeda" subtitle="BRL (R$)" />
          <SettingItem icon="moon" title="Modo escuro" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <SettingItem icon="download" title="Exportar dados" subtitle="PDF ou CSV" />
          <SettingItem icon="cloud-upload" title="Backup" subtitle="Último: hoje" />
          <SettingItem icon="trash" title="Apagar conta" subtitle="Remover todos os dados" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>BALANZ v1.0.0</Text>
          <Text style={styles.copyright}>Feito com ♥ pela Lubatechnology</Text>
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
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.xs,
  },
  version: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  copyright: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
