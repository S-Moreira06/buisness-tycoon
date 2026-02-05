import { get, ref, serverTimestamp, set } from 'firebase/database';
import { GameState } from '../types/game';
import { database } from './firebaseConfig';

export async function saveGame(uid: string, state: GameState) {
  try {
    const gameRef = ref(database, `games/${uid}`);
    
    // 👇 SAUVEGARDE SEULEMENT LES DONNÉES (pas les fonctions)
    const dataToSave = {
      playerName: state.playerName, 
      profileEmoji: state.profileEmoji,
      money: state.money,
      passiveIncome: state.totalPassiveIncome,
      reputation: state.reputation,
      businesses: state.businesses,
      upgrades: state.upgrades,
      stats: state.stats,
      unlockedAchievements: state.unlockedAchievements || [],
      lastSavedAt: serverTimestamp(),
    };
    
    await set(gameRef, dataToSave);
    // console.log('✅ Game saved');
  } catch (error) {
    console.error('❌ Save failed:', error);
  }
}

export async function loadGame(uid: string): Promise<Partial<GameState> | null> {
  try {
    const gameRef = ref(database, `games/${uid}`);
    const snapshot = await get(gameRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No save found');
      return null;
    }
    
    console.log('✅ Game loaded');
    return snapshot.val();
  } catch (error) {
    console.error('❌ Load failed:', error);
    return null;
  }
}
