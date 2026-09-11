import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import { ProgressBar } from '../../components/charts/Charts';
import { useAuth } from '../../hooks';
import { getGoals, createGoal, addToGoal, deleteGoal, getGoalSuggestions, Goal } from '../../services/goals/goalService';

export default function GoalsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    if (!user?.id) return;
    const data = await getGoals(user.id);
    setGoals(data);
  };

  const handleAddToGoal = (goal: Goal) => {
    Alert.prompt(
      'Adicionar à meta',
      `Quanto deseja adicionar a "${goal.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adicionar',
          onPress: async (value) => {
            const amount = parseFloat(value || '0');
            if (amount > 0 && user?.id) {
              await addToGoal(user.id, goal.id, amount);
              loadGoals();
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const handleDeleteGoal = (goal: Goal) => {
    Alert.alert(
      'Excluir meta',
      `Excluir meta "${goal.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (user?.id) {
              await deleteGoal(user.id, goal.id);
              loadGoals();
            }
          },
        },
      ]
    );
  };

  const suggestions = getGoalSuggestions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Metas</Text>
        <TouchableOpacity onPress={() => setShowSuggestions(!showSuggestions)}>
          <Ionicons name="bulb" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showSuggestions && (
          <View style={styles.suggestionsCard}>
            <Text style={styles.suggestionsTitle}>Sugestões de Metas</Text>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  navigation.navigate('AddGoal', { suggestion });
                  setShowSuggestions(false);
                }}
              >
                <Ionicons
                  name={suggestion.icon as any}
                  size={24}
                  color={suggestion.color}
                />
                <View style={styles.suggestionInfo}>
                  <Text style={styles.suggestionName}>{suggestion.name}</Text>
                  <Text style={styles.suggestionAmount}>
                    {formatCurrency(suggestion.targetAmount || 0)}
                  </Text>
                </View>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Sem metas</Text>
            <Text style={styles.emptySubtitle}>
              Defina metas para alcançar seus objetivos financeiros
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('AddGoal')}
            >
              <Text style={styles.createButtonText}>Criar Meta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCard}
              onPress={() => handleAddToGoal(goal)}
              onLongPress={() => handleDeleteGoal(goal)}
            >
              <View style={styles.goalHeader}>
                <View
                  style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}
                >
                  <Ionicons name={goal.icon as any} size={24} color={goal.color} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDeadline}>
                    Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
              <ProgressBar progress={goal.percentage} color={goal.color} height={10} />
              <View style={styles.goalFooter}>
                <Text style={styles.goalAmount}>
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </Text>
                <Text style={[styles.goalPercentage, { color: goal.color }]}>
                  {goal.percentage.toFixed(0)}%
                </Text>
              </View>
              <Text style={styles.goalMonthly}>
                Contribuição mensal: {formatCurrency(goal.monthlyContribution)}
              </Text>
            </TouchableOpacity>
          ))
        )}
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
  suggestionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  suggestionsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  suggestionAmount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  goalDeadline: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  goalAmount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  goalPercentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  goalMonthly: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
