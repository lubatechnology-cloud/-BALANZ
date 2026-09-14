import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store';
import {
  loginWithEmail,
  registerWithEmail,
  logout as authLogout,
  getCurrentUser,
  resetPassword,
  completeOnboarding,
  isOnboardingCompleted,
} from '../services/auth/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await loginWithEmail(email, password);
      setUser({
        id: result.id,
        email: result.email,
        displayName: result.displayName,
        photoURL: result.photoURL,
      });
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const result = await registerWithEmail(email, password, name);
      setUser({
        id: result.id,
        email: result.email,
        displayName: result.displayName,
        photoURL: result.photoURL,
      });
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    await resetPassword(email);
  };

  const onOnboardingComplete = async () => {
    await completeOnboarding();
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    onOnboardingComplete,
  };
}
