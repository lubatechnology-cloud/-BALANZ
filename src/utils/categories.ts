import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Receitas
  { id: 'salary', name: 'Salário', icon: 'briefcase', color: '#00B894', type: 'income', isDefault: true },
  { id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#55EFC4', type: 'income', isDefault: true },
  { id: 'investment_income', name: 'Investimento', icon: 'trending-up', color: '#00CEC9', type: 'income', isDefault: true },
  { id: 'gift_income', name: 'Presente', icon: 'gift', color: '#81ECEC', type: 'income', isDefault: true },
  { id: 'other_income', name: 'Outros', icon: 'plus-circle', color: '#74B9FF', type: 'income', isDefault: true },

  // Despesas - Alimentação
  { id: 'supermarket', name: 'Supermercado', icon: 'cart', color: '#E17055', type: 'expense', isDefault: true },
  { id: 'restaurant', name: 'Restaurante', icon: 'restaurant', color: '#FDCB6E', type: 'expense', isDefault: true },
  { id: 'delivery', name: 'Delivery', icon: 'bicycle', color: '#E84393', type: 'expense', isDefault: true },
  { id: 'coffee', name: 'Café', icon: 'cafe', color: '#D63031', type: 'expense', isDefault: true },

  // Despesas - Transporte
  { id: 'uber', name: 'Uber/99', icon: 'car', color: '#6C5CE7', type: 'expense', isDefault: true },
  { id: 'fuel', name: 'Combustível', icon: 'speedometer', color: '#00B894', type: 'expense', isDefault: true },
  { id: 'parking', name: 'Estacionamento', icon: 'location', color: '#74B9FF', type: 'expense', isDefault: true },
  { id: 'public_transport', name: 'Transporte público', icon: 'bus', color: '#A29BFE', type: 'expense', isDefault: true },

  // Despesas - Moradia
  { id: 'rent', name: 'Aluguel', icon: 'home', color: '#0984E3', type: 'expense', isDefault: true },
  { id: 'condo', name: 'Condomínio', icon: 'business', color: '#6C5CE7', type: 'expense', isDefault: true },
  { id: 'electricity', name: 'Luz', icon: 'flash', color: '#FDCB6E', type: 'expense', isDefault: true },
  { id: 'water', name: 'Água', icon: 'water', color: '#74B9FF', type: 'expense', isDefault: true },
  { id: 'internet', name: 'Internet', icon: 'wifi', color: '#00CEC9', type: 'expense', isDefault: true },

  // Despesas - Saúde
  { id: 'pharmacy', name: 'Farmácia', icon: 'medkit', color: '#E17055', type: 'expense', isDefault: true },
  { id: 'doctor', name: 'Médico', icon: 'medkit', color: '#FD79A8', type: 'expense', isDefault: true },
  { id: 'health_plan', name: 'Plano de saúde', icon: 'fitness', color: '#00B894', type: 'expense', isDefault: true },

  // Despesas - Educação
  { id: 'school', name: 'Escola', icon: 'school', color: '#6C5CE7', type: 'expense', isDefault: true },
  { id: 'course', name: 'Curso', icon: 'book', color: '#A29BFE', type: 'expense', isDefault: true },
  { id: 'books', name: 'Livros', icon: 'book', color: '#0984E3', type: 'expense', isDefault: true },

  // Despesas - Lazer
  { id: 'streaming', name: 'Streaming', icon: 'play', color: '#E84393', type: 'expense', isDefault: true },
  { id: 'gym', name: 'Academia', icon: 'fitness', color: '#00B894', type: 'expense', isDefault: true },
  { id: 'travel', name: 'Viagem', icon: 'airplane', color: '#0984E3', type: 'expense', isDefault: true },

  // Despesas - Compras
  { id: 'clothing', name: 'Roupas', icon: 'shirt', color: '#E84393', type: 'expense', isDefault: true },
  { id: 'electronics', name: 'Eletrônicos', icon: 'hardware-chip', color: '#6C5CE7', type: 'expense', isDefault: true },
  { id: 'gift_expense', name: 'Presentes', icon: 'gift', color: '#FD79A8', type: 'expense', isDefault: true },

  // Despesas - Contas
  { id: 'bill_other', name: 'Outras contas', icon: 'document-text', color: '#FF7675', type: 'expense', isDefault: true },
  { id: 'tax', name: 'Impostos', icon: 'receipt', color: '#D63031', type: 'expense', isDefault: true },
  { id: 'insurance', name: 'Seguro', icon: 'shield-checkmark', color: '#74B9FF', type: 'expense', isDefault: true },

  // Outros
  { id: 'other_expense', name: 'Outros', icon: 'more-horizontal', color: '#636E72', type: 'expense', isDefault: true },
];

