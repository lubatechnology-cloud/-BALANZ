export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  icon: string;
  color: string;
  percentage: number;
  monthlyContribution: number;
  createdAt: Date;
}

const STORAGE_KEY = '@balanz_goals';

export async function getGoals(userId: string): Promise<Goal[]> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const data = await AsyncStorage.getItem(`${STORAGE_KEY}_${userId}`);
  return data ? JSON.parse(data) : [];
}

export async function createGoal(
  userId: string,
  goal: Omit<Goal, 'id' | 'currentAmount' | 'percentage' | 'monthlyContribution' | 'createdAt'>
): Promise<Goal> {
  const goals = await getGoals(userId);

  const newGoal: Goal = {
    ...goal,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    currentAmount: 0,
    percentage: 0,
    monthlyContribution: calculateMonthlyContribution(goal.targetAmount, 0, new Date(goal.deadline)),
    createdAt: new Date(),
  };

  goals.push(newGoal);
  await saveGoals(userId, goals);
  return newGoal;
}

export async function updateGoal(
  userId: string,
  goalId: string,
  updates: Partial<Goal>
): Promise<Goal | null> {
  const goals = await getGoals(userId);
  const index = goals.findIndex((g) => g.id === goalId);
  if (index === -1) return null;

  goals[index] = { ...goals[index], ...updates };
  goals[index].percentage = (goals[index].currentAmount / goals[index].targetAmount) * 100;
  goals[index].monthlyContribution = calculateMonthlyContribution(
    goals[index].targetAmount,
    goals[index].currentAmount,
    new Date(goals[index].deadline)
  );

  await saveGoals(userId, goals);
  return goals[index];
}

export async function addToGoal(
  userId: string,
  goalId: string,
  amount: number
): Promise<Goal | null> {
  const goal = (await getGoals(userId)).find((g) => g.id === goalId);
  if (!goal) return null;

  return updateGoal(userId, goalId, {
    currentAmount: goal.currentAmount + amount,
  });
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  const goals = await getGoals(userId);
  const filtered = goals.filter((g) => g.id !== goalId);
  await saveGoals(userId, filtered);
}

function calculateMonthlyContribution(
  target: number,
  current: number,
  deadline: Date
): number {
  const now = new Date();
  const monthsRemaining = Math.max(
    1,
    (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth())
  );
  const remaining = target - current;
  return remaining / monthsRemaining;
}

export function getGoalSuggestions(): Partial<Goal>[] {
  return [
    {
      name: 'Fundo de Emergência',
      targetAmount: 10000,
      icon: 'shield-checkmark',
      color: '#00B894',
    },
    {
      name: 'Viagem',
      targetAmount: 5000,
      icon: 'airplane',
      color: '#0984E3',
    },
    {
      name: 'Carro Novo',
      targetAmount: 50000,
      icon: 'car',
      color: '#6C5CE7',
    },
    {
      name: 'Casa Própria',
      targetAmount: 100000,
      icon: 'home',
      color: '#E17055',
    },
    {
      name: 'Aposentadoria',
      targetAmount: 500000,
      icon: 'trending-up',
      color: '#FDCB6E',
    },
  ];
}

async function saveGoals(userId: string, goals: Goal[]): Promise<void> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(goals));
}
