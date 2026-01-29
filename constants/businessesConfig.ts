/**
 * Configuration de tous les businesses du jeu
 * Chaque business a un revenu de base et un coût de base
 * Le coût augmente avec un multiplicateur à chaque achat
 */

export interface BusinessConfig {
  id: string;
  name: string;
  emoji: string;
  baseIncome: number; // Revenu par seconde (avant upgrades)
  baseCost: number; // Prix du premier achat
  costMultiplier: number; // Multiplicateur de coût à chaque achat
}

export const BUSINESSES_CONFIG: Record<string, BusinessConfig> = {
  coffeeMachine: {
    id: 'coffeeMachine',
    name: 'Machine à Café',
    emoji: '☕',
    baseIncome: 5,
    baseCost: 850,
    costMultiplier: 1.15,
  },
  foodTruck: {
    id: 'foodTruck',
    name: 'Food Truck',
    emoji: '🍕',
    baseIncome: 20,
    baseCost: 5000,
    costMultiplier: 1.15,
  },
  smallShop: {
    id: 'smallShop',
    name: 'Petit Magasin',
    emoji: '🏪',
    baseIncome: 40,
    baseCost: 10000,
    costMultiplier: 1.15,
  },
  airbnb: {
    id: 'airbnb',
    name: 'Airbnb',
    emoji: '🏠',
    baseIncome: 150,
    baseCost: 17850,
    costMultiplier: 1.15,
  },
  library: {
    id: 'library',
    name: 'Librairie',
    emoji: '📚',
    baseIncome: 210,
    baseCost: 30000,
    costMultiplier: 1.15,
  },
  gym: {
    id: 'gym',
    name: 'Salle de Sport',
    emoji: '🏋️',
    baseIncome: 450,
    baseCost: 75000,
    costMultiplier: 1.15,
  },
  cinema: {
    id: 'cinema',
    name: 'Cinéma',
    emoji: '🎬',
    baseIncome: 900,
    baseCost: 150000,
    costMultiplier: 1.15,
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    emoji: '🍽️',
    baseIncome: 1500,
    baseCost: 300000,
    costMultiplier: 1.15,
  },
  hotel: {
    id: 'hotel',
    name: 'Hôtel',
    emoji: '🏨',
    baseIncome: 3000,
    baseCost: 500000,
    costMultiplier: 1.15,
  },
  gamingStudio: {
    id: 'gamingStudio',
    name: 'Gaming Studio',
    emoji: '🎮',
    baseIncome: 4500,
    baseCost: 750000,
    costMultiplier: 1.15,
  },
  factory: {
    id: 'factory',
    name: 'Usine',
    emoji: '🏭',
    baseIncome: 8000,
    baseCost: 1500000,
    costMultiplier: 1.15,
  },
  hospital: {
    id: 'hospital',
    name: 'Hôpital',
    emoji: '🏥',
    baseIncome: 12000,
    baseCost: 3000000,
    costMultiplier: 1.15,
  },
  techStartup: {
    id: 'techStartup',
    name: 'Tech Startup',
    emoji: '📱',
    baseIncome: 22000,
    baseCost: 5000000,
    costMultiplier: 1.15,
  },
  themePark: {
    id: 'themePark',
    name: "Parc d'attractions",
    emoji: '🎪',
    baseIncome: 50000,
    baseCost: 10000000,
    costMultiplier: 1.15,
  },
  autoDealer: {
    id: 'autoDealer',
    name: 'Concession Auto',
    emoji: '🚗',
    baseIncome: 90000,
    baseCost: 15000000,
    costMultiplier: 1.15,
  },
  cryptoFarm: {
    id: 'cryptoFarm',
    name: 'Crypto Farm',
    emoji: '⛏️',
    baseIncome: 200000,
    baseCost: 50000000,
    costMultiplier: 1.15,
  },
  techCorp: {
    id: 'techCorp',
    name: 'Tech Corp',
    emoji: '🖥️',
    baseIncome: 500000,
    baseCost: 100000000,
    costMultiplier: 1.15,
  },
  spaceX: {
    id: 'spaceX',
    name: 'SpaceX',
    emoji: '🚀',
    baseIncome: 660000,
    baseCost: 250000000,
    costMultiplier: 1.15,
  },
  bank: {
    id: 'bank',
    name: 'Bank',
    emoji: '💰',
    baseIncome: 990000,
    baseCost: 500000000,
    costMultiplier: 1.15,
  },
  globalCorp: {
    id: 'globalCorp',
    name: 'Global Corporation',
    emoji: '🌍',
    baseIncome: 120000,
    baseCost: 1000000000,
    costMultiplier: 1.15,
  },
} as const;

// Helper pour obtenir la liste ordonnée
export const BUSINESSES_LIST = Object.values(BUSINESSES_CONFIG);

// Type helper
export type BusinessId = keyof typeof BUSINESSES_CONFIG;
