import { useEffect, useState } from 'react';
import { onAuthStateChange, loginWithEmail, registerWithEmail, loginWithGoogle, loginWithApple, logout, resetPassword } from '../services/auth/authService';
import { useAuthStore } from '../store';
import { User } from '../types';

export function useAuth() {
  const { user, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await loginWithEmail(email, password);
      setUser(user);
      return user;
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await registerWithEmail(email, password, displayName);
      setUser(user);
      return user;
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await loginWithGoogle();
      setUser(user);
      return user;
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await loginWithApple();
      setUser(user);
      return user;
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      storeLogout();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  };

  return {
    user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    googleLogin: handleGoogleLogin,
    appleLogin: handleAppleLogin,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    clearError: () => setError(null),
  };
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    case 'auth/wrong-password':
      return 'Senha incorreta';
    case 'auth/email-already-in-use':
      return 'Email já está em uso';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/weak-password':
      return 'Senha muito fraca';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet';
    case 'auth/popup-closed-by-user':
      return 'Login cancelado';
    case 'auth/cancelled-popup-request':
      return 'Login cancelado';
    case 'auth/operation-not-allowed':
      return 'Este método de login não está habilitado';
    default:
      return 'Ocorreu um erro. Tente novamente';
  }
}
