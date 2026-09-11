export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos 1 letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos 1 letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos 1 número');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAmount(value: string): boolean {
  const cleaned = value.replace(/[^\d.,]/g, '');
  const num = parseFloat(cleaned.replace(',', '.'));
  return !isNaN(num) && num > 0;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validatePhone(phone: string): boolean {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(phone.replace(/[\s()-]/g, ''));
}
