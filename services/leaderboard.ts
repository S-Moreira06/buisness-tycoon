// services/leaderboard.ts
import { get, limitToLast, orderByChild, query, ref } from 'firebase/database';
import { database } from './firebaseConfig';

export interface LeaderboardEntry {
  uid: string; // On utilise l'UID comme demandé
  money: number;
  playerName: string;
  profileEmoji: any;

}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  try {
    const gamesRef = ref(database, 'games');
    // On demande à Firebase de trier par argent et de prendre les X derniers (les plus riches)
    const topQuery = query(gamesRef, orderByChild('money'), limitToLast(limit));
    
    const snapshot = await get(topQuery);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    
    // Transformation : Object -> Array
    const entries: LeaderboardEntry[] = Object.entries(data).map(([uid, val]: [string, any]) => ({
      uid, 
      money: typeof val.money === 'number' ? val.money : 0,
      playerName: val.playerName || null, 
      profileEmoji: val.profileEmoji || null,
    }));

    // Tri Client : Descendant (Le plus riche en haut)
    // Firebase limitToLast renvoie les "plus grands", mais l'ordre des clés JS n'est pas garanti
    return entries.sort((a, b) => b.money - a.money);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return []; // Fail safe: tableau vide plutôt que crash
  }
}
