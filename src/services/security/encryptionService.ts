import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_SERVICE = 'balanz-biometric';

export async function encryptData(data: string): Promise<string> {
  try {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
    return hash;
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return data;
  }
}

export async function secureStore(
  key: string,
  value: string
): Promise<void> {
  try {
    await AsyncStorage.setItem(`@secure_${key}`, value);
  } catch (error) {
    console.error('Erro ao salvar seguro:', error);
  }
}

export async function secureRetrieve(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(`@secure_${key}`);
  } catch (error) {
    console.error('Erro ao recuperar seguro:', error);
    return null;
  }
}

export async function secureDelete(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`@secure_${key}`);
  } catch (error) {
    console.error('Erro ao deletar seguro:', error);
  }
}

export async function verifyBiometric(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para acessar',
      cancelLabel: 'Cancelar',
    });

    return result.success;
  } catch (error) {
    console.error('Erro na biometria:', error);
    return false;
  }
}

export async function checkDeviceSecurity(): Promise<{
  isSecure: boolean;
  warnings: string[];
}> {
  const warnings: string[] = [];
  let isSecure = true;

  if (__DEV__) {
    warnings.push('Modo desenvolvimento ativo');
  }

  if (Platform.OS === 'ios') {
    const isJailbroken = await checkJailbreak();
    if (isJailbroken) {
      warnings.push('Dispositivo com jailbreak detectado');
      isSecure = false;
    }
  }

  if (Platform.OS === 'android') {
    const isRooted = await checkRoot();
    if (isRooted) {
      warnings.push('Dispositivo com root detectado');
      isSecure = false;
    }
  }

  return { isSecure, warnings };
}

async function checkJailbreak(): Promise<boolean> {
  try {
    const FileSystem = require('expo-file-system');
    const jailbreakPaths = [
      '/Applications/Cydia.app',
      '/Library/MobileSubstrate/MobileSubstrate.dylib',
      '/bin/bash',
      '/usr/sbin/sshd',
      '/etc/apt',
    ];

    for (const path of jailbreakPaths) {
      try {
        const info = await FileSystem.getInfoAsync(path);
        if (info.exists) return true;
      } catch {
        continue;
      }
    }
    return false;
  } catch {
    return false;
  }
}

async function checkRoot(): Promise<boolean> {
  try {
    const FileSystem = require('expo-file-system');
    const rootPaths = [
      '/system/app/Superuser.apk',
      '/system/xbin/su',
      '/system/bin/su',
    ];

    for (const path of rootPaths) {
      try {
        const info = await FileSystem.getInfoAsync(path);
        if (info.exists) return true;
      } catch {
        continue;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function getDataRetentionPolicy(): {
  maxRetentionDays: number;
  autoDelete: boolean;
} {
  return {
    maxRetentionDays: 365,
    autoDelete: true,
  };
}

export async function deleteUserData(userId: string): Promise<void> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(
      (key) => key.startsWith(`@balanz_${userId}`) || key.startsWith(`user_${userId}`)
    );
    await AsyncStorage.multiRemove(userKeys);

    await secureDelete(userId);

    console.log('Dados do usuário deletados com segurança');
  } catch (error) {
    console.error('Erro ao deletar dados:', error);
  }
}

export async function exportUserData(userId: string): Promise<string> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(
      (key) => key.startsWith(`@balanz_${userId}`) || key.startsWith(`user_${userId}`)
    );
    const userData = await AsyncStorage.multiGet(userKeys);
    return JSON.stringify(userData, null, 2);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return '{}';
  }
}
