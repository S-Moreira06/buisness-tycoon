import { TierType } from './tierConfig';

export interface ClickUpgradeConfig {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  effectType: 'base_money' | 'crit_chance' | 'crit_multiplier' | 'business_synergy' | 'passive_boost' | 'scaling';
  effectValue: number;
  tier: TierType;
  scalingType?: 'reputation' | 'businesses_owned' | 'total_income'; // 🆕 NOUVEAU
  scalingFactor?: number; // 🆕 NOUVEAU
}

export const CLICK_UPGRADES_CONFIG: Record<string, ClickUpgradeConfig> = {
  // ==========================================
  // 🥉 TIER BRONZE (Début de partie)
  // ==========================================
  training_gloves: {
    id: 'training_gloves',
    name: '🥊 Gants d\'Entraînement',
    description: 'Protège les doigts pour cliquer plus longtemps.',
    reputationCost: 20,
    effectType: 'base_money',
    effectValue: 1, // +1€
    tier: 'bronze',
  },
  better_mouse: {
    id: 'better_mouse',
    name: '🖱️ Souris Ergonomique',
    description: 'Une meilleure prise en main.',
    reputationCost: 35,
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
    // ==========================================
  // 🆕 TIER GOLD : SYNERGIES CLICK ↔ BUSINESS
  // ==========================================

  business_momentum: {
    id: 'business_momentum',
    name: '💼 Momentum Entrepreneurial',
    description: 'Chaque business possédé augmente le gain de clic de 5%. Tes entreprises boostent ton hustle personnel.',
    reputationCost: 12000,
    effectType: 'business_synergy',
    effectValue: 0.05, // +5% par business possédé
    tier: 'gold',
    scalingType: 'businesses_owned',
    scalingFactor: 0.05,
  },

  reputation_clicker: {
    id: 'reputation_clicker',
    name: '⭐ Influenceur Millionnaire',
    description: 'Chaque point de réputation augmente le gain de clic de 0.1%. Ta notoriété se monétise.',
    reputationCost: 15000,
    effectType: 'scaling',
    effectValue: 1, // Base value
    tier: 'gold',
    scalingType: 'reputation',
    scalingFactor: 0.001, // +0.1% par réputation
  },

  passive_clicker: {
    id: 'passive_clicker',
    name: '💰 Dividendes par Clic',
    description: 'Chaque clic génère aussi 0.05% du revenu passif total de tes businesses. Tu capitalises sur ton empire.',
    reputationCost: 18000,
    effectType: 'passive_boost',
    effectValue: 0.0005, // 0.05% du revenu/seconde
    tier: 'gold',
    scalingType: 'total_income',
    scalingFactor: 0.0005,
  },
    // ==========================================
  // 💎 TIER PLATINUM : SYNERGIES AVANCÉES
  // ==========================================

  executive_touch: {
    id: 'executive_touch',
    name: '👔 Touch du PDG',
    description: 'Chaque clic augmente TEMPORAIREMENT les revenus de TOUS les businesses de 1% pendant 3 secondes (stackable x10 max).',
    reputationCost: 60000,
    effectType: 'business_synergy',
    effectValue: 0.01, // +1% par clic (max 10% = 10 clics)
    tier: 'platinum',
    scalingType: 'businesses_owned',
    scalingFactor: 0.01,
  },

  empire_synergy: {
    id: 'empire_synergy',
    name: '🏰 Synergie d\'Empire',
    description: 'Gain de clic = 1% de ton revenu passif total par seconde. Plus ton empire est grand, plus tes clics valent cher.',
    reputationCost: 80000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'platinum',
    scalingType: 'total_income',
    scalingFactor: 0.01, // 1% du revenu/s
  },

  prestige_multiplier: {
    id: 'prestige_multiplier',
    name: '🌟 Multiplicateur de Prestige',
    description: 'Pour chaque tranche de 1000 réputations, gain de clic +10%. À 10k réputation = +100% de gain de clic.',
    reputationCost: 120000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'platinum',
    scalingType: 'reputation',
    scalingFactor: 0.0001, // +10% par 1000 rép
  },
    // ==========================================
  // 💠 TIER DIAMOND : ENDGAME CLICKER
  // ==========================================

  autoclicker_basic: {
    id: 'autoclicker_basic',
    name: '🤖 Auto-Clicker v1.0',
    description: 'Génère automatiquement 1 clic/seconde même quand tu ne cliques pas. Le grind passif commence.',
    reputationCost: 150000,
    effectType: 'base_money',
    effectValue: 1, // 1 auto-clic/sec
    tier: 'diamond',
  },

  click_cascade: {
    id: 'click_cascade',
    name: '⚡ Cascade de Clics',
    description: 'Chaque clic a 20% de chances de déclencher 5 clics supplémentaires instantanés. RNG béni.',
    reputationCost: 200000,
    effectType: 'crit_chance',
    effectValue: 0.20, // 20% chance de x5 clics
    tier: 'diamond',
  },

  cosmic_clicker: {
    id: 'cosmic_clicker',
    name: '🌌 Clicker Cosmique',
    description: 'Gain de clic = 5% du revenu TOTAL de tes 5 meilleurs businesses. Un seul clic = jackpot.',
    reputationCost: 300000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'diamond',
    scalingType: 'total_income',
    scalingFactor: 0.05, // 5% des top 5 businesses
  },
    // ==========================================
  // 👑 TIER MASTER : GOD MODE CLICKER
  // ==========================================

  reality_clicker: {
    id: 'reality_clicker',
    name: '♾️ Clicker de Réalité',
    description: 'Chaque clic multiplie TOUS les revenus de businesses par 1.001 pendant 1 seconde (effet permanent cumulatif si spam). Tu réécris les lois économiques.',
    reputationCost: 500000,
    effectType: 'business_synergy',
    effectValue: 1.001, // ×1.001 par clic (exponentiel si spam)
    tier: 'master',
    scalingType: 'businesses_owned',
    scalingFactor: 1.001,
  },

  omnipotent_touch: {
    id: 'omnipotent_touch',
    name: '🎛️ Touch Omnipotente',
    description: 'Gain de clic = 10% du revenu TOTAL de TOUS tes businesses par seconde. Un clic = une fortune.',
    reputationCost: 750000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'master',
    scalingType: 'total_income',
    scalingFactor: 0.10, // 10% du total revenu/s
  },

  transcendence: {
    id: 'transcendence',
    name: '✨ Transcendance Économique',
    description: 'Chaque clic augmente définitivement le multiplicateur global de TOUS les businesses de +0.001%. Effet permanent cumulatif. Clique 10,000 fois = +10% permanent.',
    reputationCost: 1000000,
    effectType: 'business_synergy',
    effectValue: 0.00001, // +0.001% permanent par clic
    tier: 'master',
    scalingType: 'businesses_owned',
    scalingFactor: 0.00001,
  },

};
