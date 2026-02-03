// services/leaderboard.ts
import { get, limitToLast, orderByChild, query, ref } from 'firebase/database';
import { database } from './firebaseConfig';

export interface LeaderboardEntry {
  uid: string;
  value: number; // Valeur générique (peut être money, maxMoney, etc.)
  money: number;
  playerName: string;
  profileEmoji: string;
}

// Enum pour les types de classement
export type LeaderboardSortType = 'currentMoney' | 'maxMoney' | 'totalMoney';

export async function getLeaderboard(limit = 10, sortBy: LeaderboardSortType = 'maxMoney'): Promise<LeaderboardEntry[]> {
  try {
    const gamesRef = ref(database, 'games');
    
    // Détermination de la clé de tri Firebase
    let orderByPath = 'stats/maxMoneyReached'; // Par défaut : Fortune Max

    if (sortBy === 'currentMoney') {
        orderByPath = 'money';
    } else if (sortBy === 'totalMoney') {
        orderByPath = 'stats/totalMoneyEarned';
    }

    // On demande à Firebase de trier par la clé choisie
    const topQuery = query(gamesRef, orderByChild(orderByPath), limitToLast(limit));
    const snapshot = await get(topQuery);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();

    // Transformation : Object -> Array
    const entries: LeaderboardEntry[] = Object.entries(data).map(([uid, val]: [string, any]) => {
        // On récupère la bonne valeur selon le tri pour l'afficher
        let displayValue = 0;
        
        if (sortBy === 'currentMoney') {
            displayValue = Number(val.money) || 0;
        } else if (sortBy === 'maxMoney') {
            displayValue = Number(val.stats?.maxMoneyReached) || 0;
        } else if (sortBy === 'totalMoney') {
            displayValue = Number(val.stats?.totalMoneyEarned) || 0;
        }

        return {
            uid,
            value: displayValue,
            playerName: val.playerName || `Joueur ${uid.slice(0,4)}`,
            profileEmoji: val.profileEmoji || '👤',
        };
    });

    // Tri Client : Descendant (Le plus grand en haut)
    return entries.sort((a, b) => b.value - a.value);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
