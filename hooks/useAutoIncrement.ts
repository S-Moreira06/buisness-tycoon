import { GAME_CONFIG } from '@/constants/gameConfig';
import { useEffect } from 'react';
import { useGameStore } from './useGameStore';

export const useAutoIncrement = () => {
  const { addPassiveIncome, totalPassiveIncome } = useGameStore();

  useEffect(() => {
    if (totalPassiveIncome === 0) return;

    // Appelle addPassiveIncome toutes les x milisecondes
    const interval = setInterval(() => {
      addPassiveIncome();
    }, GAME_CONFIG.AUTO_INCREMENT_INTERVAL);

    return () => clearInterval(interval);
  }, [totalPassiveIncome, addPassiveIncome]);
};
