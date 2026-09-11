import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../hooks';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import TransactionDetailScreen from '../screens/transactions/TransactionDetailScreen';
import TransactionListScreen from '../screens/transactions/TransactionListScreen';
import AccountsScreen from '../screens/accounts/AccountsScreen';
import SubscriptionScreen from '../screens/settings/SubscriptionScreen';
import PrivacyScreen from '../screens/settings/PrivacyScreen';
import PendingTransactionsScreen from '../screens/capture/PendingTransactionsScreen';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);

  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const completed = await AsyncStorage.getItem('@balanz_onboarding_completed');
        setHasCompletedOnboarding(completed === 'true');
      } catch {
        setHasCompletedOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!hasCompletedOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          initialParams={{ onComplete: () => setHasCompletedOnboarding(true) }}
        />
      ) : !user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="TransactionList" component={TransactionListScreen} />
          <Stack.Screen name="Accounts" component={AccountsScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="PendingTransactions" component={PendingTransactionsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
