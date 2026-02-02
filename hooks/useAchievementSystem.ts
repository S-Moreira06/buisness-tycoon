import { ACHIEVEMENTS } from '@/constants/achievementsConfig';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message'; // ✅ Import direct
import { useGameStore } from './useGameStore';

export const useAchievementSystem = () => {
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);

  useEffect(() => {
    const checkAchievements = (state: any) => {
      // Optimisation : On ne vérifie que ceux verrouillés
      const lockedAchievements = ACHIEVEMENTS.filter(
        (ach) => !state.unlockedAchievements.includes(ach.id)
      );

      if (lockedAchievements.length === 0) return;

      lockedAchievements.forEach((achievement) => {
        try {
          if (achievement.condition(state)) {
            // 1. Débloquer dans le store
            unlockAchievement(achievement.id);
            
            // 2. Afficher le Toast (La librairie gère la file d'attente automatiquement)
            Toast.show({
              type: 'achievement', // Correspond à ta clé dans toastConfig
              text1: 'Succès Débloqué !',
              text2: achievement.title,
              props: { icon: achievement.icon }, // On passe l'icône en prop
              visibilityTime: 4000,
            });
          }
        } catch (error) {
          console.error(`Erreur succès ${achievement.id}`, error);
        }
      });
    };

    // Check initial + Abonnement
    checkAchievements(useGameStore.getState());
    const unsubscribe = useGameStore.subscribe(checkAchievements);

    return () => unsubscribe();
  }, [unlockAchievement]); // Ajout de dépendance propre
};
