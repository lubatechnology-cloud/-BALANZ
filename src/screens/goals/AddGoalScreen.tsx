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
import { useAuth } from '../../hooks';
import { createGoal, getGoalSuggestions } from '../../services/goals/goalService';

export default function AddGoalScreen({ route, navigation }: any) {
  const { user } = useAuth();
  const suggestion = route?.params?.suggestion;

  const [name, setName] = useState(suggestion?.name || '');
  const [targetAmount, setTargetAmount] = useState(suggestion?.targetAmount?.toString() || '');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [icon, setIcon] = useState(suggestion?.icon || 'flag');
  const [color, setColor] = useState(suggestion?.color || colors.primary);

  const icons = ['flag', 'airplane', 'car', 'home', 'trending-up', 'gift', 'heart', 'star'];
  const colorsList = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#E74C3C'];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Informe o nome da meta');
      return;
    }
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('Erro', 'Informe um valor alvo válido');
      return;
    }

    try {
      if (user?.id) {
        await createGoal(user.id, {
          name: name.trim(),
          targetAmount: parseFloat(targetAmount),
          deadline,
          icon,
          color,
        });
        Alert.alert('Sucesso', 'Meta criada!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a meta');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Meta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome da Meta</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Viagem dos sonhos"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Valor Alvo (R$)</Text>
          <TextInput
            style={styles.input}
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="0,00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Prazo</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateText}>{deadline.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDeadline(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ícone</Text>
          <View style={styles.iconGrid}>
            {icons.map((i) => (
              <TouchableOpacity
                key={i}
                style={[styles.iconCard, icon === i && styles.iconCardActive]}
                onPress={() => setIcon(i)}
              >
                <Ionicons name={i as any} size={24} color={icon === i ? colors.primary : colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Cor</Text>
          <View style={styles.colorGrid}>
            {colorsList.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Criar Meta</Text>
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
  iconGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  iconCard: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCardActive: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
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
