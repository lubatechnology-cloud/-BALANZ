// backup service

const BACKUP_KEY = '@balanz_backup';
const BACKUP_HISTORY_KEY = '@balanz_backup_history';

export interface BackupMetadata {
  id: string;
  date: Date;
  size: number;
  transactionCount: number;
  type: 'manual' | 'auto';
}

export async function createBackup(userId: string): Promise<BackupMetadata> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const keys = await AsyncStorage.getAllKeys();
  const userKeys = keys.filter(
    (key) => key.startsWith(`@balanz_${userId}`) || key.startsWith(`user_${userId}`)
  );
  const userData = await AsyncStorage.multiGet(userKeys);

  const backup = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    userId,
    data: Object.fromEntries(userData),
  };

  const backupJson = JSON.stringify(backup);
  await AsyncStorage.setItem(`${BACKUP_KEY}_${userId}`, backupJson);

  const metadata: BackupMetadata = {
    id: Date.now().toString(36),
    date: new Date(),
    size: backupJson.length,
    transactionCount: userData.filter(([k]) => k.includes('transaction')).length,
    type: 'manual',
  };

  const history = await getBackupHistory(userId);
  history.push(metadata);
  await AsyncStorage.setItem(
    `${BACKUP_HISTORY_KEY}_${userId}`,
    JSON.stringify(history)
  );

  return metadata;
}

export async function restoreBackup(userId: string): Promise<boolean> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  try {
    const backupJson = await AsyncStorage.getItem(`${BACKUP_KEY}_${userId}`);
    if (!backupJson) return false;

    const backup = JSON.parse(backupJson);
    const entries = Object.entries(backup.data) as [string, string][];

    await AsyncStorage.multiSet(entries);
    return true;
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    return false;
  }
}

export async function getBackupHistory(
  userId: string
): Promise<BackupMetadata[]> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const data = await AsyncStorage.getItem(`${BACKUP_HISTORY_KEY}_${userId}`);
  return data ? JSON.parse(data) : [];
}

export async function deleteBackup(userId: string): Promise<void> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.removeItem(`${BACKUP_KEY}_${userId}`);
  await AsyncStorage.removeItem(`${BACKUP_HISTORY_KEY}_${userId}`);
}

export async function exportBackupToFile(userId: string): Promise<string | null> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const FileSystem = require('expo-file-system');
  const Sharing = require('expo-sharing');

  try {
    const backupJson = await AsyncStorage.getItem(`${BACKUP_KEY}_${userId}`);
    if (!backupJson) return null;

    const fileName = `balanz_backup_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, backupJson);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    }

    return filePath;
  } catch (error) {
    console.error('Erro ao exportar backup:', error);
    return null;
  }
}

export async function importBackupFromFile(): Promise<boolean> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const DocumentPicker = require('expo-document-picker');

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) return false;

    const FileSystem = require('expo-file-system');
    const backupJson = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const backup = JSON.parse(backupJson);

    if (!backup.version || !backup.data) {
      return false;
    }

    const entries = Object.entries(backup.data) as [string, string][];
    await AsyncStorage.multiSet(entries);

    return true;
  } catch (error) {
    console.error('Erro ao importar backup:', error);
    return false;
  }
}

export function scheduleAutoBackup(userId: string): void {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const LAST_BACKUP_KEY = '@balanz_last_auto_backup';

  setInterval(async () => {
    try {
      const lastBackup = await AsyncStorage.getItem(LAST_BACKUP_KEY);
      const now = Date.now();

      if (!lastBackup || now - parseInt(lastBackup) > 7 * 24 * 60 * 60 * 1000) {
        await createBackup(userId);
        await AsyncStorage.setItem(LAST_BACKUP_KEY, now.toString());
      }
    } catch (error) {
      console.error('Erro no backup automático:', error);
    }
  }, 24 * 60 * 60 * 1000);
}
