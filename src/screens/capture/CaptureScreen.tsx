import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const CAPTURE_OPTIONS = [
  {
    id: 'voice',
    title: 'Comando de voz',
    description: 'Diga o que comprou ou pagou',
    icon: 'mic',
    color: colors.primary,
    isPremium: false,
  },
  {
    id: 'manual',
    title: 'Adicionar manual',
    description: 'Registre um gasto ou receita',
    icon: 'create',
    color: colors.secondary,
    isPremium: false,
  },
  {
    id: 'ocr',
    title: 'Escanear fatura',
    description: 'Tire foto de uma fatura ou recibo',
    icon: 'camera',
    color: colors.warning,
    isPremium: true,
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Detecte pagamentos por email',
    icon: 'mail',
    color: colors.info,
    isPremium: true,
  },
  {
    id: 'sms',
    title: 'SMS',
    description: 'Detecte pagamentos por SMS',
    icon: 'chatbubble',
    color: colors.success,
    isPremium: true,
  },
  {
    id: 'csv',
    title: 'Importar CSV',
    description: 'Importe extratos bancários',
    icon: 'document',
    color: colors.danger,
    isPremium: true,
  },
];

export default function CaptureScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicionar</Text>
          <Text style={styles.subtitle}>Como deseja adicionar?</Text>
        </View>

        <View style={styles.grid}>
          {CAPTURE_OPTIONS.map((option) => (
            <TouchableOpacity key={option.id} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={28} color={option.color} />
                {option.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="diamond" size={10} color={colors.warning} />
                  </View>
                )}
              </View>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
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
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.base,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 2,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  cardDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
