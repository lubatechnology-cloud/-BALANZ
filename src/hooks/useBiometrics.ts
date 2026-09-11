import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_KEY = '@balanz_biometric_enabled';

export function useBiometrics() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsAvailable(compatible);

    if (compatible) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Touch ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('Iris');
      }

      const enabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
      setIsEnabled(enabled === 'true');
    }
  };

  const authenticate = async (promptMessage = 'Autentique-se para continuar'): Promise<boolean> => {
    if (!isAvailable) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
      fallbackLabel: 'Usar senha',
    });

    return result.success;
  };

  const toggleBiometric = async (): Promise<boolean> => {
    if (!isAvailable) return false;

    const success = await authenticate('Autentique para ativar a biometria');

    if (success) {
      const newValue = !isEnabled;
      await AsyncStorage.setItem(BIOMETRIC_KEY, String(newValue));
      setIsEnabled(newValue);
      return true;
    }

    return false;
  };

  return {
    isAvailable,
    isEnabled,
    biometricType,
    authenticate,
    toggleBiometric,
  };
}
