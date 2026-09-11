import { detectCategoryFromText } from '../utils/categories';

describe('Categories', () => {
  test('detects food category', () => {
    expect(detectCategoryFromText('supermercado')).toBe('supermarket');
    expect(detectCategoryFromText('restaurante')).toBe('restaurant');
  });

  test('detects transport category', () => {
    expect(detectCategoryFromText('uber')).toBe('uber');
    expect(detectCategoryFromText('combustivel')).toBe('fuel');
  });

  test('detects entertainment category', () => {
    expect(detectCategoryFromText('netflix')).toBe('streaming');
    expect(detectCategoryFromText('spotify')).toBe('streaming');
  });

  test('returns default category', () => {
    expect(detectCategoryFromText('xyz123')).toBe('other_expense');
  });
});
