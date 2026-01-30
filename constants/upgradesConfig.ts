/**
 * Configuration de tous les upgrades du jeu
 * Système de progression par tiers avec coûts exponentiels
 * Multiplicateurs variés pour plus de stratégie
 */
import type { TierType } from './tierConfig';

export interface UpgradeConfig {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  multiplier: number;
  tier: TierType;
  affectedBusinesses: string[];
}

export const UPGRADES_CONFIG: Record<string, UpgradeConfig> = {
  // ========== TIER BRONZE (Débuts) ==========
  
  // ☕ MACHINE À CAFÉ
  coffeeMachine_gain1: {
    id: 'coffeeMachine_gain1',
    name: '☕ Grains Arabica Premium',
    description: 'Importation directe d\'Éthiopie des meilleurs grains d\'arabica. Arômes subtils et notes fruitées qui fidélisent la clientèle matinale.',
    reputationCost: 30,
    multiplier: 1.15,
    tier: 'bronze',
    affectedBusinesses: ['coffeeMachine'],
  },

  coffeeMachine_gain2: {
    id: 'coffeeMachine_gain2',
    name: '🌟 Formation Barista Pro',
    description: 'Formation intensive par champions de latte art. Chaque café devient une œuvre d\'art qui attire les réseaux sociaux et multiplie les clients.',
    reputationCost: 80,
    multiplier: 1.25,
    tier: 'silver',
    affectedBusinesses: ['coffeeMachine'],
  },

  // 🍕 FOOD TRUCK
  foodTruck_gain1: {
    id: 'foodTruck_gain1',
    name: '🍕 Recettes Artisanales',
    description: 'Pâtes fraîches maison et ingrédients bio locaux. Votre food truck devient une référence gastronomique sur roues.',
    reputationCost: 50,
    multiplier: 1.2,
    tier: 'bronze',
    affectedBusinesses: ['foodTruck'],
  },

  foodTruck_gain2: {
    id: 'foodTruck_gain2',
    name: '⭐ Four à Pierre Mobile',
    description: 'Installation d\'un four traditionnel à 450°C. Cuisson parfaite en 90 secondes, files d\'attente multipliées par 3.',
    reputationCost: 150,
    multiplier: 1.35,
    tier: 'silver',
    affectedBusinesses: ['foodTruck'],
  },

  // 🏪 PETIT MAGASIN
  smallShop_gain1: {
    id: 'smallShop_gain1',
    name: '🏪 Gamme Bio Exclusive',
    description: 'Partenariat avec producteurs locaux. 80% de produits bio certifiés qui attirent une clientèle premium soucieuse de qualité.',
    reputationCost: 40,
    multiplier: 1.15,
    tier: 'bronze',
    affectedBusinesses: ['smallShop'],
  },

  smallShop_gain2: {
    id: 'smallShop_gain2',
    name: '🌐 E-commerce + Click & Collect',
    description: 'Site web avec livraison 1h et retrait en magasin. Augmentation de 60% du chiffre d\'affaires via les ventes en ligne.',
    reputationCost: 120,
    multiplier: 1.3,
    tier: 'silver',
    affectedBusinesses: ['smallShop'],
  },

  // ========== TIER SILVER (Développement) ==========

  // 🏠 AIRBNB
  airbnb_gain1: {
    id: 'airbnb_gain1',
    name: '🏠 Design d\'Intérieur Luxe',
    description: 'Collaboration avec architectes d\'intérieur renommés. Mobilier designer et décoration Instagram-worthy qui font grimper les avis 5 étoiles.',
    reputationCost: 100,
    multiplier: 1.25,
    tier: 'silver',
    affectedBusinesses: ['airbnb'],
  },

  airbnb_gain2: {
    id: 'airbnb_gain2',
    name: '🌍 Conciergerie Premium 24/7',
    description: 'Service concierge multilingue, check-in automatique et expériences VIP personnalisées. Taux d\'occupation à 95%.',
    reputationCost: 250,
    multiplier: 1.4,
    tier: 'gold',
    affectedBusinesses: ['airbnb'],
  },

  // 📚 LIBRAIRIE
  library_gain1: {
    id: 'library_gain1',
    name: '📚 Section Premières Éditions',
    description: 'Collection de livres rares et dédicacés. Attire collectionneurs et bibliophiles prêts à payer le prix fort.',
    reputationCost: 60,
    multiplier: 1.2,
    tier: 'bronze',
    affectedBusinesses: ['library'],
  },

  library_gain2: {
    id: 'library_gain2',
    name: '🎭 Club de Lecture Exclusif',
    description: 'Rencontres mensuelles avec auteurs bestsellers et espaces coworking premium. Abonnements récurrents garantis.',
    reputationCost: 180,
    multiplier: 1.35,
    tier: 'silver',
    affectedBusinesses: ['library'],
  },

  // 🏋️ SALLE DE GYM
  gym_gain1: {
    id: 'gym_gain1',
    name: '🏋️ Équipement Technogym',
    description: 'Machines connectées avec programmes personnalisés par IA. Chaque membre a son app dédiée avec suivi en temps réel.',
    reputationCost: 120,
    multiplier: 1.25,
    tier: 'silver',
    affectedBusinesses: ['gym'],
  },

  gym_gain2: {
    id: 'gym_gain2',
    name: '💪 Coaches Olympiques',
    description: 'Recrutement d\'anciens athlètes olympiques comme coachs premium. Files d\'attente pour les sessions privées.',
    reputationCost: 280,
    multiplier: 1.45,
    tier: 'gold',
    affectedBusinesses: ['gym'],
  },

  // ========== TIER GOLD (Expansion) ==========

  // 🎬 CINÉMA
  cinema_gain1: {
    id: 'cinema_gain1',
    name: '🎬 Salles IMAX & 4DX',
    description: 'Écrans géants 21m et sièges dynamiques avec effets eau, vent et odeurs. L\'expérience ultime qui justifie des tarifs premium +50%.',
    reputationCost: 200,
    multiplier: 1.3,
    tier: 'gold',
    affectedBusinesses: ['cinema'],
  },

  cinema_gain2: {
    id: 'cinema_gain2',
    name: '🍿 Loges VIP & Gastronomie',
    description: 'Salles privées 20 places avec canapés cuir, service champagne et menu gastronomique. Tarif 100€/place avec réservations 3 mois à l\'avance.',
    reputationCost: 450,
    multiplier: 1.5,
    tier: 'platinum',
    affectedBusinesses: ['cinema'],
  },

  // 🍽️ RESTAURANT
  restaurant_gain1: {
    id: 'restaurant_gain1',
    name: '🍽️ Chef Étoilé Michelin',
    description: 'Recrutement d\'un chef 2 étoiles Michelin. Menu gastronomique qui attire les critiques culinaires et influence les réservations pendant 6 mois.',
    reputationCost: 300,
    multiplier: 1.4,
    tier: 'gold',
    affectedBusinesses: ['restaurant'],
  },

  restaurant_gain2: {
    id: 'restaurant_gain2',
    name: '⭐ Table du Chef & Menu Dégustation',
    description: '12 services avec accords mets-vins sélectionnés. Expérience immersive 4h qui se réserve 8 mois à l\'avance à 500€/personne.',
    reputationCost: 700,
    multiplier: 1.6,
    tier: 'platinum',
    affectedBusinesses: ['restaurant'],
  },

  // 🏨 HÔTEL
  hotel_gain1: {
    id: 'hotel_gain1',
    name: '🏨 Suites Panoramiques',
    description: 'Rénovation complète avec suites 150m² vue mer/montagne, baies vitrées 360° et domotique intelligente. Tarif moyen +150%.',
    reputationCost: 350,
    multiplier: 1.35,
    tier: 'gold',
    affectedBusinesses: ['hotel'],
  },

  hotel_gain2: {
    id: 'hotel_gain2',
    name: '🌟 Spa Thermal & Wellness',
    description: 'Spa 2000m² avec sources thermales, hammam, sauna finlandais et massages signature. Package wellness 3 jours à 2500€.',
    reputationCost: 800,
    multiplier: 1.65,
    tier: 'platinum',
    affectedBusinesses: ['hotel'],
  },

  // ========== TIER PLATINUM (Empire) ==========

  // 🎮 GAMING STUDIO
  gamingStudio_gain1: {
    id: 'gamingStudio_gain1',
    name: '🎮 Moteur Propriétaire NextGen',
    description: 'Développement moteur graphique révolutionnaire avec ray-tracing en temps réel et physique ultra-réaliste. Licences vendues à d\'autres studios.',
    reputationCost: 500,
    multiplier: 1.4,
    tier: 'platinum',
    affectedBusinesses: ['gamingStudio'],
  },

  gamingStudio_gain2: {
    id: 'gamingStudio_gain2',
    name: '🏆 Franchise AAA Mondiale',
    description: 'Lancement saga multi-plateforme avec lore expansif. 20M de copies vendues en pre-order, contrats e-sport et merchandising.',
    reputationCost: 1200,
    multiplier: 1.8,
    tier: 'diamond',
    affectedBusinesses: ['gamingStudio'],
  },

  // 🏭 USINE
  factory_gain1: {
    id: 'factory_gain1',
    name: '🤖 Ligne Robotisée Complète',
    description: 'Automatisation totale avec 500 robots collaboratifs. Production 24/7 sans interruption, zéro défaut qualité, capacité +300%.',
    reputationCost: 600,
    multiplier: 1.45,
    tier: 'platinum',
    affectedBusinesses: ['factory'],
  },

  factory_gain2: {
    id: 'factory_gain2',
    name: '⚙️ Intelligence Prédictive IA',
    description: 'Système IA qui anticipe les pannes, optimise les stocks et ajuste la production en temps réel. Économies 40% + productivité +60%.',
    reputationCost: 1400,
    multiplier: 1.9,
    tier: 'diamond',
    affectedBusinesses: ['factory'],
  },

  // 🏥 HÔPITAL
  hospital_gain1: {
    id: 'hospital_gain1',
    name: '🏥 Plateau Technique de Pointe',
    description: 'IRM 7 Tesla, scanner 256 barrettes, robot chirurgical Da Vinci Xi. Capacité diagnostic +200%, interventions complexes multipliées.',
    reputationCost: 700,
    multiplier: 1.5,
    tier: 'platinum',
    affectedBusinesses: ['hospital'],
  },

  hospital_gain2: {
    id: 'hospital_gain2',
    name: '⚕️ Pôle Excellence Mondiale',
    description: 'Recrutement 50 médecins leaders mondiaux, recherche médicale et essais cliniques. Patients internationaux avec tarifs premium.',
    reputationCost: 1600,
    multiplier: 2.0,
    tier: 'diamond',
    affectedBusinesses: ['hospital'],
  },

  // 💻 TECH STARTUP
  techStartup_gain1: {
    id: 'techStartup_gain1',
    name: '💻 Dream Team Silicon Valley',
    description: 'Recrutement top 1% ingénieurs ex-GAFAM. Stack technique de pointe, culture startup d\'élite, vélocité de développement x5.',
    reputationCost: 550,
    multiplier: 1.4,
    tier: 'platinum',
    affectedBusinesses: ['techStartup'],
  },

  techStartup_gain2: {
    id: 'techStartup_gain2',
    name: '🚀 Licorne Valorisation 10Mds',
    description: 'Série D à 10 milliards $, expansion 50 pays, acquisitions stratégiques et cotation en bourse. Deviens la prochaine licorne tech.',
    reputationCost: 1300,
    multiplier: 1.85,
    tier: 'diamond',
    affectedBusinesses: ['techStartup'],
  },

  // ========== TIER DIAMOND (Domination) ==========

  // 🎢 PARC À THÈME
  themePark_gain1: {
    id: 'themePark_gain1',
    name: '🎢 Méga-Coasters Records',
    description: 'Construction de 3 montagnes russes battant les records mondiaux : vitesse 180km/h, hauteur 150m, inversions vertigineuses. Viral mondial.',
    reputationCost: 800,
    multiplier: 1.5,
    tier: 'diamond',
    affectedBusinesses: ['themePark'],
  },

  themePark_gain2: {
    id: 'themePark_gain2',
    name: '🌟 Franchise Internationale',
    description: 'Ouverture simultanée dans 12 pays avec thématiques adaptées. 50M de visiteurs/an, merchandising et licences générant revenus massifs.',
    reputationCost: 1800,
    multiplier: 2.0,
    tier: 'diamond',
    affectedBusinesses: ['themePark'],
  },

  // 🏎️ CONCESSIONNAIRE AUTO
  autoDealer_gain1: {
    id: 'autoDealer_gain1',
    name: '🏎️ Showroom Hypercars',
    description: 'Exclusivité Bugatti, Koenigsegg, Pagani. Clientèle ultra-fortunée, ventes moyennes 2M€/unité, marge 30%.',
    reputationCost: 650,
    multiplier: 1.45,
    tier: 'platinum',
    affectedBusinesses: ['autoDealer'],
  },

  autoDealer_gain2: {
    id: 'autoDealer_gain2',
    name: '⚡ Réseau Électrique Premium',
    description: 'Concessions officielles Tesla, Porsche Taycan, Lucid. Superchargeurs gratuits, expérience digitale révolutionnaire.',
    reputationCost: 1400,
    multiplier: 1.8,
    tier: 'diamond',
    affectedBusinesses: ['autoDealer'],
  },

  // 🪙 CRYPTO FARM
  cryptoFarm_gain1: {
    id: 'cryptoFarm_gain1',
    name: '🪙 Datacenter 50 MW',
    description: '20,000 GPUs RTX 5090 en refroidissement liquide immersif. Hashrate record, minage Bitcoin + Ethereum massif.',
    reputationCost: 900,
    multiplier: 1.55,
    tier: 'diamond',
    affectedBusinesses: ['cryptoFarm'],
  },

  cryptoFarm_gain2: {
    id: 'cryptoFarm_gain2',
    name: '⚡ Centrale Solaire Dédiée',
    description: 'Ferme solaire 100 hectares alimentant le mining 24/7. Coûts électricité -80%, minage écologique certifié, profits explosifs.',
    reputationCost: 2000,
    multiplier: 2.2,
    tier: 'diamond',
    affectedBusinesses: ['cryptoFarm'],
  },

  // ========== TIER MASTER (Conquête Mondiale) ==========

  // 🏢 TECH CORP
  techCorp_gain1: {
    id: 'techCorp_gain1',
    name: '🤖 IA Générale AGI',
    description: 'Développement IA générale surpassant GPT-5. Révolution technologique, contrats gouvernementaux, valorisation +1000Mds.',
    reputationCost: 1500,
    multiplier: 1.7,
    tier: 'diamond',
    affectedBusinesses: ['techCorp'],
  },

  techCorp_gain2: {
    id: 'techCorp_gain2',
    name: '🌐 Monopole Cloud Mondial',
    description: 'Contrôle 60% du cloud computing planétaire. Datacenters sur 6 continents, revenus récurrents colossaux, trop gros pour échouer.',
    reputationCost: 3000,
    multiplier: 2.5,
    tier: 'master',
    affectedBusinesses: ['techCorp'],
  },

  // 🚀 SPACEX
  spaceX_gain1: {
    id: 'spaceX_gain1',
    name: '🚀 Starship Full Reusable',
    description: 'Fusée 100% réutilisable avec 150 tonnes en orbite. Révolution spatiale, coût lancement divisé par 100, NASA et militaire sous contrat.',
    reputationCost: 1200,
    multiplier: 1.6,
    tier: 'diamond',
    affectedBusinesses: ['spaceX'],
  },

  spaceX_gain2: {
    id: 'spaceX_gain2',
    name: '🌌 Cité Martienne Autonome',
    description: 'Colonie 10,000 habitants sur Mars avec infrastructure complète. Tourisme spatial, minage astéroïdes, nouvelle économie interplanétaire.',
    reputationCost: 4000,
    multiplier: 3.0,
    tier: 'master',
    affectedBusinesses: ['spaceX'],
  },

  // 🏦 BANQUE
  bank_gain1: {
    id: 'bank_gain1',
    name: '🏦 Trading IA Quantum',
    description: 'Algorithmes quantiques prédisant les marchés avec 95% précision. Hedge fund propriétaire générant milliards en arbitrage.',
    reputationCost: 1000,
    multiplier: 1.6,
    tier: 'diamond',
    affectedBusinesses: ['bank'],
  },

  bank_gain2: {
    id: 'bank_gain2',
    name: '💰 Banque Centrale Privée',
    description: 'Licence bancaire mondiale, émission de stablecoin globale, services financiers dans 180 pays. Trop systémique pour réguler.',
    reputationCost: 2500,
    multiplier: 2.3,
    tier: 'master',
    affectedBusinesses: ['bank'],
  },

  // 🌍 GLOBAL CORP
  globalCorp_gain1: {
    id: 'globalCorp_gain1',
    name: '🌍 Conglomérat Multi-Secteurs',
    description: 'Holdings dans 500+ entreprises : tech, énergie, santé, retail. Portefeuille diversifié ultra-résilient, cash-flow garanti.',
    reputationCost: 1500,
    multiplier: 1.65,
    tier: 'diamond',
    affectedBusinesses: ['globalCorp'],
  },

  globalCorp_gain2: {
    id: 'globalCorp_gain2',
    name: '👑 Empire Économique Planétaire',
    description: 'Contrôle 40% PIB mondial. Influence gouvernements, dicte régulations, monopole de fait. Tu es devenu trop puissant pour être stoppé.',
    reputationCost: 5000,
    multiplier: 4.0,
    tier: 'master',
    affectedBusinesses: ['globalCorp'],
  },

  // ========== UPGRADES COMBO (Plusieurs businesses) ==========

  // 🆕 COMBO FOOD & BEVERAGE
  foodBeverage_combo: {
    id: 'foodBeverage_combo',
    name: '🍽️ Synergie Gastronomique',
    description: 'Partenariats croisés entre tes établissements food & beverage. Menu café dans le restaurant, plats restaurant dans le food truck.',
    reputationCost: 200,
    multiplier: 1.2,
    tier: 'gold',
    affectedBusinesses: ['coffeeMachine', 'foodTruck', 'restaurant'],
  },

  // 🆕 COMBO HOSPITALITY
  hospitality_combo: {
    id: 'hospitality_combo',
    name: '🏨 Réseau Hôtellerie Luxe',
    description: 'Programme fidélité unifié entre hôtel et Airbnb. Guests bénéficient d\'upgrades, expériences VIP croisées, occupation maximale.',
    reputationCost: 400,
    multiplier: 1.25,
    tier: 'platinum',
    affectedBusinesses: ['hotel', 'airbnb'],
  },

  // 🆕 COMBO ENTERTAINMENT
  entertainment_combo: {
    id: 'entertainment_combo',
    name: '🎬 Empire Divertissement',
    description: 'Packages combinés ciné + parc à thème, gaming studio développe jeux vidéo des franchises de tes parcs. Cross-marketing viral.',
    reputationCost: 800,
    multiplier: 1.3,
    tier: 'diamond',
    affectedBusinesses: ['cinema', 'themePark', 'gamingStudio'],
  },

  // 🆕 COMBO TECH DOMINANCE
  tech_combo: {
    id: 'tech_combo',
    name: '💻 Écosystème Tech Intégré',
    description: 'Startup licencie tech à la TechCorp, crypto farm mine pour ton stablecoin bancaire, IA unifiée. Monopole technologique absolu.',
    reputationCost: 2000,
    multiplier: 1.5,
    tier: 'master',
    affectedBusinesses: ['techStartup', 'techCorp', 'cryptoFarm', 'bank'],
  },

  // 🆕 COMBO GLOBAL DOMINATION
  ultimate_combo: {
    id: 'ultimate_combo',
    name: '🌟 Domination Totale',
    description: 'Synergies ultimes entre TOUS tes empires. Chaque business booste les autres exponentiellement. Tu contrôles l\'économie mondiale.',
    reputationCost: 10000,
    multiplier: 2.0,
    tier: 'master',
    affectedBusinesses: [
      'coffeeMachine', 'foodTruck', 'smallShop', 'airbnb', 'library', 
      'gym', 'cinema', 'restaurant', 'hotel', 'gamingStudio', 
      'factory', 'hospital', 'techStartup', 'themePark', 'autoDealer',
      'cryptoFarm', 'techCorp', 'spaceX', 'bank', 'globalCorp'
    ],
  },

} as const;

// Helper pour obtenir la liste ordonnée
export const UPGRADES_LIST = Object.values(UPGRADES_CONFIG);

// Helpers pour filtrer par tier
export const getUpgradesByTier = (tier: UpgradeConfig['tier']) => 
  UPGRADES_LIST.filter(u => u.tier === tier);

// Type helper
export type UpgradeId = keyof typeof UPGRADES_CONFIG;
