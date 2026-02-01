import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native'; // 👈 Import Vibration
import { useGameStore } from './useGameStore';

export const useHaptics = () => {
  const isHapticsEnabled = useGameStore((s) => s.settings?.hapticsEnabled ?? true);

  const triggerLight = async () => {
    if (isHapticsEnabled) {
      // Clic normal : sec et précis
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const triggerMedium = async () => {
    if (isHapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // 👇 LA VERSION "BOURRIN"
  const triggerHeavy = async () => {
    if (isHapticsEnabled) {
      if (Platform.OS === 'android') {
        // Sur Android, on peut contrôler la durée exacte en ms.
        // 150ms c'est LOURD (vs 10ms pour un haptic normal).
        Vibration.vibrate(150); 
      } else {
        // Sur iOS, on ne peut pas choisir la durée exacte de Vibration.vibrate().
        // L'astuce pour avoir un effet "long" est d'utiliser le type "Error"
        // qui fait une série de 3-4 percussions très rapprochées (Vrrr-vrrr-vrrr).
        // C'est le retour haptique le plus long disponible sur iPhone.
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const triggerSuccess = async () => {
    if (isHapticsEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const triggerError = async () => {
    if (isHapticsEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerError
  };
};
