import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

export default function HelpScreen({ navigation }: any) {
  const faqItems = [
    {
      question: 'Como funciona a captura automática?',
      answer:
        'O BALANZ detecta transações via SMS, notificações, e-mail e comandos de voz. Você confirma antes de salvar.',
    },
    {
      question: 'Meus dados estão seguros?',
      answer:
        'Sim! Usamos criptografia e armazenamento local. Você pode ativar bloqueio biométrico.',
    },
    {
      question: 'Como cancelar a assinatura?',
      answer:
        'Acesse Configurações > Assinatura > Gerenciar. O cancelamento é feito pela App Store ou Google Play.',
    },
    {
      question: 'Posso exportar meus dados?',
      answer:
        'Sim! Acesse Configurações > Privacidade > Exportar Dados.',
    },
    {
      question: 'Como adicionar contas bancárias?',
      answer:
        'Acesse Contas > Adicionar. Você pode cadastrar quantas contas quiser.',
    },
    {
      question: 'O app funciona offline?',
      answer:
        'Sim! Você pode usar todas as funcionalidades offline. Os dados sincronizam quando voltar online.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      label: 'E-mail',
      value: 'suporte@balanz.app',
      action: () => Linking.openURL('mailto:suporte@balanz.app'),
    },
    {
      icon: 'logo-whatsapp',
      label: 'WhatsApp',
      value: '(11) 99999-9999',
      action: () => Linking.openURL('https://wa.me/5511999999999'),
    },
    {
      icon: 'globe',
      label: 'Website',
      value: 'balanz.app',
      action: () => Linking.openURL('https://balanz.app'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Ajuda</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactItem}
              onPress={option.action}
            >
              <Ionicons name={option.icon as any} size={24} color={colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{option.label}</Text>
                <Text style={styles.contactValue}>{option.value}</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos</Text>
          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="play-circle" size={24} color={colors.primary} />
            <Text style={styles.resourceLabel}>Tutorial em vídeo</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="document-text" size={24} color={colors.primary} />
            <Text style={styles.resourceLabel}>Guia de uso</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="star" size={24} color={colors.primary} />
            <Text style={styles.resourceLabel}>Avaliar o app</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>BALANZ v1.0.0</Text>
          <Text style={styles.versionText}>© 2024 Luba Technology</Text>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  faqQuestion: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  faqAnswer: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  contactValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  resourceLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
