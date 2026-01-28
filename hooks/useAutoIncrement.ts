import { useEffect } from 'react';
import { useGameStore } from './useGameStore';

export const useAutoIncrement = () => {
  const { addPassiveIncome, totalPassiveIncome } = useGameStore();

  useEffect(() => {
    if (totalPassiveIncome === 0) return;

    // Appelle addPassiveIncome toutes les secondes
    const interval = setInterval(() => {
      addPassiveIncome();
    }, 1000);

    return () => clearInterval(interval);
  }, [totalPassiveIncome, addPassiveIncome]);
};
