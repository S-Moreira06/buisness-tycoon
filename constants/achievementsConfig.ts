import { Achievement, GameState } from '@/types/game';

// Helper pour formater les gros chiffres (optionnel, pour les descriptions)
const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;

export const ACHIEVEMENTS: Achievement[] = [
  // --- 🖱️ CATÉGORIE : CLICKER (L'effort physique) ---
  {
    id: 'first_steps',
    title: 'Premiers Pas',
    description: 'Effectuer 10 clics manuels',
    icon: '👆',
    rewards: { reputation: 5, xp: 10 },
    condition: (state: GameState) => state.stats.totalClicks >= 10,
  },
  {
    id: 'click_novice',
    title: 'Échauffement',
    description: 'Effectuer 100 clics manuels',
    icon: '👆',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalClicks >= 100,
  },
  {
    id: 'click_master',
    title: 'Doigts de Fée',
    description: 'Effectuer 1 000 clics manuels',
    icon: '🖐️',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalClicks >= 1000,
  },
  {
    id: 'click_robot',
    title: 'Est-ce un bot ?',
    description: 'Atteindre 10 000 clics manuels',
    icon: '🤖',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalClicks >= 10000,
  },
  {
    id: 'crit_luck',
    title: 'Coup de Chance',
    description: 'Réaliser 50 clics critiques',
    icon: '⚡',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalCriticalClicks >= 50,
  },

  // --- 💰 CATÉGORIE : FORTUNE (Accumulation) ---
  
  
  {
    id: 'small_saver',
    title: 'Petit Économe',
    description: 'Avoir 1 000 $ en banque',
    icon: '💰',
    rewards: { reputation: 5, xp: 10 },
    condition: (state: GameState) => state.money >= 1000,
  },
  {
    id: 'money_saver',
    title: 'Tirelire Pleine',
    description: 'Avoir 10 000 $ en banque',
    icon: '🐷',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.money >= 10000,
  },
  {
    id: 'money_rich',
    title: 'Nouveau Riche',
    description: 'Accumuler un total de 1 Million $ (Carrière)',
    icon: '💵',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalMoneyEarned >= 1000000,
  },
  {
    id: 'money_tycoon',
    title: 'Multimillionnaire',
    description: 'Posséder 10 Millions $ sur le compte',
    icon: '🏦',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.money >= 10000000,
  },
  {
    id: 'money_billionaire',
    title: 'Club des 3 Virgules',
    description: 'Gagner 1 Milliard $ au total',
    icon: '🚀',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalMoneyEarned >= 1000000000,
  },

  // --- 🏢 CATÉGORIE : EMPIRE (Business) ---
  {
    id: 'biz_first',
    title: 'Premier Investissement',
    description: 'Acheter votre premier business',
    icon: '🍋',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.businessesBought >= 1,
  },
  {
    id: 'manager',
    title: 'Manager',
    description: 'Posséder 5 business différents',
    icon: '🏢',
    rewards: { reputation: 5, xp: 10 },
    condition: (state: GameState) => 
      Object.values(state.businesses).filter(b => b.owned).length >= 5,
  },
  {
    id: 'gestionnaire',
    title: 'Gestionnaire',
    description: 'Posséder 5 business différents',
    icon: '🏢',
    rewards: { reputation: 5, xp: 10 },
    condition: (state: GameState) => 
      Object.values(state.businesses).filter(b => b.owned).length >= 5,
  },
  {
    id: 'biz_expander',
    title: 'Expansion Rapide',
    description: 'Posséder 50 business au total',
    icon: '🏗️',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => 
      Object.values(s.businesses).reduce((acc, b) => acc + (b.quantity || 0), 0) >= 50,
  },
  {
    id: 'biz_monopoly',
    title: 'Monopole',
    description: 'Posséder au moins 1 exemplaire de CHAQUE business',
    icon: '🎩',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => 
      Object.values(s.businesses).every(b => b.owned), // Suppose que tous les business sont dans l'objet
  },
  {
    id: 'biz_level_100',
    title: 'Optimisation Maximale',
    description: 'Monter un business au niveau 100',
    icon: '📈',
    // On vérifie si AU MOINS UN business a level >= 100
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => 
      Object.values(s.businesses).some(b => b.level >= 100),
  },
  {
    id: 'big_spender',
    title: 'Flambeur',
    description: 'Dépenser un total de 1 000 000 $',
    icon: '💸',
    rewards: { reputation: 5, xp: 10 },
    condition: (state: GameState) => state.stats.totalMoneySpent >= 1000000,
  },

  // --- ⚙️ CATÉGORIE : AMÉLIORATIONS (Upgrades) ---
  {
    id: 'tech_start',
    title: 'R&D Débutant',
    description: 'Acheter 5 améliorations',
    icon: '🧪',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.upgradesPurchased >= 5,
  },
  {
    id: 'tech_guru',
    title: 'Visionnaire',
    description: 'Acheter 20 améliorations',
    icon: '🧠',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.upgradesPurchased >= 20,
  },

  // --- ⏳ CATÉGORIE : DÉVOUEMENT (Temps de jeu) ---
  {
    id: 'time_addict',
    title: 'Accro',
    description: 'Jouer pendant 1 heure (temps actif)',
    icon: '⏳',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalPlayTime >= 3600, // 3600 secondes
  },
  {
    id: 'time_nolife',
    title: 'PDG à plein temps',
    description: 'Jouer pendant 24 heures cumulées',
    icon: '🌙',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.stats.totalPlayTime >= 86400,
  },

  // --- ⭐ CATÉGORIE : RÉPUTATION ---
  {
    id: 'rep_known',
    title: 'Influenceur Local',
    description: 'Atteindre 1 000 de Réputation',
    icon: '✨',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.reputation >= 1000,
  },
  {
    id: 'rep_boss',
    title: 'Le Parrain',
    description: 'Atteindre 100 000 de Réputation',
    icon: '🕶️',
    rewards: { reputation: 5, xp: 10 },
    condition: (s: GameState) => s.reputation >= 100000,
  }
];

