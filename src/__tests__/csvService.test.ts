import { parseCSVData, generateCSVTemplate } from '../services/capture/csvService';

describe('CSV Parser', () => {
  test('parses valid CSV data', () => {
    const csv = `Data,Descrição,Valor,Tipo
2024-01-15,Supermercado,-150.00,Despesa
2024-01-16,Salário,5000.00,Receita`;

    const result = parseCSVData(csv);
    expect(result.length).toBe(2);
    expect(result[0].amount).toBe(150);
    expect(result[0].type).toBe('expense');
    expect(result[1].amount).toBe(5000);
    expect(result[1].type).toBe('income');
  });

  test('generates CSV template', () => {
    const template = generateCSVTemplate();
    expect(template).toContain('Data');
    expect(template).toContain('Descrição');
    expect(template).toContain('Valor');
  });

  test('handles empty CSV', () => {
    const result = parseCSVData('');
    expect(result.length).toBe(0);
  });

  test('skips invalid rows', () => {
    const csv = `Data,Descrição,Valor,Tipo
2024-01-15,Supermercado,-150.00,Despesa
invalid line
2024-01-16,Salário,5000.00,Receita`;

    const result = parseCSVData(csv);
    expect(result.length).toBe(2);
  });
});
