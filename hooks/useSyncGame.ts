import { GAME_CONFIG } from '@/constants/gameConfig';
import { useEffect, useRef } from 'react';
import { loadGame, saveGame } from '../services/gameSync';
import { useAuth } from './useAuth';
import { useGameStore } from './useGameStore';

export function useSyncGame() {
  const { user } = useAuth();
  const gameState = useGameStore();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load du serveur au premier render
  useEffect(() => {
    if (!user) return;

    (async () => {
      const remote = await loadGame(user.uid);
      if (remote) {
        gameState.hydrateFromServer(remote);
      }
    })();
  }, [user]);

  // Save au serveur quand le state change
  useEffect(() => {
    if (!user) return;

    // Debounce : attends 1 seconde avant de sauver (évite trop d'appels)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveGame(user.uid, gameState);
    }, GAME_CONFIG.SAVE_DEBOUNCE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    user,
    gameState.unlockedAchievements,
    gameState.stats, 
    gameState.money,
    gameState.reputation,
    gameState.totalPassiveIncome,
    gameState.playerLevel,
    gameState.experience,
    gameState.ownedStocks,
    gameState.businesses,
    gameState.upgrades,
  ]);
}
