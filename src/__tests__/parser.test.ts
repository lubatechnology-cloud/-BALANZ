import { parseSMSMessage, parseVoiceCommand } from '../services/capture/parser';

describe('SMS Parser', () => {
  test('detects Nubank PIX payment', () => {
    const msg = 'Nubank: Pagamento de R$ 150,00 realizado para Mercado Pago';
    const result = parseSMSMessage(msg);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(150);
    expect(result?.type).toBe('expense');
    expect(result?.bank).toBe('Nubank');
  });

  test('detects salary deposit', () => {
    const msg = 'Banco do Brasil: Salário creditado R$ 5.000,00';
    const result = parseSMSMessage(msg);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(5000);
    expect(result?.type).toBe('income');
  });

  test('detects Inter transfer', () => {
    const msg = 'Inter: Transferência de R$ 200,00 enviada via PIX';
    const result = parseSMSMessage(msg);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(200);
    expect(result?.bank).toBe('Inter');
  });

  test('returns null for irrelevant message', () => {
    const msg = 'Promoção: Confira nossas ofertas de verão!';
    const result = parseSMSMessage(msg);
    expect(result).toBeNull();
  });
});

describe('Voice Parser', () => {
  test('parses expense command', () => {
    const msg = 'Gastei 50 reais no mercado';
    const result = parseVoiceCommand(msg);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(50);
    expect(result?.type).toBe('expense');
  });

  test('parses income command', () => {
    const msg = 'Recebi 200 reais';
    const result = parseVoiceCommand(msg);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(200);
    expect(result?.type).toBe('income');
  });
});
