import { create } from 'zustand';

interface SettingsState {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  smsCaptureEnabled: boolean;
  emailCaptureEnabled: boolean;
  voiceCaptureEnabled: boolean;
  monthlyBudget: number | null;
  setCurrency: (currency: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleBiometric: () => void;
  toggleNotifications: () => void;
  toggleSmsCapture: () => void;
  toggleEmailCapture: () => void;
  setMonthlyBudget: (budget: number | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  currency: 'BRL',
  language: 'pt-BR',
  theme: 'dark',
  biometricEnabled: false,
  notificationsEnabled: true,
  smsCaptureEnabled: false,
  emailCaptureEnabled: false,
  voiceCaptureEnabled: true,
  monthlyBudget: null,

  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),
  toggleBiometric: () => set((s) => ({ biometricEnabled: !s.biometricEnabled })),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
  toggleSmsCapture: () => set((s) => ({ smsCaptureEnabled: !s.smsCaptureEnabled })),
  toggleEmailCapture: () => set((s) => ({ emailCaptureEnabled: !s.emailCaptureEnabled })),
  setMonthlyBudget: (monthlyBudget) => set({ monthlyBudget }),
}));
