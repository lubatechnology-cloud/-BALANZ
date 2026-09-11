import { parseEmailBody } from './parser';
import { PendingTransaction } from '../types';

const IMAP_CONFIG = {
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
};

export async function connectToEmail(
  email: string,
  password: string
): Promise<boolean> {
  try {
    console.log('Email Service: Conectando via IMAP...');
    console.log('Email Service: Use react-native-inbox para IMAP real');
    return true;
  } catch (error) {
    console.error('Erro ao conectar email:', error);
    return false;
  }
}

export async function fetchBankEmails(): Promise<any[]> {
  try {
    console.log('Email Service: Buscando emails de bancos...');
    return [];
  } catch (error) {
    console.error('Erro ao buscar emails:', error);
    return [];
  }
}

export function processEmailBody(
  subject: string,
  body: string,
  from: string
): PendingTransaction | null {
  const fullMessage = `De: ${from}\nAssunto: ${subject}\n${body}`;
  const parsed = parseEmailBody(fullMessage);

  if (!parsed) return null;

  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    amount: parsed.amount,
    type: parsed.type,
    category: parsed.category,
    description: parsed.description,
    bank: parsed.bank,
    date: new Date(),
    source: 'email',
    rawMessage: fullMessage,
    isConfirmed: false,
  };
}

export async function disconnectEmail(): Promise<void> {
  console.log('Email Service: Desconectado');
}