const KEYWORD_CATEGORY_MAP: Record<string, string> = {
  // Alimentação
  'supermercado': 'supermarket',
  'mercado': 'supermarket',
  'hiper': 'supermercado',
  'atacad': 'supermercado',
  'restaurante': 'restaurant',
  'lanchonet': 'restaurant',
  'bar ': 'restaurant',
  'pizzaria': 'restaurant',
  'hamburguer': 'restaurant',
  'ifood': 'delivery',
  'rappi': 'delivery',
  'uber eats': 'delivery',
  'starbucks': 'coffee',
  'café': 'coffee',
  'padaria': 'coffee',

  // Transporte
  'uber': 'uber',
  '99 ': 'uber',
  'taxi': 'uber',
  'combustivel': 'fuel',
  'posto': 'fuel',
  'shell': 'fuel',
  'petrobras': 'fuel',
  'alcool': 'fuel',
  'gasolina': 'fuel',
  'estacionamento': 'parking',
  'zona azul': 'parking',
  'onibus': 'public_transport',
  'metro': 'public_transport',
  'bilhete': 'public_transport',

  // Moradia
  'aluguel': 'rent',
  'condominio': 'condo',
  'energia': 'electricity',
  'cedae': 'water',
  'sabesp': 'water',
  'netflix': 'streaming',
  'spotify': 'streaming',
  'globoplay': 'streaming',
  'amazon prime': 'streaming',
  'disney': 'streaming',
  'internet': 'internet',
  'vivo': 'internet',
  'claro': 'internet',
  'oi ': 'internet',
  'tim ': 'internet',

  // Saúde
  'farmacia': 'pharmacy',
  'drogasil': 'pharmacy',
  'drogaraia': 'pharmacy',
  'panvel': 'pharmacy',
  'medico': 'doctor',
  'hospital': 'doctor',
  'clinica': 'doctor',
  'consultorio': 'doctor',
  'plano saude': 'health_plan',
  'unimed': 'health_plan',
  'sulamerica': 'health_plan',

  // Educação
  'escola': 'school',
  'faculdade': 'school',
  'universidade': 'school',
  'curso': 'course',
  'udemy': 'course',
  'alura': 'course',
  'livraria': 'books',
  'amazon livros': 'books',

  // Lazer
  'academia': 'gym',
  'smart fit': 'gym',
  'bio ritmo': 'gym',
  'cinema': 'travel',
  'ingresso': 'travel',
  'viagem': 'travel',
  'hotel': 'travel',
  'passagem': 'travel',
  'airbnb': 'travel',
  'decathlon': 'gym',

  // Compras
  'zara': 'clothing',
  'h&m': 'clothing',
  'renner': 'clothing',
  'centauro': 'clothing',
  'magalu': 'electronics',
  'americanas': 'electronics',
  'casas bahia': 'electronics',
  'shopee': 'clothing',
  'mercado livre': 'electronics',
  'amazon': 'electronics',

  // Contas
  'iptu': 'tax',
  'ipva': 'tax',
  'imposto': 'tax',
  'seguro': 'insurance',
  'porto seguro': 'insurance',
  'bradesco seguros': 'insurance',

  // Salário/Receita
  'salario': 'salary',
  'folha pagamento': 'salary',
  'transferencia recebida': 'salary',
  'pix recebido': 'salary',
  'freelance': 'freelance',
  'rendimento': 'investment_income',
  'dividendo': 'investment_income',
};

export function detectCategoryFromText(text: string): string {
  const lowerText = text.toLowerCase();

  for (const [keyword, categoryId] of Object.entries(KEYWORD_CATEGORY_MAP)) {
    if (lowerText.includes(keyword)) {
      return categoryId;
    }
  }

  return 'other_expense';
}

export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoriesByType(type: 'income' | 'expense'): Category[] {
  return DEFAULT_CATEGORIES.filter((cat) => cat.type === type);
}

export function searchCategories(query: string): Category[] {
  const lowerQuery = query.toLowerCase();
  return DEFAULT_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(lowerQuery) ||
      cat.id.toLowerCase().includes(lowerQuery)
  );
}
