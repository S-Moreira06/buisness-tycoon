import { useGameStore } from '@/hooks/useGameStore';
import { useEffect, useRef } from 'react';

/**
 * Hook qui détecte les changements de niveau et distribue les récompenses
 * À utiliser dans un composant racine (App.tsx ou _layout.tsx)
 */
export const useLevelUpTracker = () => {
  const playerLevel = useGameStore((state) => state.playerLevel);
  const addLevelUpReward = useGameStore((state) => state.addLevelUpReward);
  
  // Stocke le niveau précédent
  const previousLevel = useRef(playerLevel);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Ignore le premier render (hydratation initiale)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousLevel.current = playerLevel;
      return;
    }

    // Détection du level up
    if (playerLevel > previousLevel.current) {
      // Si multi-level up (ex: niveau 1 → 5), on donne les récompenses pour chaque niveau
      for (let lvl = previousLevel.current + 1; lvl <= playerLevel; lvl++) {
        addLevelUpReward(lvl);
      }
    }

    // Mise à jour du niveau précédent
    previousLevel.current = playerLevel;
  }, [playerLevel, addLevelUpReward]);
};
