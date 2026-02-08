import { GAME_CONFIG } from '@/constants/gameConfig';
import { clearLegacyStorage } from '@/utils/migrateStorage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { loadGame, saveGame } from '../services/gameSync';
import { useAuth } from './useAuth';
import { useGameStore } from './useGameStore';

// 🆕 Configuration du retry
const RETRY_CONFIG = {
  maxAttempts: 3,
  delayMs: 1000,
};

export function useSyncGame() {
  const { user } = useAuth();
  const lastSaveRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);
  const [isHydrated, setIsHydrated] = useState(false); // ✅ Déjà présent
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🆕 Fonction de sauvegarde avec retry
  const saveWithRetry = useCallback(async (uid: string, attempt = 1) => {
    try {
      const gameState = useGameStore.getState();
      await saveGame(uid, gameState);
      
      lastSaveRef.current = JSON.stringify({
        money: gameState.money,
        reputation: gameState.reputation,
        businesses: gameState.businesses,
      });
      
      console.log(`💾 Save successful (attempt ${attempt})`);
      return true;
    } catch (error) {
      console.error(`❌ Save failed (attempt ${attempt}):`, error);
      
      if (attempt < RETRY_CONFIG.maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delayMs * attempt));
        return saveWithRetry(uid, attempt + 1);
      }
      
      return false;
    }
  }, []);

  // 🔥 Load initial du serveur
  useEffect(() => {
    if (!user) {
      setIsHydrated(false); // ✅ Reset si déconnexion
      return;
    }

    (async () => {
      try {
        const remote = await loadGame(user.uid);
        if (remote) {
          useGameStore.getState().hydrateFromServer(remote);
          lastSaveRef.current = JSON.stringify(remote);
          console.log('✅ Game loaded from server');
          
          // 🆕 Nettoyage one-time
          await clearLegacyStorage();
        }
        
        // ✅ IMPORTANT : Marquer comme hydraté (même si remote === null)
        setIsHydrated(true);
      } catch (error) {
        console.error('❌ Failed to load game:', error);
        setIsHydrated(true); // ✅ Marquer quand même pour éviter le blocage
      }
    })();
  }, [user]);

  // 🆕 Auto-save avec debouncing (toutes les X secondes SI changements)
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(async () => {
      const gameState = useGameStore.getState();

      const currentStateString = JSON.stringify({
        money: gameState.money,
        reputation: gameState.reputation,
        businesses: gameState.businesses,
        upgrades: gameState.upgrades,
        clickUpgrades: gameState.clickUpgrades,
        stats: gameState.stats,
        unlockedAchievements: gameState.unlockedAchievements,
        jobs: gameState.jobs,
      });

      if (currentStateString !== lastSaveRef.current && !isSavingRef.current) {
        isSavingRef.current = true;
        await saveWithRetry(user.uid);
        isSavingRef.current = false;
      }
    }, GAME_CONFIG.SAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [user, saveWithRetry]);

  // 🔥 Save quand l'app passe en background (avec retry)
  useEffect(() => {
    if (!user) return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        if (!isSavingRef.current) {
          isSavingRef.current = true;
          await saveWithRetry(user.uid);
          isSavingRef.current = false;
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [user, saveWithRetry]);

  // ✅ MODIFIÉ : Retourner isHydrated + forceSave
  return {
    isHydrated, // ✅ AJOUT
    forceSave: useCallback(async () => {
      if (!user) return false;
      if (isSavingRef.current) return false;
      
      isSavingRef.current = true;
      const success = await saveWithRetry(user.uid);
      isSavingRef.current = false;
      
      return success;
    }, [user, saveWithRetry]),
  };
}
