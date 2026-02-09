/**
 * Configuration de tous les businesses du jeu
 * Chaque business a un revenu de base et un coût de base
 * Le coût augmente avec un multiplicateur à chaque achat
 */

import { BusinessConfig } from "@/types/business";


export const BUSINESSES_CONFIG: Record<string, BusinessConfig> = {
  coffeeMachine: {
    id: 'coffeeMachine',
    name: 'Machine à Café',
    emoji: '☕',
    baseIncome: 4.2,           // ✅ ROI = 5min (1250 / 300s)
    baseCost: 1250,
    costMultiplier: 1.15,
  },
  foodTruck: {
    id: 'foodTruck',
    name: 'Food Truck',
    emoji: '🍕',
    baseIncome: 7.6,           // ✅ ROI = 11min (5000 / 660s)
    baseCost: 5000,
    costMultiplier: 1.2,
    unlockLevel: 10
  },
  smallShop: {
    id: 'smallShop',
    name: 'Petit Magasin',
    emoji: '🏪',
    baseIncome: 9.8,           // ✅ ROI = 17min (10000 / 1020s)
    baseCost: 10000,
    costMultiplier: 1.25,
    unlockLevel: 11
  },
  airbnb: {
    id: 'airbnb',
    name: 'Airbnb',
    emoji: '🏠',
    baseIncome: 12.9,          // ✅ ROI = 23min (17850 / 1380s)
    baseCost: 17850,
    costMultiplier: 1.3,
    unlockLevel: 12
  },
  library: {
    id: 'library',
    name: 'Librairie',
    emoji: '📚',
    baseIncome: 17.2,          // ✅ ROI = 29min (30000 / 1740s)
    baseCost: 30000,
    costMultiplier: 1.35,
    unlockLevel: 15
  },
  gym: {
    id: 'gym',
    name: 'Salle de Sport',
    emoji: '🏋️',
    baseIncome: 35.7,          // ✅ ROI = 35min (75000 / 2100s)
    baseCost: 75000,
    costMultiplier: 1.4,
    unlockLevel: 15
  },
  cinema: {
    id: 'cinema',
    name: 'Cinéma',
    emoji: '🎬',
    baseIncome: 61.0,          // ✅ ROI = 41min (150000 / 2460s)
    baseCost: 150000,
    costMultiplier: 1.45,
    unlockLevel: 15
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    emoji: '🍽️',
    baseIncome: 106.4,         // ✅ ROI = 47min (300000 / 2820s)
    baseCost: 300000,
    costMultiplier: 1.5,
    unlockLevel: 20
  },
  hotel: {
    id: 'hotel',
    name: 'Hôtel',
    emoji: '🏨',
    baseIncome: 157.2,         // ✅ ROI = 53min (500000 / 3180s)
    baseCost: 500000,
    costMultiplier: 1.55,
    unlockLevel: 25
  },
  gamingStudio: {
    id: 'gamingStudio',
    name: 'Gaming Studio',
    emoji: '🎮',
    baseIncome: 218.8,         // ✅ ROI = 59min (750000 / 3540s)
    baseCost: 750000,
    costMultiplier: 1.6,
    unlockLevel: 25
  },
  factory: {
    id: 'factory',
    name: 'Usine',
    emoji: '🏭',
    baseIncome: 384.6,         // ✅ ROI = 65min (1500000 / 3900s)
    baseCost: 1500000,
    costMultiplier: 1.65,
    unlockLevel: 30
  },
  hospital: {
    id: 'hospital',
    name: 'Hôpital',
    emoji: '🏥',
    baseIncome: 706.2,         // ✅ ROI = 71min (3000000 / 4260s)
    baseCost: 3000000,
    costMultiplier: 1.7,
    unlockLevel: 30
  },
  techStartup: {
    id: 'techStartup',
    name: 'Tech Startup',
    emoji: '📱',
    baseIncome: 1083.7,        // ✅ ROI = 77min (5000000 / 4620s)
    baseCost: 5000000,
    costMultiplier: 1.75,
    unlockLevel: 30
  },
  themePark: {
    id: 'themePark',
    name: "Parc d'attractions",
    emoji: '🎪',
    baseIncome: 2008.0,        // ✅ ROI = 83min (10000000 / 4980s)
    baseCost: 10000000,
    costMultiplier: 1.8,
    unlockLevel: 40
  },
  autoDealer: {
    id: 'autoDealer',
    name: 'Concession Auto',
    emoji: '🚗',
    baseIncome: 2803.7,        // ✅ ROI = 89min (15000000 / 5340s)
    baseCost: 15000000,
    costMultiplier: 1.85,
    unlockLevel: 40
  },
  cryptoFarm: {
    id: 'cryptoFarm',
    name: 'Crypto Farm',
    emoji: '⛏️',
    baseIncome: 8771.9,        // ✅ ROI = 95min (50000000 / 5700s)
    baseCost: 50000000,
    costMultiplier: 1.9,
    unlockLevel:40
  },
  techCorp: {
    id: 'techCorp',
    name: 'Tech Corp',
    emoji: '🖥️',
    baseIncome: 16447.4,       // ✅ ROI = 101min (100000000 / 6060s)
    baseCost: 100000000,
    costMultiplier: 1.95,
    unlockLevel:50
  },
  spaceX: {
    id: 'spaceX',
    name: 'SpaceX',
    emoji: '🚀',
    baseIncome: 39088.7,       // ✅ ROI = 107min (250000000 / 6420s)
    baseCost: 250000000,
    costMultiplier: 1.95,
    unlockLevel:50
  },
  bank: {
    id: 'bank',
    name: 'Bank',
    emoji: '💰',
    baseIncome: 73529.4,       // ✅ ROI = 113min (500000000 / 6780s)
    baseCost: 500000000,
    costMultiplier: 2.0,
    unlockLevel:50

  },
  globalCorp: {
    id: 'globalCorp',
    name: 'Global Corporation',
    emoji: '🌍',
    baseIncome: 138888.9,      // ✅ ROI = 120min (1000000000 / 7200s)
    baseCost: 1000000000,
    costMultiplier: 2.2,       // ✅ Garde 2.2 (c'est voulu)
    unlockLevel:55
  },
    // ========== TIER 3 : MEGA CORPORATIONS (21-30) ==========
  
  pharmaGiant: {
    id: 'pharmaGiant',
    name: 'Pharma Giant',
    emoji: '💊',
    baseIncome: 196850.4,      // ROI = 126min (2500000000 / 7560s)
    baseCost: 2500000000,       // 2.5 Milliards
    costMultiplier: 2.25,
    unlockLevel:60
  },
  
  oilEmpire: {
    id: 'oilEmpire',
    name: 'Oil Empire',
    emoji: '🛢️',
    baseIncome: 378787.9,      // ROI = 132min (5000000000 / 7920s)
    baseCost: 5000000000,       // 5 Milliards
    costMultiplier: 2.3,
    unlockLevel:62
  },
  
  mediaConglomerate: {
    id: 'mediaConglomerate',
    name: 'Media Conglomerate',
    emoji: '📡',
    baseIncome: 714285.7,      // ROI = 138min (10000000000 / 8280s)
    baseCost: 10000000000,      // 10 Milliards
    costMultiplier: 2.35,
    unlockLevel:64
  },
  
  luxuryBrand: {
    id: 'luxuryBrand',
    name: 'Luxury Brand',
    emoji: '💎',
    baseIncome: 1162790.7,     // ROI = 144min (20000000000 / 8640s)
    baseCost: 20000000000,      // 20 Milliards
    costMultiplier: 2.4,
    unlockLevel:66
  },
  
  socialNetwork: {
    id: 'socialNetwork',
    name: 'Social Network',
    emoji: '📱',
    baseIncome: 2222222.2,     // ROI = 150min (40000000000 / 9000s)
    baseCost: 40000000000,      // 40 Milliards
    costMultiplier: 2.45,
    unlockLevel:68
  },
  
  aiResearch: {
    id: 'aiResearch',
    name: 'AI Research Lab',
    emoji: '🤖',
    baseIncome: 4285714.3,     // ROI = 156min (80000000000 / 9360s)
    baseCost: 80000000000,      // 80 Milliards
    costMultiplier: 2.5,
    unlockLevel:70
  },
  
  quantumComputing: {
    id: 'quantumComputing',
    name: 'Quantum Computing',
    emoji: '⚛️',
    baseIncome: 8247422.7,     // ROI = 162min (160000000000 / 9720s)
    baseCost: 160000000000,     // 160 Milliards
    costMultiplier: 2.55,
    unlockLevel:73
  },
  
  satelliteNetwork: {
    id: 'satelliteNetwork',
    name: 'Satellite Network',
    emoji: '🛰️',
    baseIncome: 15873015.9,    // ROI = 168min (320000000000 / 10080s)
    baseCost: 320000000000,     // 320 Milliards
    costMultiplier: 2.6,
    unlockLevel:76
  },
  
  nuclearPlant: {
    id: 'nuclearPlant',
    name: 'Nuclear Plant',
    emoji: '☢️',
    baseIncome: 30555555.6,    // ROI = 174min (640000000000 / 10440s)
    baseCost: 640000000000,     // 640 Milliards
    costMultiplier: 2.65,unlockLevel:80
  },
  
  underwaterCity: {
    id: 'underwaterCity',
    name: 'Underwater City',
    emoji: '🌊',
    baseIncome: 58823529.4,    // ROI = 180min (1280000000000 / 10800s)
    baseCost: 1280000000000,    // 1.28 Trillions
    costMultiplier: 2.7,
    unlockLevel:85
  },

  // ========== TIER 4 : CIVILIZATION SCALE (31-40) ==========
  
  moonBase: {
    id: 'moonBase',
    name: 'Moon Base',
    emoji: '🌙',
    baseIncome: 113227513.2,   // ROI = 186min (2560000000000 / 11160s)
    baseCost: 2560000000000,    // 2.56 Trillions
    costMultiplier: 2.75,
    unlockLevel:90
  },
  
  marsColony: {
    id: 'marsColony',
    name: 'Mars Colony',
    emoji: '🔴',
    baseIncome: 217687074.8,   // ROI = 192min (5120000000000 / 11520s)
    baseCost: 5120000000000,    // 5.12 Trillions
    costMultiplier: 2.8,
    unlockLevel:90
  },
  
  asteroidMining: {
    id: 'asteroidMining',
    name: 'Asteroid Mining',
    emoji: '☄️',
    baseIncome: 418367346.9,   // ROI = 198min (10240000000000 / 11880s)
    baseCost: 10240000000000,   // 10.24 Trillions
    costMultiplier: 2.85,unlockLevel:90
  },
  
  fusionReactor: {
    id: 'fusionReactor',
    name: 'Fusion Reactor',
    emoji: '⚡',
    baseIncome: 804597701.1,   // ROI = 204min (20480000000000 / 12240s)
    baseCost: 20480000000000,   // 20.48 Trillions
    costMultiplier: 2.9,unlockLevel:90
  },
  
  spaceElevator: {
    id: 'spaceElevator',
    name: 'Space Elevator',
    emoji: '🏗️',
    baseIncome: 1546938775.5,  // ROI = 210min (40960000000000 / 12600s)
    baseCost: 40960000000000,   // 40.96 Trillions
    costMultiplier: 2.95,unlockLevel:90
  },
  
  dysonSphere: {
    id: 'dysonSphere',
    name: 'Dyson Sphere',
    emoji: '☀️',
    baseIncome: 2974603174.6,  // ROI = 216min (81920000000000 / 12960s)
    baseCost: 81920000000000,   // 81.92 Trillions
    costMultiplier: 3.0,unlockLevel:90
  },
  
  wormholeGate: {
    id: 'wormholeGate',
    name: 'Wormhole Gate',
    emoji: '🌀',
    baseIncome: 5722891566.3,  // ROI = 222min (163840000000000 / 13320s)
    baseCost: 163840000000000,  // 163.84 Trillions
    costMultiplier: 3.1,unlockLevel:90
  },
  
  timeLabyrinth: {
    id: 'timeLabyrinth',
    name: 'Time Labyrinth',
    emoji: '⏳',
    baseIncome: 11008163265.3, // ROI = 228min (327680000000000 / 13680s)
    baseCost: 327680000000000,  // 327.68 Trillions
    costMultiplier: 3.2,unlockLevel:90
  },
  
  multiverseHub: {
    id: 'multiverseHub',
    name: 'Multiverse Hub',
    emoji: '🌌',
    baseIncome: 21168091168.1, // ROI = 234min (655360000000000 / 14040s)
    baseCost: 655360000000000,  // 655.36 Trillions
    costMultiplier: 3.3,unlockLevel:90
  },
  
  realityEngine: {
    id: 'realityEngine',
    name: 'Reality Engine',
    emoji: '♾️',
    baseIncome: 40695652173.9, // ROI = 239min (1310720000000000 / 14340s)
    baseCost: 1310720000000000, // 1.31 Quadrillions
    costMultiplier: 3.5,unlockLevel:90
  },

} as const;

