import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth, useTransactions } from '../../hooks';
import { DEFAULT_CATEGORIES, getCategoryById } from '../../utils/categories';
import { TransactionType, Category } from '../../types';

interface Props {
  navigation: any;
  route: any;
}

export default function AddTransactionScreen({ navigation, route }: Props) {
  const initialType = route?.params?.type || 'expense';
  const { user } = useAuth();
  const { addTransaction } = useTransactions(user?.id);

  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = DEFAULT_CATEGORIES.filter((cat) => cat.type === type);

  useEffect(() => {
    setSelectedCategory('');
  }, [type]);

  const formatAmount = (text: string) => {
    const cleaned = text.replace(/[^\d.,]/g, '');
    setAmount(cleaned);
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Insira um valor válido');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Insira uma descrição');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Erro', 'Selecione uma categoria');
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        userId: user?.id || '',
        accountId: 'default',
        amount: parseFloat(amount.replace(',', '.')),
        type,
        category: selectedCategory,
        description: description.trim(),
        date,
        source: 'manual',
        isRecurring: false,
        isConfirmed: true,
      });

      Alert.alert('Sucesso', 'Transação adicionada!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => {
        setSelectedCategory(item.id);
        setShowCategoryPicker(false);
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.id && styles.categoryNameActive,
        ]}
      >
        {item.name}
      </Text>
      {selectedCategory === item.id && (
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Nova transação</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
              onPress={() => setType('expense')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
              onPress={() => setType('income')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextIncome,
                ]}
              >
                Receita
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'transfer' && styles.typeButtonTransfer]}
              onPress={() => setType('transfer')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'transfer' && styles.typeButtonTextTransfer,
                ]}
              >
                Transferir
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={formatAmount}
              placeholder="0,00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Supermercado, Uber, etc"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              {selectedCategory ? (
                <View style={styles.selectedCategory}>
                  <View
                    style={[
                      styles.categoryIconSmall,
                      { backgroundColor: getCategoryById(selectedCategory)?.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryById(selectedCategory)?.icon as any}
                      size={16}
                      color={getCategoryById(selectedCategory)?.color}
                    />
                  </View>
                  <Text style={styles.selectedCategoryText}>
                    {getCategoryById(selectedCategory)?.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Selecionar categoria</Text>
              )}
              <Ionicons
                name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {showCategoryPicker && (
            <View style={styles.categoryPickerContainer}>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.categoryRow}
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity style={styles.dateSelector}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateText}>
                {date.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  typeSelector: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xs,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: colors.expense,
  },
  typeButtonIncome: {
    backgroundColor: colors.income,
  },
  typeButtonTransfer: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  typeButtonTextIncome: {
    color: colors.white,
  },
  typeButtonTextTransfer: {
    color: colors.white,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  currencySymbol: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  amountInput: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    minWidth: 100,
    textAlign: 'center',
  },
  formGroup: {
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIconSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
  categoryPickerContainer: {
    marginBottom: spacing.xl,
  },
  categoryRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  categoryNameActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    paddingBottom: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
});
