import React from 'react';
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
import { useSettingsStore } from '../../store/useSettingsStore';

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const {
    notificationsEnabled,
    toggleNotifications,
    theme,
    setTheme,
    language,
    setLanguage,
  } = useSettingsStore();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const settingsSections = [
    {
      title: 'Conta',
      items: [
        {
          icon: 'person',
          label: 'Perfil',
          subtitle: user?.displayName || user?.email,
          onPress: () => {},
        },
        {
          icon: 'card',
          label: 'Assinatura',
          subtitle: 'Gerenciar plano',
          onPress: () => navigation.navigate('Subscription'),
        },
        {
          icon: 'wallet',
          label: 'Contas bancárias',
          subtitle: 'Gerenciar contas',
          onPress: () => navigation.navigate('Accounts'),
        },
      ],
    },
    {
      title: 'Finanças',
      items: [
        {
          icon: 'pie-chart',
          label: 'Resumo Financeiro',
          subtitle: 'Visão geral',
          onPress: () => navigation.navigate('Summary'),
        },
        {
          icon: 'heart',
          label: 'Saúde Financeira',
          subtitle: 'Score e dicas',
          onPress: () => navigation.navigate('FinancialHealth'),
        },
        {
          icon: 'wallet',
          label: 'Orçamentos',
          subtitle: 'Controle de gastos',
          onPress: () => navigation.navigate('Budget'),
        },
        {
          icon: 'flag',
          label: 'Metas',
          subtitle: 'Objetivos financeiros',
          onPress: () => navigation.navigate('Goals'),
        },
        {
          icon: 'swap-horizontal',
          label: 'Conversor de Moedas',
          subtitle: 'Taxas de câmbio',
          onPress: () => navigation.navigate('CurrencyConverter'),
        },
      ],
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: 'notifications',
          label: 'Notificações',
          subtitle: 'Alertas e lembretes',
          onPress: () => navigation.navigate('Notifications'),
        },
        {
          icon: 'moon',
          label: 'Modo escuro',
          subtitle: 'Tema do aplicativo',
          toggle: true,
          value: theme === 'dark',
          onToggle: (v: boolean) => setTheme(v ? 'dark' : 'light'),
        },
        {
          icon: 'language',
          label: 'Idioma',
          subtitle: language === 'pt-BR' ? 'Português (BR)' : 'English',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Dados e Segurança',
      items: [
        {
          icon: 'shield-checkmark',
          label: 'Privacidade e segurança',
          subtitle: 'Biometria, criptografia',
          onPress: () => navigation.navigate('Privacy'),
        },
        {
          icon: 'cloud',
          label: 'Backup',
          subtitle: 'Restaurar e exportar',
          onPress: () => navigation.navigate('Backup'),
        },
        {
          icon: 'key',
          label: 'Alterar senha',
          subtitle: 'Atualizar senha',
          onPress: () => navigation.navigate('ForgotPassword'),
        },
      ],
    },
    {
      title: 'Sobre',
      items: [
        {
          icon: 'help-circle',
          label: 'Ajuda',
          subtitle: 'FAQ e suporte',
          onPress: () => navigation.navigate('Help'),
        },
        {
          icon: 'document-text',
          label: 'Termos de uso',
          subtitle: 'Política e termos',
          onPress: () => navigation.navigate('TermsOfUse'),
        },
        {
          icon: 'document-text',
          label: 'Política de privacidade',
          subtitle: 'Como tratamos seus dados',
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
        {
          icon: 'information-circle',
          label: 'Versão',
          subtitle: '1.0.0',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.displayName || 'Usuário'}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
                disabled={item.toggle}
              >
                <View style={styles.settingLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={colors.primary}
                  />
                  <View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {item.toggle ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{
                      false: colors.surfaceLight,
                      true: colors.primary + '50',
                    }}
                    thumbColor={item.value ? colors.primary : colors.textMuted}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textMuted}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={22} color={colors.expense} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BALANZ v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 Luba Technology</Text>
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
    paddingVertical: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  profileEmail: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
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
  settingLeft: {
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
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.expense + '10',
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  logoutText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.expense,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
