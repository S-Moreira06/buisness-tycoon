import { GAME_CONFIG } from '@/constants/gameConfig';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { loadGame, saveGame } from '../services/gameSync';
import { useAuth } from './useAuth';
import { useGameStore } from './useGameStore';

export function useSyncGame() {
  const { user } = useAuth();
  const lastSaveRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // 🔥 Load initial du serveur au premier render
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const remote = await loadGame(user.uid);
        if (remote) {
          // 🔥 Accède directement au store sans hook
          useGameStore.getState().hydrateFromServer(remote);
          lastSaveRef.current = JSON.stringify(remote);
          console.log('✅ Game loaded from server');
        }
      } catch (error) {
        console.error('❌ Failed to load game:', error);
      }
    })();
  }, [user]);

  // 🔥 Auto-save périodique (toutes les X secondes)
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(async () => {
      // 🔥 CRUCIAL : Récupère le state FRAIS à chaque tick
      const gameState = useGameStore.getState();

      const currentStateString = JSON.stringify({
        playerName: gameState.playerName,
        profileEmoji: gameState.profileEmoji,
        money: gameState.money,
        reputation: gameState.reputation,
        businesses: gameState.businesses,
        upgrades: gameState.upgrades,
        clickUpgrades: gameState.clickUpgrades,
        stats: gameState.stats,
        unlockedAchievements: gameState.unlockedAchievements,
        settings: gameState.settings,
      });

      if (currentStateString !== lastSaveRef.current && !isSavingRef.current) {
        isSavingRef.current = true;
        try {
          await saveGame(user.uid, gameState);
          lastSaveRef.current = currentStateString;
          console.log('💾 Auto-save completed');
        } catch (error) {
          console.error('❌ Auto-save failed:', error);
        } finally {
          isSavingRef.current = false;
        }
      }
    }, GAME_CONFIG.SAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [user]); // ⚠️ PAS gameState en dépendance !

  // 🔥 Save quand l'app passe en background
  useEffect(() => {
    if (!user) return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        if (!isSavingRef.current) {
          isSavingRef.current = true;
          try {
            // 🔥 CRUCIAL : Récupère le state FRAIS
            const gameState = useGameStore.getState();
            await saveGame(user.uid, gameState);
            console.log('💾 Save on app background');
          } catch (error) {
            console.error('❌ Save on background failed:', error);
          } finally {
            isSavingRef.current = false;
          }
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [user]); // ⚠️ PAS gameState en dépendance !
}
