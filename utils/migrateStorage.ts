import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Migration one-time : Supprime les anciennes données AsyncStorage
 * À appeler au lancement de l'app après le login
 */
export async function clearLegacyStorage() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const gameKeys = keys.filter(k => k.includes('game-store'));
    
    if (gameKeys.length > 0) {
      await AsyncStorage.multiRemove(gameKeys);
      console.log(`🧹 Cleared ${gameKeys.length} legacy storage keys`);
    }
  } catch (error) {
    console.error('❌ Failed to clear legacy storage:', error);
  }
}
