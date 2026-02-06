import { TierType } from "@/constants/tierConfig";
import { UnlockCondition } from './unlockConditions';

// ==========================================
// 🆕 NOUVEAUX TYPES POUR UPGRADES HYBRIDES
// ==========================================

export type ScalingType = 
  | 'reputation' 
  | 'businesses_owned' 
  | 'total_income';

// ==========================================
// CLICK UPGRADES
// ==========================================

export interface ClickUpgradeState {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  // 🔧 MODIFIÉ : Ajout des nouveaux types d'effets
  effectType: 
    | 'base_money' 
    | 'crit_chance' 
    | 'crit_multiplier'
    | 'business_synergy'  // 🆕 Synergie avec businesses possédés
    | 'passive_boost'     // 🆕 Boost basé sur revenu passif
    | 'scaling';          // 🆕 Scaling dynamique
  
  effectValue: number;
  tier: TierType;
  purchased: boolean;
  
  // 🆕 PROPRIÉTÉS POUR LES UPGRADES DYNAMIQUES
  scalingType?: ScalingType;     // Comment l'upgrade scale (optionnel)
  scalingFactor?: number;         // Multiplicateur du scaling (optionnel)
  unlockConditions?: UnlockCondition[];
  showWhenLocked?: boolean;
}

// ==========================================
// STOCKS
// ==========================================

export interface Stock {
  quantity: number;
  buyPrice: number;
}

// ==========================================
// BUSINESSES
// ==========================================

export interface Business {
  level: number;
  income: number;
  quantity: number;
  owned: boolean;
}

// ==========================================
// UPGRADES (Business upgrades)
// ==========================================

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  multiplier: number; // ex: 1.2 = +20%
  affectedBusinesses: string[]; // IDs des businesses concernées
  purchased: boolean; // Si déjà acheté
  tier: TierType;
  unlockConditions?: UnlockCondition[];
  showWhenLocked?: boolean; // true = afficher "???", false = masquer complètement
}

// ==========================================
// STATS
// ==========================================

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

// ==========================================
// ACHIEVEMENTS
// ==========================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji ou nom d'icône
  condition: (state: GameState) => boolean; // La fonction magique
  rewards: {
    reputation?: number;
    xp?: number;
    money?: number; // Au cas où tu veux donner du cash aussi
  };
}

// ==========================================
// SYSTÈME DE COMBOS
// ==========================================

export interface ActiveBonus {
  id: string;
  type: 'COMBO_MULTIPLIER' | 'FRENZY_MODE' | 'PERFECT_CLICK';
  multiplier: number;
  expiresAt: number; // Timestamp en millisecondes
  label: string; // Pour l'affichage UI
}

export interface ComboState {
  currentStreak: number; // Nombre de clics consécutifs
  lastClickTimestamp: number; // Timestamp du dernier clic
  activeBonuses: ActiveBonus[]; // Bonus actifs (x1.5, Frenzy, etc.)
  perfectClickWindowActive: boolean; // Fenêtre Perfect Click ouverte
  perfectClickWindowStart: number; // Début de la fenêtre (timestamp)
}

// ==========================================
// GAME STATE (global)
// ==========================================

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
  combo?: { currentStreak: number };
}
