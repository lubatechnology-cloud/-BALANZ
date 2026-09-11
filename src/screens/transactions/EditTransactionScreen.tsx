import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../../theme';
import { useAuth, useTransactions } from '../../hooks';

export default function EditTransactionScreen({ route, navigation }: any) {
  const { transactionId } = route.params;
  const { user } = useAuth();
  const { transactions, editTransaction } = useTransactions(user?.id);

  const transaction = transactions.find((t) => t.id === transactionId);

  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [category, setCategory] = useState(transaction?.category || 'other_expense');
  const [date, setDate] = useState(transaction?.date ? new Date(transaction.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Transação</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Transação não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categories = [
    { id: 'food', label: 'Alimentação' },
    { id: 'transport', label: 'Transporte' },
    { id: 'health', label: 'Saúde' },
    { id: 'leisure', label: 'Lazer' },
    { id: 'shopping', label: 'Compras' },
    { id: 'bills', label: 'Contas' },
    { id: 'salary', label: 'Salário' },
    { id: 'other_income', label: 'Outra Receita' },
    { id: 'other_expense', label: 'Outra Despesa' },
  ];

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Erro', 'Informe um valor válido');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Informe uma descrição');
      return;
    }

    try {
      await editTransaction(transactionId, {
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
      });
      Alert.alert('Sucesso', 'Transação atualizada!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Transação</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
              Despesa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0,00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Supermercado"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, category === cat.id && styles.categoryChipActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateText}>{date.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert('Excluir', 'Excluir esta transação?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => navigation.goBack(),
              },
            ]);
          }}
        >
          <Ionicons name="trash" size={20} color={colors.expense} />
          <Text style={styles.deleteButtonText}>Excluir Transação</Text>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  typeButton: {
    flex: 1,
    padding: spacing.base,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.expense + '20',
    borderWidth: 1,
    borderColor: colors.expense,
  },
  typeButtonActiveIncome: {
    backgroundColor: colors.income + '20',
    borderWidth: 1,
    borderColor: colors.income,
  },
  typeText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.text,
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
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: typography.fontWeight.medium,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
  },
  dateText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  saveButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  deleteButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.expense,
  },
});
