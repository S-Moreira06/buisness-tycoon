import { TierType } from './tierConfig';

export interface ClickUpgradeConfig {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  effectType: 'base_money' | 'crit_chance' | 'crit_multiplier';
  effectValue: number;
  tier: TierType;
}

export const CLICK_UPGRADES_CONFIG: Record<string, ClickUpgradeConfig> = {
  // ==========================================
  // 🥉 TIER BRONZE (Début de partie)
  // ==========================================
  training_gloves: {
    id: 'training_gloves',
    name: '🥊 Gants d\'Entraînement',
    description: 'Protège les doigts pour cliquer plus longtemps.',
    reputationCost: 25,
    effectType: 'base_money',
    effectValue: 1, // +1€
    tier: 'bronze',
  },
  better_mouse: {
    id: 'better_mouse',
    name: '🖱️ Souris Ergonomique',
    description: 'Une meilleure prise en main.',
    reputationCost: 50,
    effectType: 'base_money',
    effectValue: 2, // +2€
    tier: 'bronze',
  },
  energy_drink: {
    id: 'energy_drink',
    name: '⚡ Boisson Énergisante',
    description: 'Un petit boost de réflexes.',
    reputationCost: 100,
    effectType: 'crit_chance',
    effectValue: 0.03, // +3% chance
    tier: 'bronze',
  },
  lucky_charm: {
    id: 'lucky_charm',
    name: '🍀 Trèfle à 4 feuilles',
    description: 'La chance sourit aux audacieux.',
    reputationCost: 250,
    effectType: 'crit_chance',
    effectValue: 0.05, // +5% chance
    tier: 'bronze',
  },

  // ==========================================
  // 🥈 TIER SILVER (Milieu de partie)
  // ==========================================
  double_click: {
    id: 'double_click',
    name: '🖱️🖱️ Double Clic',
    description: 'Une technique secrète des années 90.',
    reputationCost: 500,
    effectType: 'base_money',
    effectValue: 10, // +10€
    tier: 'silver',
  },
  precision_scope: {
    id: 'precision_scope',
    name: '🎯 Lunettes de Précision',
    description: 'Vos critiques font plus mal !',
    reputationCost: 750,
    effectType: 'crit_multiplier',
    effectValue: 0.5, // +0.5x Multi
    tier: 'silver',
  },
  mechanical_switch: {
    id: 'mechanical_switch',
    name: '⚙️ Switches Mécaniques',
    description: 'Clicky clicky ! Le son de l\'argent.',
    reputationCost: 1000,
    effectType: 'base_money',
    effectValue: 25, // +25€
    tier: 'silver',
  },
  gaming_chair: {
    id: 'gaming_chair',
    name: '💺 Chaise Gaming',
    description: 'Le skill vient de la chaise, c\'est connu.',
    reputationCost: 1500,
    effectType: 'crit_multiplier',
    effectValue: 0.5, // +0.5x Multi
    tier: 'silver',
  },
  loaded_dice: {
    id: 'loaded_dice',
    name: '🎲 Dés Pipés',
    description: 'On force un peu le destin...',
    reputationCost: 2000,
    effectType: 'crit_chance',
    effectValue: 0.07, // +7% chance
    tier: 'silver',
  },

  // ==========================================
  // 🥇 TIER GOLD (Fin de partie)
  // ==========================================
  golden_cursor: {
    id: 'golden_cursor',
    name: '✨ Curseur Doré',
    description: 'Un pointeur en or massif 24 carats.',
    reputationCost: 5000,
    effectType: 'base_money',
    effectValue: 100, // +100€
    tier: 'gold',
  },
  vital_point: {
    id: 'vital_point',
    name: '💥 Point Vital',
    description: 'Savoir où frapper change tout.',
    reputationCost: 7500,
    effectType: 'crit_multiplier',
    effectValue: 1.0, // +1.0x Multi
    tier: 'gold',
  },
  sniper_instinct: {
    id: 'sniper_instinct',
    name: '🦅 Instinct de Sniper',
    description: 'Ne rate jamais sa cible.',
    reputationCost: 10000,
    effectType: 'crit_chance',
    effectValue: 0.10, // +10% chance
    tier: 'gold',
  },
  diamond_finger: {
    id: 'diamond_finger',
    name: '💎 Doigt de Diamant',
    description: 'Incassable et incroyablement précieux.',
    reputationCost: 25000,
    effectType: 'base_money',
    effectValue: 500, // +500€
    tier: 'gold',
  },

  // ==========================================
  // 💎 TIER PLATINUM (Endgame / Prestige)
  // ==========================================
  matrix_code: {
    id: 'matrix_code',
    name: '💻 Code de la Matrice',
    description: 'Vous voyez les 1 et les 0.',
    reputationCost: 50000,
    effectType: 'crit_chance',
    effectValue: 0.15, // +15% chance
    tier: 'platinum',
  },
  quantum_click: {
    id: 'quantum_click',
    name: '⚛️ Clic Quantique',
    description: 'Le clic existe et n\'existe pas en même temps.',
    reputationCost: 100000,
    effectType: 'crit_multiplier',
    effectValue: 3.0, // +3.0x Multi (ÉNORME)
    tier: 'platinum',
  },
  infinity_gauntlet: {
    id: 'infinity_gauntlet',
    name: '🧤 Gantelet de l\'Infini',
    description: 'Un claquement de doigts suffit.',
    reputationCost: 250000,
    effectType: 'base_money',
    effectValue: 5000, // +5000€
    tier: 'platinum',
  },
};
