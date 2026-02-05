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
    unlockConditions?: any;
  showWhenLocked?: boolean;

}

export const CLICK_UPGRADES_CONFIG: Record<string, ClickUpgradeConfig> = {
  // ==========================================
  // 💰 BASE MONEY (Pas de scaling)
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
    unlockConditions: [
      {
        type: 'player_level',
        value: 3,
      },
    ],
    showWhenLocked: true,
  },
  double_click: {
    id: 'double_click',
    name: '🖱️🖱️ Double Clic',
    description: 'Une technique secrète des années 90.',
    reputationCost: 180,
    effectType: 'base_money',
    effectValue: 10, // +10€
    tier: 'silver',
    unlockConditions: [
      {
        type: 'player_level',
        value: 10,
      },
    ],
    showWhenLocked: true,
  },
  mechanical_switch: {
    id: 'mechanical_switch',
    name: '⚙️ Switches Mécaniques',
    description: 'Clicky clicky ! Le son de l\'argent.',
    reputationCost: 450,
    effectType: 'base_money',
    effectValue: 25, // +25€
    tier: 'silver',
    unlockConditions: [
      {
        type: 'player_level',
        value: 15,
      },
    ],
    showWhenLocked: true,
  },
  golden_cursor: {
    id: 'golden_cursor',
    name: '✨ Curseur Doré',
    description: 'Un pointeur en or massif 24 carats.',
    reputationCost: 1750,
    effectType: 'base_money',
    effectValue: 100, // +100€
    tier: 'gold',
    unlockConditions: [
      {
        type: 'player_level',
        value: 25,
      },
    ],
    showWhenLocked: true,
  },
  diamond_finger: {
    id: 'diamond_finger',
    name: '💎 Doigt de Diamant',
    description: 'Incassable et incroyablement précieux.',
    reputationCost: 8500,
    effectType: 'base_money',
    effectValue: 500, // +500€
    tier: 'gold',
    unlockConditions: [
      {
        type: 'player_level',
        value: 31,
      },
    ],
    showWhenLocked: true,
  },
  infinity_gauntlet: {
    id: 'infinity_gauntlet',
    name: '🧤 Gantelet de l\'Infini',
    description: 'Un claquement de doigts suffit.',
    reputationCost: 80000,
    effectType: 'base_money',
    effectValue: 5000, // +5000€
    tier: 'platinum',
    unlockConditions: [
      {
        type: 'player_level',
        value: 40,
      },
    ],
    showWhenLocked: true,
  },
  autoclicker_basic: {
    id: 'autoclicker_basic',
    name: '🤖 Auto-Clicker v1.0',
    description: 'Génère automatiquement 1 clic/seconde même quand tu ne cliques pas. Le grind passif commence.',
    reputationCost: 150000,
    effectType: 'base_money',
    effectValue: 1, // 1 auto-clic/sec
    tier: 'diamond',
    unlockConditions: [
      {
        type: 'player_level',
        value: 55,
      },
    ],
    showWhenLocked: true,
  },

  // ==========================================
  // 🎯 CRIT CHANCE (Pas de scaling)
  // ==========================================
  energy_drink: {
    id: 'energy_drink',
    name: '⚡ Boisson Énergisante',
    description: 'Un petit boost de réflexes.',
    reputationCost: 60,
    effectType: 'crit_chance',
    effectValue: 0.03, // +3% chance
    tier: 'bronze',
  },
  lucky_charm: {
    id: 'lucky_charm',
    name: '🍀 Trèfle à 4 feuilles',
    description: 'La chance sourit aux audacieux.',
    reputationCost: 95,
    effectType: 'crit_chance',
    effectValue: 0.05, // +5% chance
    tier: 'bronze',
    unlockConditions: [
      {
        type: 'player_level',
        value: 5,
      },
    ],
    showWhenLocked: true,
  },
  loaded_dice: {
    id: 'loaded_dice',
    name: '🎲 Dés Pipés',
    description: 'On force un peu le destin...',
    reputationCost: 130,
    effectType: 'crit_chance',
    effectValue: 0.07, // +7% chance
    tier: 'silver',
    unlockConditions: [
      {
        type: 'player_level',
        value: 7,
      },
    ],
    showWhenLocked: true,
  },
  sniper_instinct: {
    id: 'sniper_instinct',
    name: '🦅 Instinct de Sniper',
    description: 'Ne rate jamais sa cible.',
    reputationCost: 185,
    effectType: 'crit_chance',
    effectValue: 0.10, // +10% chance
    tier: 'gold',
    unlockConditions: [
      {
        type: 'player_level',
        value: 13,
      },
    ],
    showWhenLocked: true,
  },
  matrix_code: {
    id: 'matrix_code',
    name: '💻 Code de la Matrice',
    description: 'Vous voyez les 1 et les 0.',
    reputationCost: 275,
    effectType: 'crit_chance',
    effectValue: 0.15, // +15% chance
    tier: 'platinum',
    unlockConditions: [
      {
        type: 'player_level',
        value: 17,
      },
    ],
    showWhenLocked: true,
  },
  click_cascade: {
    id: 'click_cascade',
    name: '⚡ Cascade de Clics',
    description: 'Chaque clic a 20% de chances de déclencher 5 clics supplémentaires instantanés. RNG béni.',
    reputationCost: 350,
    effectType: 'crit_chance',
    effectValue: 0.20, // 20% chance de x5 clics
    tier: 'diamond',
    unlockConditions: [
      {
        type: 'player_level',
        value: 25,
      },
    ],
    showWhenLocked: true,
  },

  // ==========================================
  // 💥 CRIT MULTIPLIER (Pas de scaling)
  // ==========================================
  precision_scope: {
    id: 'precision_scope',
    name: '🎯 Lunettes de Précision',
    description: 'Vos critiques font plus mal !',
    reputationCost: 500,
    effectType: 'crit_multiplier',
    effectValue: 0.5, // +0.5x Multi
    tier: 'silver',
    unlockConditions: [
      {
        type: 'player_level',
        value: 3,
      },
    ],
    showWhenLocked: true,
  },
  gaming_chair: {
    id: 'gaming_chair',
    name: '💺 Chaise Gaming',
    description: 'Le skill vient de la chaise, c\'est connu.',
    reputationCost: 750,
    effectType: 'crit_multiplier',
    effectValue: 0.5, // +0.5x Multi
    tier: 'silver',
    unlockConditions: [
      {
        type: 'player_level',
        value: 10,
      },
    ],
    showWhenLocked: true,
  },
  vital_point: {
    id: 'vital_point',
    name: '💥 Point Vital',
    description: 'Savoir où frapper change tout.',
    reputationCost:1000,
    effectType: 'crit_multiplier',
    effectValue: 1.0, // +1.0x Multi
    tier: 'gold',
    unlockConditions: [
      {
        type: 'player_level',
        value: 15,
      },
    ],
    showWhenLocked: true,
  },
  quantum_click: {
    id: 'quantum_click',
    name: '⚛️ Clic Quantique',
    description: 'Le clic existe et n\'existe pas en même temps.',
    reputationCost: 2500,
    effectType: 'crit_multiplier',
    effectValue: 3.0, // +3.0x Multi (ÉNORME)
    tier: 'platinum',
    unlockConditions: [
      {
        type: 'player_level',
        value: 30,
      },
    ],
    showWhenLocked: true,
  },

  // ==========================================
  // 🏢 BUSINESS SYNERGY (Scaling: businesses_owned)
  // ==========================================
  business_momentum: {
    id: 'business_momentum',
    name: '💼 Momentum Entrepreneurial',
    description: 'Chaque business possédé augmente le gain de clic de 5%. Tes entreprises boostent ton hustle personnel.',
    reputationCost: 10000,
    effectType: 'business_synergy',
    effectValue: 0.05, // +5% par business possédé
    tier: 'gold',
    scalingType: 'businesses_owned',
    scalingFactor: 0.05,
    unlockConditions: [
      {
        type: 'player_level',
        value: 999,
      },
    ],
    showWhenLocked: true,
  },
  executive_touch: { // VERIFIER SI CA A ETE INTEGRER MAIS JE NE PENSE PAS : SUPER IDEE!
    id: 'executive_touch',
    name: '👔 Touch du PDG',
    description: 'Chaque clic augmente TEMPORAIREMENT les revenus de TOUS les businesses de 1% pendant 3 secondes (stackable x10 max).',
    reputationCost: 60000,
    effectType: 'business_synergy',
    effectValue: 0.01, // +1% par clic (max 10% = 10 clics)
    tier: 'platinum',
    scalingType: 'businesses_owned',
    scalingFactor: 0.01,
    unlockConditions: [
      {
        type: 'player_level',
        value: 999,
      },
    ],
    showWhenLocked: true,
  },
  reality_clicker: { // VERIFIER SI CA A ETE INTEGRER MAIS JE NE PENSE PAS : SUPER IDEE!
    id: 'reality_clicker',
    name: '♾️ Clicker de Réalité',
    description: 'Chaque clic multiplie TOUS les revenus de businesses par 1.001 pendant 1 seconde (effet permanent cumulatif si spam). Tu réécris les lois économiques.',
    reputationCost: 500000,
    effectType: 'business_synergy',
    effectValue: 1.001, // ×1.001 par clic (exponentiel si spam)
    tier: 'master',
    scalingType: 'businesses_owned',
    scalingFactor: 1.001,
    unlockConditions: [
      {
        type: 'player_level',
        value: 999,
      },
    ],
    showWhenLocked: true,
  },
  transcendence: {// VERIFIER SI CA A ETE INTEGRER MAIS JE NE PENSE PAS : SUPER IDEE!
    id: 'transcendence',
    name: '✨ Transcendance Économique',
    description: 'Chaque clic augmente définitivement le multiplicateur global de TOUS les businesses de +0.001%. Effet permanent cumulatif. Clique 10,000 fois = +10% permanent.',
    reputationCost: 1000000,
    effectType: 'business_synergy',
    effectValue: 0.00001, // +0.001% permanent par clic
    tier: 'master',
    scalingType: 'businesses_owned',
    scalingFactor: 0.00001,
    unlockConditions: [
      {
        type: 'player_level',
        value: 999,
      },
    ],
    showWhenLocked: true,
  },

  // ==========================================
  // ⭐ SCALING: REPUTATION (verifier si ca scale sur les stocks ou sur le total obtenu depuis le debut)
  // ==========================================
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
    unlockConditions: [
      {
        type: 'player_level',
        value:999,
      },
    ],
    showWhenLocked: true,
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
    unlockConditions: [
      {
        type: 'player_level',
        value:999,
      },
    ],
    showWhenLocked: true,
  },

  // ==========================================
  // 💸 SCALING: TOTAL INCOME
  // ==========================================
  passive_clicker: {
    id: 'passive_clicker',
    name: '💰 Dividendes par Clic',
    description: 'Chaque clic génère aussi 0.05% du revenu passif total de tes businesses. Tu capitalises sur ton empire.',
    reputationCost: 1800,
    effectType: 'passive_boost',
    effectValue: 0.0005, // 0.05% du revenu/seconde
    tier: 'gold',
    scalingType: 'total_income',
    scalingFactor: 0.0005,
    unlockConditions: [
      {
        type: 'player_level',
        value: 300,
      },
    ],
    showWhenLocked: true,
  },
  empire_synergy: {
    id: 'empire_synergy',
    name: '🏰 Synergie d\'Empire',
    description: 'Gain de clic = 1% de ton revenu passif total par seconde. Plus ton empire est grand, plus tes clics valent cher.',
    reputationCost: 5000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'platinum',
    scalingType: 'total_income',
    scalingFactor: 0.01, // 1% du revenu/s
    unlockConditions: [
      {
        type: 'player_level',
        value: 300,
      },
    ],
    showWhenLocked: true,
  },
  cosmic_clicker: {
    id: 'cosmic_clicker',
    name: '🌌 Clicker Cosmique',
    description: 'Gain de clic = 5% du revenu TOTAL de tes 5 meilleurs businesses. Un seul clic = jackpot.',
    reputationCost: 25000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'diamond',
    scalingType: 'total_income',
    scalingFactor: 0.05, // 5% des top 5 businesses
    unlockConditions: [
      {
        type: 'player_level',
        value: 300,
      },
    ],
    showWhenLocked: true,
  },
  omnipotent_touch: {
    id: 'omnipotent_touch',
    name: '🎛️ Touch Omnipotente',
    description: 'Gain de clic = 10% du revenu TOTAL de TOUS tes businesses par seconde. Un clic = une fortune.',
    reputationCost: 150000,
    effectType: 'scaling',
    effectValue: 1,
    tier: 'master',
    scalingType: 'total_income',
    scalingFactor: 0.10, // 10% du total revenu/s
    unlockConditions: [
      {
        type: 'player_level',
        value: 300,
      },
    ],
    showWhenLocked: true,
  },
};