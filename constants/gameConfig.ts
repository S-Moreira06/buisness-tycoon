/**
 * Configuration générale du jeu
 * Centralise tous les paramètres de gameplay pour faciliter le tuning
 */
export const GAME_CONFIG = {
  // 💰 Valeurs de départ
  INITIAL_MONEY: 111111,
  INITIAL_REPUTATION: 999,
  INITIAL_PASSIVE_INCOME: 0,

    // 🎮 Gameplay - Clic manuel
  CLICK_REWARD_MONEY: 1, // Argent gagné par clic (mettre à 1 en prod, 999999 en dev)
  CLICK_REWARD_REPUTATION: 0.1, // Réputation gagnée par clic
    // ⚡ Système de Critique (Click)
  BASE_CRIT_CHANCE: 0.05,      // 5% de chance de base (0.05)
  BASE_CRIT_MULTIPLIER: 2,     // Dégâts x2 en cas de critique

  // 📈 Revenus passifs
  STOCK_PASSIVE_INCOME_RATE: 0.01, // 1% du prix d'achat par seconde
  
  // ⏱️ Timers (en millisecondes)
  AUTO_INCREMENT_INTERVAL: 1000, // Fréquence de gain passif (1000ms = 1 seconde)
  SAVE_INTERVAL: 5000, //Sauvegarde automatique toutes les 5 secondes
  
  // 🔧 Upgrades de business
  BUSINESS_UPGRADE_COST_MULTIPLIER: 0.1, // Coût x1.9 à chaque niveau
  BUSINESS_LEVEL_INCOME_BOOST: 0.1, // +20% de revenu par niveau
  
  // ⭐ Progression
  UPGRADE_MULTIPLIER: 1.1, // +10% de revenu par upgrade acheté (défini aussi dans chaque upgrade)
  
  // 🎯 UI
  MONEY_PROGRESS_MAX: 1_000_000, // Montant max pour la barre de progression

  // 🎯 Système d'expérience et de niveau
  XP_PER_CLICK: 1,              // XP gagnée par clic
  XP_PER_NEW_BUSINESS: 30,       // XP pour l'achat d'un nouveau business
  BASE_XP_REQUIRED: 100,         // XP nécessaire pour passer du niveau 1 au niveau 2
  XP_MULTIPLIER_PER_LEVEL: 2.2,    // Doublement de l'XP requise à chaque niveau
  INITIAL_PLAYER_LEVEL: 1,              // Niveau de départ
  INITIAL_EXPERIENCE: 0,         // XP de départ

} as const;
export const calculateXPForLevel = (targetLevel: number): number => {
  if (targetLevel <= 1) return 0;
  
  let totalXP = 0;
  for (let lvl = 1; lvl < targetLevel; lvl++) {
    totalXP += GAME_CONFIG.BASE_XP_REQUIRED * Math.pow(GAME_CONFIG.XP_MULTIPLIER_PER_LEVEL, lvl - 1);
  }
  return totalXP;
};

/**
 * Calcule le niveau actuel en fonction de l'XP totale
 * @param currentXP - L'XP actuelle du joueur
 * @returns Le niveau correspondant
 */
export const calculateLevelFromXP = (currentXP: number): number => {
  let playerLevel = 1;
  while (calculateXPForLevel(playerLevel + 1) <= currentXP) {
    playerLevel++;
  }
  return playerLevel;
};

/**
 * Calcule l'XP nécessaire pour le prochain niveau
 * @param currentLevel - Le niveau actuel
 * @returns L'XP nécessaire pour passer au niveau suivant
 */
export const getXPForNextLevel = (currentPlayerLevel: number): number => {
  return calculateXPForLevel(currentPlayerLevel + 1) - calculateXPForLevel(currentPlayerLevel);
};
// Type helper pour l'autocomplétion
export type GameConfig = typeof GAME_CONFIG;
