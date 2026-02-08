import { TierType } from "@/constants/tierConfig";
import { JobState } from "./job";
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
  isUnlocked?: boolean;
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
  isUnlocked?: boolean;
  showWhenLocked?: boolean; // true = afficher "???", false = masquer complètement
}

// ==========================================
// STATS - VERSION 2.0 (Approche Hybride)
// ==========================================

export interface GameStats {
  // ========== ACTIVITÉ (Données Brutes) ==========
  totalClicks: number;
  totalCriticalClicks: number;
  totalPlayTime: number; // En secondes
  sessionsPlayed: number; // 🆕
  longestSession: number; // 🆕 En secondes
  currentSessionStart: number; // 🆕 Timestamp pour calcul session active
  lastLoginDate: string; // 🆕 Format ISO
  daysPlayedStreak: number; // 🆕
  
  // ========== ÉCONOMIE (Données Brutes) ==========
  totalMoneyEarned: number; // Cumulatif total
  totalMoneySpent: number;
  maxMoneyReached: number; // Record
  moneyFromClicks: number; // 🆕 Argent gagné via clics manuels
  moneyFromPassive: number; // 🆕 Argent gagné via businesses
  moneyFromAchievements: number; // 🆕 Argent gagné via récompenses
  
  // ========== RÉPUTATION (Données Brutes) ==========
  totalReputationEarned: number; // 🆕 Ne baisse jamais
  totalReputationSpent: number; // 🆕
  maxReputationReached: number; // 🆕
  
  // ========== REVENU PASSIF (Données Brutes) ==========
  bestPassiveIncomeReached: number; // 🆕 Plus haut revenu/sec atteint
  
  // ========== PROGRESSION (Données Brutes) ==========
  businessesBought: number; // Quantité totale achetée
  uniqueBusinessesOwned: number; // 🆕 Nombre de types différents
  totalBusinessLevels: number; // 🆕 Somme des niveaux
  upgradesPurchased: number; // Total (click + business)
  clickUpgradesPurchased: number; // 🆕 Séparation
  businessUpgradesPurchased: number; // 🆕 Séparation
  
  // ========== ACHIEVEMENTS (Données Brutes) ==========
  achievementsUnlocked: number; // 🆕 Nombre de succès débloqués
  
  // ========== MILESTONES (Timestamps) ==========
  firstBusinessPurchaseTime: number; // 🆕 Timestamp
  firstUpgradePurchaseTime: number; // 🆕 Timestamp
  firstAchievementUnlockTime: number; // 🆕 Timestamp
  
  // ========== SYSTÈME (Données Brutes) ==========
  totalResets: number; // 🆕 Nombre de resets
}

// ==========================================
// STATS CALCULÉES (Non stockées)
// ==========================================
// Ces stats sont calculées à la volée via useComputedStats()
export interface ComputedStats {
  // Performance
  criticalHitRate: number; // % (totalCriticalClicks / totalClicks * 100)
  averageMoneyPerClick: number; // $ (moneyFromClicks / totalClicks)
  clicksPerMinute: number; // clics/min (totalClicks / totalPlayTime * 60)
  moneyPerSecondAverage: number; // $/sec (totalMoneyEarned / totalPlayTime)
  
  // Efficacité
  efficiencyRatio: number; // Ratio (totalMoneyEarned / totalMoneySpent)
  
  // Répartition
  clickIncomePercentage: number; // % du revenu via clics
  passiveIncomePercentage: number; // % du revenu via passif
  
  // Achievements
  achievementCompletionRate: number; // % de succès complétés
  
  // Session
  currentSessionDuration: number; // Durée de la session en cours (secondes)
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
  sessionNewAchievements: string[];
  combo?: { currentStreak: number };
  jobs: JobState;
}
