import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

class ErrorHandler {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  constructor() {
    this.setupGlobalErrorHandler();
  }

  private setupGlobalErrorHandler(): void {
    const originalHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      this.log({
        level: 'error',
        message: error.message,
        stack: error.stack,
        context: { isFatal },
      });

      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  log(errorLog: Omit<ErrorLog, 'timestamp'>): void {
    const log: ErrorLog = {
      ...errorLog,
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(log);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    if (__DEV__) {
      console.log(`[${log.level.toUpperCase()}] ${log.message}`, log.stack || '');
    }
  }

  error(message: string, context?: Record<string, any>): void {
    this.log({ level: 'error', message, context });
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log({ level: 'warn', message, context });
  }

  info(message: string, context?: Record<string, any>): void {
    this.log({ level: 'info', message, context });
  }

  async saveLogs(): Promise<void> {
    try {
      const logsJson = JSON.stringify(this.logs, null, 2);
      const fileName = `balanz_logs_${Date.now()}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, logsJson);
    } catch (error) {
      console.error('Erro ao salvar logs:', error);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  async exportLogs(): Promise<string | null> {
    try {
      const Sharing = require('expo-sharing');
      const logsJson = JSON.stringify(this.logs, null, 2);
      const fileName = `balanz_logs_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, logsJson);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
        return filePath;
      }
      return null;
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      return null;
    }
  }
}

export const errorHandler = new ErrorHandler();

export function handleAPIError(error: any, context?: string): string {
  let message = 'Erro desconhecido';

  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        message = 'Dados inválidos';
        break;
      case 401:
        message = 'Sessão expirada. Faça login novamente';
        break;
      case 403:
        message = 'Acesso negado';
        break;
      case 404:
        message = 'Recurso não encontrado';
        break;
      case 429:
        message = 'Muitas requisições. Aguarde um momento';
        break;
      case 500:
        message = 'Erro no servidor. Tente novamente';
        break;
      default:
        message = `Erro ${status}`;
    }
  } else if (error.request) {
    message = 'Sem conexão com a internet';
  } else if (error.message) {
    message = error.message;
  }

  errorHandler.error(message, { context, originalError: error.message });
  return message;
}

export function formatErrorForUser(error: any): string {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'Ocorreu um erro inesperado';
}
