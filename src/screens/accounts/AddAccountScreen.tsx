import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks';

const accountTypes = [
  { id: 'checking', label: 'Conta Corrente', icon: 'card' },
  { id: 'savings', label: 'Poupança', icon: 'wallet' },
  { id: 'credit_card', label: 'Cartão de Crédito', icon: 'card-outline' },
  { id: 'cash', label: 'Dinheiro', icon: 'cash' },
  { id: 'investment', label: 'Investimento', icon: 'trending-up' },
  { id: 'other', label: 'Outro', icon: 'ellipsis-horizontal' },
];

export default function AddAccountScreen({ navigation }: any) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('checking');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(colors.primary);

  const colors_list = [
    '#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#E74C3C',
    '#2ECC71', '#9B59B6', '#1ABC9C', '#F1C40F',
  ];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Informe o nome da conta');
      return;
    }
    Alert.alert('Sucesso', 'Conta adicionada!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Adicionar Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome da Conta</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Nubank"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeGrid}>
            {accountTypes.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeCard, type === t.id && styles.typeCardActive]}
                onPress={() => setType(t.id)}
              >
                <Ionicons name={t.icon as any} size={24} color={type === t.id ? colors.primary : colors.textMuted} />
                <Text style={[styles.typeLabel, type === t.id && styles.typeLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Saldo Inicial</Text>
          <TextInput
            style={styles.input}
            value={balance}
            onChangeText={setBalance}
            placeholder="0,00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Cor</Text>
          <View style={styles.colorGrid}>
            {colors_list.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Conta</Text>
        </TouchableOpacity>
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
  fieldGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    fontSize: typography.fontSize.lg,
    color: colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeCard: {
    width: '30%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeCardActive: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: colors.background,
    transform: [{ scale: 1.1 }],
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  saveButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
});
