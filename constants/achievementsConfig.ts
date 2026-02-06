import { checkUnlockConditions } from '@/hooks/useUpgradeUnlock';
import { Achievement, GameState } from '@/types/game';
import { CLICK_UPGRADES_CONFIG } from './clickUpgradesConfig';
import { UPGRADES_CONFIG } from './upgradesConfig';

const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;
// ==========================================
// 🔧 HELPER FUNCTION
// ==========================================
function createUpgradeUnlockCondition(
  upgradeId: string,
  upgradeType: 'business' | 'click'
): (state: GameState) => boolean {
  return (state: GameState) => {
    const upgradeConfig = upgradeType === 'business' 
      ? UPGRADES_CONFIG[upgradeId]
      : CLICK_UPGRADES_CONFIG[upgradeId];
    
    if (!upgradeConfig?.unlockConditions) {
      return false;
    }
    
    const { isUnlocked } = checkUnlockConditions(upgradeConfig.unlockConditions, {
      businesses: state.businesses,
      stats: state.stats,
      totalPassiveIncome: state.totalPassiveIncome,
      playerLevel: state.playerLevel,
      combo: state.combo,
    });
    
    return isUnlocked;
  };
}


export const ACHIEVEMENTS: Achievement[] = [

// --- 🖱️ CATÉGORIE : CLICKER (L'effort physique) ---
{
  id: 'first_steps',
  title: 'Premiers Pas',
  description: 'Effectuer 10 clics manuels',
  icon: '👆',
  rewards: { reputation: 20, money: 300, xp: 20 }, // Trivial
  condition: (state: GameState) => state.stats.totalClicks >= 10,
},

{
  id: 'clicker1',
  title: 'Échauffement',
  description: 'Effectuer 100 clics manuels',
  icon: '👆',
  rewards: { reputation: 30, money: 1000, xp: 40 }, // Facile
  condition: (s: GameState) => s.stats.totalClicks >= 100,
},

{
  id: 'clicker2',
  title: 'Doigts de Fée',
  description: 'Effectuer 1 000 clics manuels',
  icon: '🖐️',
  rewards: { reputation: 75, money: 2500, xp: 150 }, // Moyen
  condition: (s: GameState) => s.stats.totalClicks >= 1000,
},

{
  id: 'clicker3',
  title: 'Est-ce un bot ?',
  description: 'Atteindre 10 000 clics manuels',
  icon: '🤖',
  rewards: { reputation: 150, money: 9500, xp: 500 }, // Difficile
  condition: (s: GameState) => s.stats.totalClicks >= 10000,
},

{
  id: 'crit_luck1',
  title: 'Coup de Chance 1',
  description: 'Réaliser 10 clics critiques',
  icon: '⚡',
  rewards: { reputation: 20, xp: 100, money: 200 }, // Moyen (dépend de la chance)
  condition: (s: GameState) => s.stats.totalCriticalClicks >= 10,
},
{
  id: 'crit_luck2',
  title: 'Coup de Chance 2',
  description: 'Réaliser 50 clics critiques',
  icon: '⚡',
  rewards: { reputation: 50, xp: 100 }, // Moyen (dépend de la chance)
  condition: (s: GameState) => s.stats.totalCriticalClicks >= 50,
},
{
  id: 'crit_luck3',
  title: 'Coup de Chance 3',
  description: 'Réaliser 500 clics critiques',
  icon: '⚡',
  rewards: { reputation: 150, xp: 1000, money: 10000 }, // Moyen (dépend de la chance)
  condition: (s: GameState) => s.stats.totalCriticalClicks >= 500,
},
{
  id: 'crit_luck4',
  title: 'Coup de Chance MAX',
  description: 'Réaliser 5000 clics critiques',
  icon: '⚡',
  rewards: { reputation: 255, xp: 5555, money: 100000 }, // Moyen (dépend de la chance)
  condition: (s: GameState) => s.stats.totalCriticalClicks >= 5000,
},

// --- 💰 CATÉGORIE : FORTUNE (Accumulation) ---

{
  id: 'money_saver1',
  title: 'Petit Économe',
  description: 'Avoir 1 000 $ en banque',
  icon: '💰',
  rewards: { reputation: 20, xp: 20 }, // Trivial
  condition: (state: GameState) => state.money >= 1000,
},
{
  id: 'money_saver2',
  title: 'Tirelire Pleine',
  description: 'Avoir 10 000 $ en banque',
  icon: '🐷',
  rewards: { reputation: 30, xp: 60 }, // Facile
  condition: (s: GameState) => s.money >= 10000,
},
{
  id: 'money_saver3',
  title: 'Les premiers retours sur investissements',
  description: 'Avoir 100 000 $ en banque',
  icon: '🐷',
  rewards: { reputation: 50, xp: 200 }, // Moyen
  condition: (s: GameState) => s.money >= 100000,
},
{
  id: 'money_saver4',
  title: 'Millionaire!',
  description: 'Avoir 1 000 000 $ en banque',
  icon: '🐷',
  rewards: { reputation: 80, xp: 600 }, // Hard
  condition: (s: GameState) => s.money >= 1000000,
},

{
  id: 'money_saver5',
  title: 'Multimillionnaire!',
  description: 'Posséder 10 Millions $ sur le compte',
  icon: '🏦',
  rewards: { reputation: 150, xp: 999 }, // Extrême
  condition: (s: GameState) => s.money >= 10000000,
},
{
  id: 'money_saver6',
  title: 'Milliardaire!',
  description: 'Posséder 1 Milliard $ sur le compte',
  icon: '🏦',
  rewards: { reputation: 300, xp: 3000 }, // Extrême
  condition: (s: GameState) => s.money >= 1000000000,
},

{
  id: 'money_earner1',
  title: 'Premiers bénéfices',
  description: 'Accumuler un total de 1000 $ de gains',
  icon: '💵',
  rewards: { reputation: 10, xp: 50 }, // Easy
  condition: (s: GameState) => s.stats.totalMoneyEarned >= 1000,
},
{
  id: 'money_earner2',
  title: '100 Patates',
  description: 'Accumuler un total de 100 000 $ de gains',
  icon: '💵',
  rewards: { reputation: 25, xp: 100 }, // Medium
  condition: (s: GameState) => s.stats.totalMoneyEarned >= 100000,
},
{
  id: 'money_earner3',
  title: 'Nouveau Riche',
  description: 'Accumuler un total de 1 Million $ de gains)',
  icon: '💵',
  rewards: { reputation: 50, xp: 500 }, // Difficile
  condition: (s: GameState) => s.stats.totalMoneyEarned >= 1000000,
},
{
  id: 'money_earner4',
  title: 'Club des 3 Virgules',
  description: 'Gagner 1 Milliard $ au total',
  icon: '🚀',
  rewards: { reputation: 100, xp: 1000 }, // Légendaire
  condition: (s: GameState) => s.stats.totalMoneyEarned >= 1000000000,
},

// --- 🏢 CATÉGORIE : EMPIRE (Business) ---

{
  id: 'biz_first',
  title: 'Premier Investissement',
  description: 'Acheter votre premier business',
  icon: '🍋',
  rewards: { reputation: 10, xp: 20, money: 500 }, // Trivial
  condition: (s: GameState) => s.stats.businessesBought >= 1,
},
{
  id: 'manager',
  title: 'Manager',
  description: 'Posséder 5 business différents',
  icon: '🏢',
  rewards: { reputation: 100, xp: 200 }, // Moyen
  condition: (state: GameState) =>
    Object.values(state.businesses).filter(b => b.owned).length >= 5,
},
{
  id: 'biz_expander',
  title: 'Expansion Rapide',
  description: 'Posséder 50 business au total',
  icon: '🏗️',
  rewards: { reputation: 400, xp: 800 }, // Difficile
  condition: (s: GameState) =>
    Object.values(s.businesses).reduce((acc, b) => acc + (b.quantity || 0), 0) >= 50,
},

{
  id: 'biz_monopoly',
  title: 'Monopole',
  description: 'Posséder au moins 1 exemplaire de CHAQUE business',
  icon: '🎩',
  rewards: { reputation: 500, xp: 1000 }, // Difficile
  condition: (s: GameState) =>
    Object.values(s.businesses).every(b => b.owned),
},

{
  id: 'biz_level_100',
  title: 'Optimisation Maximale',
  description: 'Monter un business au niveau 100',
  icon: '📈',
  rewards: { reputation: 2000, xp: 4000 }, // Extrême
  condition: (s: GameState) =>
    Object.values(s.businesses).some(b => b.level >= 100),
},

{
  id: 'big_spender',
  title: 'Flambeur',
  description: 'Dépenser un total de 1 000 000 $',
  icon: '💸',
  rewards: { reputation: 200, xp: 400 }, // Difficile
  condition: (state: GameState) => state.stats.totalMoneySpent >= 1000000,
},

// --- ⚙️ CATÉGORIE : AMÉLIORATIONS (Upgrades) ---

{
  id: 'tech_start',
  title: 'R&D Débutant',
  description: 'Acheter 5 améliorations',
  icon: '🧪',
  rewards: { reputation: 25, xp: 50, money: 500 }, // Facile
  condition: (s: GameState) => s.stats.upgradesPurchased >= 5,
},

{
  id: 'tech_guru',
  title: 'Visionnaire',
  description: 'Acheter 20 améliorations',
  icon: '🧠',
  rewards: { reputation: 150, xp: 300 }, // Moyen-Difficile
  condition: (s: GameState) => s.stats.upgradesPurchased >= 20,
},


// --- ⏳ CATÉGORIE : DÉVOUEMENT (Temps de jeu) ---

{
  id: 'time_addict1',
  title: 'Le grind commence',
  description: 'Jouer pendant 10 minutes (temps actif)',
  icon: '⏳',
  rewards: { reputation: 5, xp: 100, money: 500 }, // facile
  condition: (s: GameState) => s.stats.totalPlayTime >= 600,
},
{
  id: 'time_addict2',
  title: 'Accro',
  description: 'Jouer pendant 1 heure (temps actif)',
  icon: '⏳',
  rewards: { reputation: 10, xp: 1000 }, // Moyen
  condition: (s: GameState) => s.stats.totalPlayTime >= 3600,
},
{
  id: 'time_addict3',
  title: 'PDG à plein temps',
  description: 'Jouer pendant 24 heures cumulées',
  icon: '🌙',
  rewards: { reputation: 100, xp: 2000 }, // Extrême
  condition: (s: GameState) => s.stats.totalPlayTime >= 86400,
},

// --- ⭐ CATÉGORIE : RÉPUTATION ---

{
  id: 'rep_known',
  title: 'Influenceur Local',
  description: 'Atteindre 1 000 de Réputation',
  icon: '✨',
  rewards: { money: 100000, xp: 200 }, // Moyen (récompense en réputation pour achievement de réputation)
  condition: (s: GameState) => s.reputation >= 1000,
},

{
  id: 'rep_boss',
  title: 'Le Parrain',
  description: 'Atteindre 100 000 de Réputation',
  icon: '🕶️',
  rewards: { money: 500000, xp: 2000 }, // Légendaire
  condition: (s: GameState) => s.reputation >= 100000,
},

// --- CATEGORIE : OBTENSION DE BOOST
{
    id: 'ach_unlock_business_coffeeMachine_gain1',
    title: '☕ Grains Arabica Premium',
    description: 'Débloquer l\'upgrade "☕ Grains Arabica Premium"',
    icon: '☕',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('coffeeMachine_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_coffeeMachine_gain2',
    title: '🌟 Les cocktails dans l\'âme',
    description: 'Débloquer l\'upgrade "🌟 Formation Barista Pro"',
    icon: '🌟',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('coffeeMachine_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_foodTruck_gain1',
    title: '🍕 Chef nomade',
    description: 'Débloquer l\'upgrade "🍕 Recettes Artisanales"',
    icon: '🍕',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('foodTruck_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_foodTruck_gain2',
    title: '⭐ Maître Pizzaïolo',
    description: 'Débloquer l\'upgrade "⭐ Four à Pierre Mobile"',
    icon: '⭐',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('foodTruck_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_smallShop_gain1',
    title: '🏪 Un monde meilleur',
    description: 'Débloquer l\'upgrade "🏪 Gamme Bio Exclusive"',
    icon: '🏪',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('smallShop_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_smallShop_gain2',
    title: '🌐 E-commerce Pioneer',
    description: 'Débloquer l\'upgrade "🌐 E-commerce + Click & Collect"',
    icon: '🌐',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('smallShop_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_airbnb_gain1',
    title: '🏠 Architecte d\'interieur',
    description: 'Débloquer l\'upgrade "🏠 Design d\'interieur"',
    icon: '🏠',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('airbnb_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_airbnb_gain2',
    title: '🌍 Hôte 5 étoiles',
    description: 'Débloquer l\'upgrade "🌍 Conciergerie Premium 24/7"',
    icon: '🌍',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('airbnb_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_library_gain1',
    title: '📚 Collectionneur de manuscrits',
    description: 'Débloquer l\'upgrade "📚 Section Premières Éditions"',
    icon: '📚',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('library_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_library_gain2',
    title: '🎭 Club de Littéraire',
    description: 'Débloquer l\'upgrade "🎭 Club de Lecture Exclusif"',
    icon: '🎭',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('library_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_gym_gain1',
    title: '🏋️ Fitness 2.0',
    description: 'Débloquer l\'upgrade "🏋️ Équipement Technogym"',
    icon: '🏋️',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('gym_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_gym_gain2',
    title: '💪 Coach Olympique',
    description: 'Débloquer l\'upgrade "💪 Coaches Olympiques"',
    icon: '💪',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('gym_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_cinema_gain1',
    title: '🎬 Experience 4DX',
    description: 'Débloquer l\'upgrade "🎬 Salles IMAX & 4DX"',
    icon: '🎬',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('cinema_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_cinema_gain2',
    title: '🍿 Vive les influenceurs',
    description: 'Débloquer l\'upgrade "🍿 Loges VIP & Gastronomie"',
    icon: '🍿',
    rewards: { xp: 63, reputation: 12 },
    condition: createUpgradeUnlockCondition('cinema_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_restaurant_gain1',
    title: '🍽️ La premiere étoile',
    description: 'Débloquer l\'upgrade "🍽️ Chef Étoilé Michelin"',
    icon: '🍽️',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('restaurant_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_restaurant_gain2',
    title: '⭐ Table du Chef & Menu Dégustation',
    description: 'Débloquer l\'upgrade "⭐ Table du Chef & Menu Dégustation"',
    icon: '⭐',
    rewards: { xp: 90, reputation: 18 },
    condition: createUpgradeUnlockCondition('restaurant_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_hotel_gain1',
    title: '🏨 Suites Royales',
    description: 'Débloquer l\'upgrade "🏨 Suites Panoramiques"',
    icon: '🏨',
    rewards: { xp: 52, reputation: 10 },
    condition: createUpgradeUnlockCondition('hotel_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_hotel_gain2',
    title: '🌟 Jaccuzzi Gang',
    description: 'Débloquer l\'upgrade "🌟 Spa Thermal & Wellness"',
    icon: '🌟',
    rewards: { xp: 120, reputation: 24 },
    condition: createUpgradeUnlockCondition('hotel_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_gamingStudio_gain1',
    title: '🎮 Moteur NextGen',
    description: 'Débloquer l\'upgrade "🎮 Moteur Propriétaire NextGen"',
    icon: '🎮',
    rewards: { xp: 75, reputation: 15 },
    condition: createUpgradeUnlockCondition('gamingStudio_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_gamingStudio_gain2',
    title: '🏆 Triple A',
    description: 'Débloquer l\'upgrade "🏆 Franchise AAA Mondiale"',
    icon: '🏆',
    rewards: { xp: 165, reputation: 33, money: 550 },
    condition: createUpgradeUnlockCondition('gamingStudio_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_factory_gain1',
    title: '🤖 Automate sans tomate',
    description: 'Débloquer l\'upgrade "🤖 Ligne Robotisée Complète"',
    icon: '🤖',
    rewards: { xp: 90, reputation: 18 },
    condition: createUpgradeUnlockCondition('factory_gain1', 'business'),
  },

  {
    id: 'ach_unlock_business_factory_gain2',
    title: '⚙️ IA supperieur',
    description: 'Débloquer l\'upgrade "⚙️ Intelligence Prédictive IA"',
    icon: '⚙️',
    rewards: { xp: 210, reputation: 42, money: 700 },
    condition: createUpgradeUnlockCondition('factory_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_realityEngine_gain2',
    title: '🎛️ RealityEngine2.0',
    description: 'Débloquer l\'upgrade "🎛️ Simulation Réalité Parfaite"',
    icon: '🎛️',
    rewards: { xp: 1500, reputation: 300, money: 5000 },
    condition: createUpgradeUnlockCondition('realityEngine_gain2', 'business'),
  },

  {
    id: 'ach_unlock_business_foodBeverage_combo',
    title: '🍽️ Synergie Gastronomique',
    description: 'Débloquer l\'upgrade "🍽️ Synergie Gastronomique"',
    icon: '🍽️',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('foodBeverage_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_hospitality_combo',
    title: '🏨 Expension mondiale',
    description: 'Débloquer l\'upgrade "🏨 Réseau Hôtellerie Luxe"',
    icon: '🏨',
    rewards: { xp: 60, reputation: 12 },
    condition: createUpgradeUnlockCondition('hospitality_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_entertainment_combo',
    title: '🎬 Entertainement Combo',
    description: 'Débloquer l\'upgrade "🎬 Empire Divertissement"',
    icon: '🎬',
    rewards: { xp: 120, reputation: 24 },
    condition: createUpgradeUnlockCondition('entertainment_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_tech_combo',
    title: '💻 Écosystème Tech Intégré',
    description: 'Débloquer l\'upgrade "💻 Écosystème Tech Intégré"',
    icon: '💻',
    rewards: { xp: 300, reputation: 60, money: 1000 },
    condition: createUpgradeUnlockCondition('tech_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_megaCorp_combo',
    title: '💎 Synergie Mega-Corporations',
    description: 'Débloquer l\'upgrade "💎 Synergie Mega-Corporations"',
    icon: '💎',
    rewards: { xp: 750, reputation: 150, money: 2500 },
    condition: createUpgradeUnlockCondition('megaCorp_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_civilization_combo',
    title: '🌌 Civilisation Interplanétaire',
    description: 'Débloquer l\'upgrade "🌌 Civilisation Interplanétaire"',
    icon: '🌌',
    rewards: { xp: 1200, reputation: 240, money: 4000 },
    condition: createUpgradeUnlockCondition('civilization_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_innovation_combo',
    title: '🚀 Leaders Innovation Mondiale',
    description: 'Débloquer l\'upgrade "🚀 Leaders Innovation Mondiale"',
    icon: '🚀',
    rewards: { xp: 525, reputation: 105, money: 1750 },
    condition: createUpgradeUnlockCondition('innovation_combo', 'business'),
  },

  {
    id: 'ach_unlock_business_ultimate_combo',
    title: '👑 World Is Mine',
    description: 'Débloquer l\'upgrade "👑 Domination Totale"',
    icon: '👑',
    rewards: { xp: 2250, reputation: 450, money: 7500 },
    condition: createUpgradeUnlockCondition('ultimate_combo', 'business'),
  },

  {
    id: 'ach_unlock_click_training_gloves',
    title: '🥊 Tyson Junior',
    description: 'Débloquer l\'upgrade "🥊 Gants d\'entrainement"',
    icon: '🥊',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('training_gloves', 'click'),
  },

  {
    id: 'ach_unlock_click_better_mouse',
    title: '🖱️ Souris Gaming',
    description: 'Débloquer l\'upgrade "🖱️ Souris Ergonomique"',
    icon: '🖱️',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('better_mouse', 'click'),
  },

  {
    id: 'ach_unlock_click_double_click',
    title: '🖱️🖱️ Double Clic',
    description: 'Débloquer l\'upgrade "🖱️🖱️ Double Clic"',
    icon: '🖱️🖱️',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('double_click', 'click'),
  },

  {
    id: 'ach_unlock_click_mechanical_switch',
    title: '⚙️ Switches Mécaniques',
    description: 'Débloquer l\'upgrade "⚙️ Switches Mécaniques"',
    icon: '⚙️',
    rewards: { xp: 67, reputation: 13 },
    condition: createUpgradeUnlockCondition('mechanical_switch', 'click'),
  },

  {
    id: 'ach_unlock_click_golden_cursor',
    title: '✨ Golden Boy',
    description: 'Débloquer l\'upgrade "✨ Curseur Doré"',
    icon: '✨',
    rewards: { xp: 262, reputation: 52, money: 875 },
    condition: createUpgradeUnlockCondition('golden_cursor', 'click'),
  },

  {
    id: 'ach_unlock_click_diamond_finger',
    title: '💎 Doigt de Diamant',
    description: 'Débloquer l\'upgrade "💎 Doigt de Diamant"',
    icon: '💎',
    rewards: { xp: 1275, reputation: 255, money: 4250 },
    condition: createUpgradeUnlockCondition('diamond_finger', 'click'),
  },

  {
    id: 'ach_unlock_click_infinity_gauntlet',
    title: '🧤 Gantelet de l\'infini',
    description: 'Débloquer l\'upgrade "🧤 Gantelet de l\'infini"',
    icon: '🧤',
    rewards: { xp: 12000, reputation: 2400, money: 40000 },
    condition: createUpgradeUnlockCondition('infinity_gauntlet', 'click'),
  },

  {
    id: 'ach_unlock_click_autoclicker_basic',
    title: '🤖 Auto-Clicker v1.0',
    description: 'Débloquer l\'upgrade "🤖 Auto-Clicker v1.0"',
    icon: '🤖',
    rewards: { xp: 22500, reputation: 4500, money: 75000 },
    condition: createUpgradeUnlockCondition('autoclicker_basic', 'click'),
  },

  {
    id: 'ach_unlock_click_energy_drink',
    title: '⚡ Boisson Énergisante',
    description: 'Débloquer l\'upgrade "⚡ Boisson Énergisante"',
    icon: '⚡',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('energy_drink', 'click'),
  },

  {
    id: 'ach_unlock_click_lucky_charm',
    title: '🍀 Trèfle à 4 feuilles',
    description: 'Débloquer l\'upgrade "🍀 Trèfle à 4 feuilles"',
    icon: '🍀',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('lucky_charm', 'click'),
  },

  {
    id: 'ach_unlock_click_loaded_dice',
    title: '🎲 Dés Pipés',
    description: 'Débloquer l\'upgrade "🎲 Dés Pipés"',
    icon: '🎲',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('loaded_dice', 'click'),
  },

  {
    id: 'ach_unlock_click_sniper_instinct',
    title: '🦅 Instinct de Sniper',
    description: 'Débloquer l\'upgrade "🦅 Instinct de Sniper"',
    icon: '🦅',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('sniper_instinct', 'click'),
  },

  {
    id: 'ach_unlock_click_matrix_code',
    title: '💻 Code de la Matrice',
    description: 'Débloquer l\'upgrade "💻 Code de la Matrice"',
    icon: '💻',
    rewards: { xp: 50, reputation: 10 },
    condition: createUpgradeUnlockCondition('matrix_code', 'click'),
  },

  {
    id: 'ach_unlock_click_click_cascade',
    title: '⚡ Cascade de Clics',
    description: 'Débloquer l\'upgrade "⚡ Cascade de Clics"',
    icon: '⚡',
    rewards: { xp: 52, reputation: 10 },
    condition: createUpgradeUnlockCondition('click_cascade', 'click'),
  },

  {
    id: 'ach_unlock_click_precision_scope',
    title: '🎯 Lunettes de Précision',
    description: 'Débloquer l\'upgrade "🎯 Lunettes de Précision"',
    icon: '🎯',
    rewards: { xp: 75, reputation: 15 },
    condition: createUpgradeUnlockCondition('precision_scope', 'click'),
  },

  {
    id: 'ach_unlock_click_gaming_chair',
    title: '💺 Chaise Gaming',
    description: 'Débloquer l\'upgrade "💺 Chaise Gaming"',
    icon: '💺',
    rewards: { xp: 112, reputation: 22 },
    condition: createUpgradeUnlockCondition('gaming_chair', 'click'),
  },

  {
    id: 'ach_unlock_click_vital_point',
    title: '💥 Point Vital',
    description: 'Débloquer l\'upgrade "💥 Point Vital"',
    icon: '💥',
    rewards: { xp: 150, reputation: 30, money: 500 },
    condition: createUpgradeUnlockCondition('vital_point', 'click'),
  },

  {
    id: 'ach_unlock_click_quantum_click',
    title: '⚛️ Clic Quantique',
    description: 'Débloquer l\'upgrade "⚛️ Clic Quantique"',
    icon: '⚛️',
    rewards: { xp: 375, reputation: 75, money: 1250 },
    condition: createUpgradeUnlockCondition('quantum_click', 'click'),
  },

  {
    id: 'ach_unlock_click_business_momentum',
    title: '💼 Momentum Entrepreneurial',
    description: 'Débloquer l\'upgrade "💼 Momentum Entrepreneurial"',
    icon: '💼',
    rewards: { xp: 1500, reputation: 300, money: 5000 },
    condition: createUpgradeUnlockCondition('business_momentum', 'click'),
  },

  {
    id: 'ach_unlock_click_executive_touch',
    title: '👔 Touch du PDG',
    description: 'Débloquer l\'upgrade "👔 Touch du PDG"',
    icon: '👔',
    rewards: { xp: 9000, reputation: 1800, money: 30000 },
    condition: createUpgradeUnlockCondition('executive_touch', 'click'),
  },

  {
    id: 'ach_unlock_click_reality_clicker',
    title: '♾️ Clicker de Réalité',
    description: 'Débloquer l\'upgrade "♾️ Clicker de Réalité"',
    icon: '♾️',
    rewards: { xp: 75000, reputation: 15000, money: 250000 },
    condition: createUpgradeUnlockCondition('reality_clicker', 'click'),
  },

  {
    id: 'ach_unlock_click_transcendence',
    title: '✨ Transcendance Économique',
    description: 'Débloquer l\'upgrade "✨ Transcendance Économique"',
    icon: '✨',
    rewards: { xp: 150000, reputation: 30000, money: 500000 },
    condition: createUpgradeUnlockCondition('transcendence', 'click'),
  },

  {
    id: 'ach_unlock_click_reputation_clicker',
    title: '⭐ Influenceur Millionnaire',
    description: 'Débloquer l\'upgrade "⭐ Influenceur Millionnaire"',
    icon: '⭐',
    rewards: { xp: 2250, reputation: 450, money: 7500 },
    condition: createUpgradeUnlockCondition('reputation_clicker', 'click'),
  },

  {
    id: 'ach_unlock_click_prestige_multiplier',
    title: '🌟 Multiplicateur de Prestige',
    description: 'Débloquer l\'upgrade "🌟 Multiplicateur de Prestige"',
    icon: '🌟',
    rewards: { xp: 18000, reputation: 3600, money: 60000 },
    condition: createUpgradeUnlockCondition('prestige_multiplier', 'click'),
  },

  {
    id: 'ach_unlock_click_passive_clicker',
    title: '💰 Dividendes par Clic',
    description: 'Débloquer l\'upgrade "💰 Dividendes par Clic"',
    icon: '💰',
    rewards: { xp: 270, reputation: 54, money: 900 },
    condition: createUpgradeUnlockCondition('passive_clicker', 'click'),
  },

  {
    id: 'ach_unlock_click_empire_synergy',
    title: '🏰 Synergie d\'empire',
    description: 'Débloquer l\'upgrade "🏰 Synergie d\'empire"',
    icon: '🏰',
    rewards: { xp: 750, reputation: 150, money: 2500 },
    condition: createUpgradeUnlockCondition('empire_synergy', 'click'),
  },

  {
    id: 'ach_unlock_click_cosmic_clicker',
    title: '🌌 Clicker Cosmique',
    description: 'Débloquer l\'upgrade "🌌 Clicker Cosmique"',
    icon: '🌌',
    rewards: { xp: 3750, reputation: 750, money: 12500 },
    condition: createUpgradeUnlockCondition('cosmic_clicker', 'click'),
  },

  {
    id: 'ach_unlock_click_omnipotent_touch',
    title: '🎛️ Touch Omnipotente',
    description: 'Débloquer l\'upgrade "🎛️ Touch Omnipotente"',
    icon: '🎛️',
    rewards: { xp: 22500, reputation: 4500, money: 75000 },
    condition: createUpgradeUnlockCondition('omnipotent_touch', 'click'),
  },


];
