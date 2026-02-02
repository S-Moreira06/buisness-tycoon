import { TierType } from "@/constants/tierConfig";

export interface ClickUpgradeState {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  effectType: 'base_money' | 'crit_chance' | 'crit_multiplier';
  effectValue: number;
  tier: TierType;
  purchased: boolean;
}

export interface Stock {
  quantity: number;
  buyPrice: number;
}

export interface Business {
  level: number;
  income: number;
  quantity: number;
  owned: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  multiplier: number;  // ex: 1.2 = +20%
  affectedBusinesses: string[];  // IDs des businesses concernées
  purchased: boolean;  // Si déjà acheté
  tier: TierType,
}

export interface GameStats {
  // Clics
  totalClicks: number;
  totalCriticalClicks: number;
  
  // Économie
  totalMoneyEarned: number; // Cumulatif (ne baisse jamais)
  totalMoneySpent: number;
  maxMoneyReached: number; // Le record de solde max
  
  // Progression
  totalPlayTime: number; // En secondes (à implémenter plus tard avec un timer)
  businessesBought: number; // Quantité totale de business achetés (via $)
  upgradesPurchased: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji ou nom d'icône
  condition: (state: GameState) => boolean; // La fonction magique
}

export interface GameState {
  playerName: string; 
  profileEmoji: string; 
  money: number;
  reputation: number;
  totalPassiveIncome: number;
  playerLevel: number; 
  experience: number;
  ownedStocks: Record<string, Stock>;
  businesses: Record<string, Business>;
  upgrades: Record<string, Upgrade>;
  clickUpgrades: Record<string, ClickUpgradeState>;
  stats: GameStats;
  unlockedAchievements: string[];
  settings: {
    hapticsEnabled: boolean;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
}
