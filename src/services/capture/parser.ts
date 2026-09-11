import { TransactionType } from '../types';

interface ParsedTransaction {
  amount: number;
  type: TransactionType;
  description: string;
  category: string;
  bank?: string;
  merchant?: string;
}

const BANK_PATTERNS = [
  { bank: 'Nubank', patterns: ['nubank', 'nu bank', 'nu pagamentos'] },
  { bank: 'Inter', patterns: ['inter', 'banco inter'] },
  { bank: 'Itaú', patterns: ['itaú', 'itau', 'banco itaú'] },
  { bank: 'Bradesco', patterns: ['bradesco', 'banco bradesco'] },
  { bank: 'Santander', patterns: ['santander', 'banco santander'] },
  { bank: 'Caixa', patterns: ['caixa', 'cef', 'caixa econ'] },
  { bank: 'BB', patterns: ['banco do brasil', 'bb ', 'banco bb'] },
  { bank: 'BTG', patterns: ['btg', 'btg pactual'] },
  { bank: 'C6', patterns: ['c6 bank', 'c6 '] },
  { bank: 'Mercado Pago', patterns: ['mercado pago', 'mercadopago'] },
  { bank: 'PicPay', patterns: ['picpay', 'pic pay'] },
];

const AMOUNT_PATTERNS = [
  /R\$\s*([\d.,]+)/gi,
  /([\d.,]+)\s*R\$/gi,
  /valor[:\s]*R?\$?\s*([\d.,]+)/gi,
  /(\d+[.,]\d{2})/g,
];

const TYPE_KEYWORDS: Record<TransactionType, string[]> = {
  income: ['recebido', 'crédito', 'depositado', 'transferência recebida', 'pix recebido', 'salário'],
  expense: ['pagamento', 'compra', 'débito', 'saque', 'pix enviado', 'transferência enviada', 'boleto'],
  transfer: ['transferência', 'ted', 'doc', 'pix'],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  supermarket: ['supermercado', 'mercado', 'hiper', 'atacad'],
  restaurant: ['restaurante', 'lanchonet', 'bar', 'pizzaria'],
  delivery: ['ifood', 'rappi', 'uber eats'],
  uber: ['uber', '99 ', 'taxi'],
  fuel: ['combustivel', 'posto', 'shell', 'petrobras'],
  streaming: ['netflix', 'spotify', 'globoplay', 'disney'],
  electricity: ['energia', 'cedae', 'sabesp'],
  pharmacy: ['farmacia', 'drogasil', 'drogaraia'],
};

export function parseSMSMessage(message: string): ParsedTransaction | null {
  const lowerMessage = message.toLowerCase();

  const isBankMessage = BANK_PATTERNS.some((b) =>
    b.patterns.some((p) => lowerMessage.includes(p))
  );

  if (!isBankMessage && !containsTransactionKeywords(lowerMessage)) {
    return null;
  }

  const amount = extractAmount(message);
  if (!amount || amount <= 0) return null;

  const type = detectTransactionType(lowerMessage);
  const bank = detectBank(lowerMessage);
  const category = detectCategory(lowerMessage);

  return {
    amount,
    type,
    description: extractDescription(message, amount),
    category,
    bank,
    merchant: extractMerchant(message),
  };
}

function containsTransactionKeywords(text: string): boolean {
  const allKeywords = [
    ...TYPE_KEYWORDS.income,
    ...TYPE_KEYWORDS.expense,
    'pagamento', 'compra', 'valor', 'saldo',
  ];
  return allKeywords.some((k) => text.includes(k));
}

function extractAmount(text: string): number {
  for (const pattern of AMOUNT_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      const amountStr = matches[0].replace(/[R$\s]/g, '').replace(',', '.');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return 0;
}

function detectTransactionType(text: string): TransactionType {
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) {
      return type as TransactionType;
    }
  }
  return 'expense';
}

function detectBank(text: string): string | undefined {
  for (const bank of BANK_PATTERNS) {
    if (bank.patterns.some((p) => text.includes(p))) {
      return bank.bank;
    }
  }
  return undefined;
}

function detectCategory(text: string): string {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) {
      return category;
    }
  }
  return 'other_expense';
}

function extractDescription(message: string, amount: number): string {
  let desc = message
    .replace(/R\$\s*[\d.,]+/g, '')
    .replace(/\d+[.,]\d{2}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (desc.length > 50) {
    desc = desc.substring(0, 50) + '...';
  }

  return desc || 'Transação detectada';
}

function extractMerchant(message: string): string | undefined {
  const merchantPatterns = [
    /(?:na|em|no|loja)\s+([A-ZÀ-Ú][a-zà-ú\s]+)/i,
    /(?:estabelecimento|comerciante)[:\s]+([A-ZÀ-Ú][a-zà-ú\s]+)/i,
  ];

  for (const pattern of merchantPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

export function parseEmailBody(body: string): ParsedTransaction | null {
  return parseSMSMessage(body);
}

export function parseVoiceCommand(command: string): ParsedTransaction | null {
  const lowerCommand = command.toLowerCase();

  const patterns = [
    /(?:gastei|paguei|comprei|paguei)\s+(?:de\s+)?R?\$?\s*([\d.,]+)\s+(?:no|na|em|com|para)\s+(.+)/i,
    /(?:recebi|ganhei|depositaram)\s+(?:de\s+)?R?\$?\s*([\d.,]+)/i,
    /R?\$?\s*([\d.,]+)\s+(?:no|na|em)\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = lowerCommand.match(pattern);
    if (match) {
      const amountStr = match[1].replace(',', '.');
      const amount = parseFloat(amountStr);

      if (!isNaN(amount) && amount > 0) {
        const isExpense = /gastei|paguei|comprei/i.test(lowerCommand);
        return {
          amount,
          type: isExpense ? 'expense' : 'income',
          description: match[2] || command,
          category: detectCategory(lowerCommand),
        };
      }
    }
  }

  return null;
}
