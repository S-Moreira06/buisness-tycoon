// hooks/useAchievementSystem.ts
import { ACHIEVEMENTS } from '@/constants/achievementsConfig';
import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { useGameStore } from './useGameStore';
import { useSyncGame } from './useSyncGame';

export const useAchievementSystem = () => {
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);
  const { isHydrated } = useSyncGame();
  const notifiedAchievements = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isHydrated) {
      console.log('⏳ Waiting for Firebase hydration...');
      return;
    }
    const checkAchievements = (state: any) => {
      const lockedAchievements = ACHIEVEMENTS.filter(
        (ach) => !state.unlockedAchievements.includes(ach.id)
      );

      if (lockedAchievements.length === 0) return;

      // ✅ NOUVEAU : On accumule les succès débloqués dans cette vérification
      const unlockedNow: typeof ACHIEVEMENTS = [];

      lockedAchievements.forEach((achievement) => {
        try {
          if (achievement.condition(state)) {
            unlockAchievement(achievement.id, achievement.rewards);
            unlockedNow.push(achievement);
          }
        } catch (error) {
          console.error(`Erreur succès ${achievement.id}`, error);
        }
      });

      // ✅ Si plusieurs succès débloqués, on les affiche groupés
      if (unlockedNow.length > 0) {
        showAchievementToast(unlockedNow);
      }
    };

    checkAchievements(useGameStore.getState());
    const unsubscribe = useGameStore.subscribe(checkAchievements);

    return () => unsubscribe();
  }, [unlockAchievement, isHydrated]);
};

// ✅ NOUVELLE FONCTION : Affichage intelligent (1 ou plusieurs)
function showAchievementToast(achievements: typeof ACHIEVEMENTS) {
  if (achievements.length === 1) {
    // UN SEUL SUCCÈS : Toast classique
    const ach = achievements[0];
    const rewardText = [
      ach.rewards.xp ? `+${ach.rewards.xp} XP` : null,
      ach.rewards.reputation ? `+${ach.rewards.reputation} Rep` : null,
      ach.rewards.money ? `+${ach.rewards.money}$` : null,
    ].filter(Boolean).join('  •  ');

    Toast.show({
      type: 'achievement',
      text1: `Succès Débloqué:\n${ach.title} !`,
      text2: `${ach.description}\n${rewardText}`,
      props: { icon: ach.icon },
      visibilityTime: 5000,
    });
  } else {
    // PLUSIEURS SUCCÈS : Toast groupé
    const icons = achievements.map(a => a.icon).join(' ');
    const titles = achievements.map(a => `• ${a.title}`).join('\n');
    
    // Calcul des récompenses totales
    const totalXp = achievements.reduce((sum, a) => sum + (a.rewards.xp || 0), 0);
    const totalRep = achievements.reduce((sum, a) => sum + (a.rewards.reputation || 0), 0);
    const totalMoney = achievements.reduce((sum, a) => sum + (a.rewards.money || 0), 0);

    const totalRewards = [
      totalXp ? `+${totalXp} XP` : null,
      totalRep ? `+${totalRep} Rep` : null,
      totalMoney ? `+${totalMoney}$` : null,
    ].filter(Boolean).join('  •  ');

    Toast.show({
      type: 'achievement',
      text1: `${achievements.length} Succès Débloqués ! ${icons}`,
      text2: `${titles}\n\n${totalRewards}`,
      props: { icon: '🎉' },
      visibilityTime: 7000, // Plus long car plus d'infos
    });
  }
}
