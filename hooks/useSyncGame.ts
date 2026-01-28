import { useEffect, useRef } from 'react';
import { loadGame, saveGame } from '../services/gameSync';
import { useAuth } from './useAuth';
import { useGameStore } from './useGameStore';

export function useSyncGame() {
  const { user } = useAuth();
  const gameState = useGameStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

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
      saveGame(user.uid, {
        money: gameState.money,
        reputation: gameState.reputation,
        totalPassiveIncome: gameState.totalPassiveIncome,
        ownedStocks: gameState.ownedStocks,
        businesses: gameState.businesses,
      });
    }, 900);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    user,
    gameState.money,
    gameState.reputation,
    gameState.totalPassiveIncome,
    gameState.ownedStocks,
    gameState.businesses,
  ]);
}
