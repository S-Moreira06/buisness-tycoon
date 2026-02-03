import { useGameStore } from '@/hooks/useGameStore';
import { useEffect } from 'react';
import { AppState } from 'react-native';

export const GameTimer = () => {
  const tickPlayTime = useGameStore((state) => state.tickPlayTime);

  useEffect(() => {
    // On lance un timer qui s'exécute chaque seconde
    const interval = setInterval(() => {
      // On vérifie si l'app est active (au premier plan)
      if (AppState.currentState === 'active') {
        tickPlayTime();
      }
    }, 1000);

    // Nettoyage quand le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return null; // Ce composant ne rend rien visuellement
};
