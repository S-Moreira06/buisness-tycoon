import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ==========================================
// TYPES
// ==========================================

interface Settings {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

interface SettingsActions {
  toggleHaptics: () => void;
  toggleSound: () => void;
  toggleNotifications: () => void;
  setHaptics: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}

type SettingsStore = Settings & SettingsActions;

// ==========================================
// VALEURS PAR DÉFAUT
// ==========================================

const defaultSettings: Settings = {
  hapticsEnabled: true,
  soundEnabled: true,
  notificationsEnabled: true,
};

// ==========================================
// STORE
// ==========================================

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      // Toggle functions
      toggleHaptics: () => 
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      
      toggleSound: () => 
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      toggleNotifications: () => 
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      // Setter functions (au cas où tu veux forcer une valeur)
      setHaptics: (enabled) => set({ hapticsEnabled: enabled }),
      setSound: (enabled) => set({ soundEnabled: enabled }),
      setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'settings-store', // Clé AsyncStorage différente
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
