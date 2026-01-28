import { get, ref, set } from 'firebase/database';
import { GameState } from '../types/game';
import { database } from './firebaseConfig';

export async function saveGame(uid: string, state: GameState) {
  try {
    const gameRef = ref(database, `games/${uid}`);
    await set(gameRef, state);
    // console.log('✅ Game saved');
  } catch (error) {
    console.error('❌ Save failed:', error);
  }
}

export async function loadGame(uid: string): Promise<GameState | null> {
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
