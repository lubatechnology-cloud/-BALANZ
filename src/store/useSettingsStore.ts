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
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleBiometric: () => void;
  toggleNotifications: () => void;
  toggleSmsCapture: () => void;
  toggleEmailCapture: () => void;
  toggleVoiceCapture: () => void;
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
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  toggleBiometric: () => set((s) => ({ biometricEnabled: !s.biometricEnabled })),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
  toggleSmsCapture: () => set((s) => ({ smsCaptureEnabled: !s.smsCaptureEnabled })),
  toggleEmailCapture: () => set((s) => ({ emailCaptureEnabled: !s.emailCaptureEnabled })),
  toggleVoiceCapture: () => set((s) => ({ voiceCaptureEnabled: !s.voiceCaptureEnabled })),
  setMonthlyBudget: (monthlyBudget) => set({ monthlyBudget }),
}));
