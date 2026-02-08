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
      totalPassiveIncome: state.totalPassiveIncome,
      reputation: state.reputation,
      experience: state.experience,
      playerLevel: state.playerLevel, 
      businesses: state.businesses,
      upgrades: state.upgrades,
      clickUpgrades: state.clickUpgrades,
      stats: state.stats,
      unlockedAchievements: state.unlockedAchievements || [],
      jobs: state.jobs,
      lastSavedAt: serverTimestamp(),
    };
    
    await set(gameRef, dataToSave);
    // console.log('✅ Game saved');
  } catch (error) {
    console.error('❌ Save failed:', error);
    throw error; // Propager l'erreur pour le retry
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
