import { formatCurrency, formatDate, getGreeting } from '../utils/formatters';

describe('Formatters', () => {
  test('formats currency in BRL', () => {
    expect(formatCurrency(1500)).toBe('R$ 1.500,00');
    expect(formatCurrency(0)).toBe('R$ 0,00');
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });

  test('formats date in pt-BR', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('2024');
  });

  test('returns greeting based on time', () => {
    const greeting = getGreeting();
    expect(typeof greeting).toBe('string');
    expect(greeting.length).toBeGreaterThan(0);
  });
});
