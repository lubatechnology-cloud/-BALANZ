import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks';
import { createBackup, restoreBackup, getBackupHistory, exportBackupToFile, BackupMetadata } from '../../services/backup/backupService';

export default function BackupScreen({ navigation }: any) {
  const { user } = useAuth();
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    if (!user?.id) return;
    const history = await getBackupHistory(user.id);
    setBackups(history.reverse());
  };

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      if (user?.id) {
        await createBackup(user.id);
        Alert.alert('Sucesso', 'Backup criado com sucesso!');
        loadBackups();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o backup');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreBackup = async () => {
    Alert.alert(
      'Restaurar Backup',
      'Isso substituirá todos os dados atuais. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          onPress: async () => {
            setIsRestoring(true);
            try {
              if (user?.id) {
                const success = await restoreBackup(user.id);
                if (success) {
                  Alert.alert('Sucesso', 'Backup restaurado com sucesso!');
                } else {
                  Alert.alert('Erro', 'Nenhum backup encontrado');
                }
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível restaurar');
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  };

  const handleExportBackup = async () => {
    if (user?.id) {
      await exportBackupToFile(user.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Backup</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={[styles.actionButton, isCreating && styles.actionButtonDisabled]}
            onPress={handleCreateBackup}
            disabled={isCreating}
          >
            <Ionicons name="cloud-upload" size={24} color={colors.primary} />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Criar Backup</Text>
              <Text style={styles.actionDescription}>
                Salvar todos os dados no dispositivo
              </Text>
            </View>
            {isCreating && <ActivityIndicator size="small" color={colors.primary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isRestoring && styles.actionButtonDisabled]}
            onPress={handleRestoreBackup}
            disabled={isRestoring}
          >
            <Ionicons name="cloud-download" size={24} color={colors.income} />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Restaurar Backup</Text>
              <Text style={styles.actionDescription}>
                Recuperar dados de um backup anterior
              </Text>
            </View>
            {isRestoring && <ActivityIndicator size="small" color={colors.income} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportBackup}>
            <Ionicons name="share" size={24} color={colors.primary} />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Exportar Backup</Text>
              <Text style={styles.actionDescription}>
                Compartilhar arquivo de backup
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico de Backups</Text>
          {backups.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>Nenhum backup encontrado</Text>
            </View>
          ) : (
            backups.map((backup) => (
              <View key={backup.id} style={styles.backupItem}>
                <Ionicons name="document" size={20} color={colors.primary} />
                <View style={styles.backupInfo}>
                  <Text style={styles.backupDate}>
                    {new Date(backup.date).toLocaleDateString('pt-BR')}{' '}
                    {new Date(backup.date).toLocaleTimeString('pt-BR')}
                  </Text>
                  <Text style={styles.backupDetails}>
                    {backup.transactionCount} transações • {(backup.size / 1024).toFixed(1)} KB
                  </Text>
                </View>
                <Text style={[styles.backupType, { color: backup.type === 'auto' ? colors.primary : colors.textSecondary }]}>
                  {backup.type === 'auto' ? 'Auto' : 'Manual'}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Backups são salvos localmente no dispositivo. Para sincronizar entre
            dispositivos, use a exportação para compartilhar o arquivo.
          </Text>
        </View>
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
  actionsCard: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  actionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historySection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  backupInfo: {
    flex: 1,
  },
  backupDate: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  backupDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  backupType: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
