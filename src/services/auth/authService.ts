import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@balanz_current_user';
const USERS_KEY = '@balanz_users';

export interface LocalUser {
  id: string;
  email: string;
  displayName: string;
  password: string;
  photoURL: string | null;
  createdAt: string;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<LocalUser> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: LocalUser[] = usersJson ? JSON.parse(usersJson) : [];

  const existing = users.find((u) => u.email === email);
  if (existing) {
    throw new Error('Email já cadastrado');
  }

  const newUser: LocalUser = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    email,
    displayName,
    password,
    photoURL: null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

  const { password: _, ...userWithoutPassword } = newUser;
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

  return newUser;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<LocalUser> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: LocalUser[] = usersJson ? JSON.parse(usersJson) : [];

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  const { password: _, ...userWithoutPassword } = user;
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

  return user;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function getCurrentUser(): Promise<Omit<LocalUser, 'password'> | null> {
  const userJson = await AsyncStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export async function updateProfile(
  updates: Partial<Pick<LocalUser, 'displayName' | 'photoURL'>>
): Promise<void> {
  const userJson = await AsyncStorage.getItem(USER_KEY);
  if (!userJson) return;

  const user = JSON.parse(userJson);
  const updated = { ...user, ...updates };
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
}

export async function resetPassword(email: string): Promise<void> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: LocalUser[] = usersJson ? JSON.parse(usersJson) : [];

  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error('Email não encontrado');
  }

  user.password = '123456';
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function isOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem('@balanz_onboarding_completed');
  return value === 'true';
}

export async function completeOnboarding(): Promise<void> {
  await AsyncStorage.setItem('@balanz_onboarding_completed', 'true');
}