// Helper pour obtenir la liste ordonnée
export const BUSINESSES_LIST = Object.values(BUSINESSES_CONFIG);

// 🆕 Helper : Obtenir les businesses débloqués
export const getUnlockedBusinesses = (playerLevel: number): BusinessConfig[] => {
  return Object.values(BUSINESSES_CONFIG).filter(
    (business) => !business.unlockLevel || playerLevel >= business.unlockLevel
  );
};

// 🆕 Helper : Obtenir le prochain business à débloquer
export const getNextLockedBusiness = (playerLevel: number): BusinessConfig | null => {
  const lockedBusinesses = Object.values(BUSINESSES_CONFIG)
    .filter((business) => business.unlockLevel && playerLevel < business.unlockLevel)
    .sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
  
  return lockedBusinesses[0] || null;
};

// Type helper
export type BusinessId = keyof typeof BUSINESSES_CONFIG;

/**
 * Calcule le prix d'achat d'un business en fonction de la quantité possédée
 * Formule : baseCost × (costMultiplier ^ quantity)
 * 
 * @param baseCost - Prix de base du business
 * @param costMultiplier - Multiplicateur de coût (ex: 1.15 = +15% par achat)
 * @param currentQuantity - Nombre d'exemplaires déjà possédés
 * @returns Prix du prochain achat
 */
export const calculateBusinessPrice = (
  baseCost: number,
  costMultiplier: number,
  currentQuantity: number
): number => {
  return Math.floor(baseCost * Math.pow(costMultiplier, currentQuantity));
};
