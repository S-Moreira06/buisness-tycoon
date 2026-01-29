import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GameState } from '../types/game';

interface ExtendedGameState extends GameState {
  clickGame: () => void;
  buyStock: (stockId: string, price: number) => void;
  buyBusiness: (businessId: string, price: number) => void;
  upgradeBusiness: (businessId: string, cost: number) => void;
  addPassiveIncome: () => void;
  hydrateFromServer: (payload: Partial<GameState>) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  money: 5000,
  reputation: 100,
  totalPassiveIncome: 0,
  ownedStocks: {},
  businesses: {
    coffeeMachine: { level: 0, income: 5, quantity: 0, owned: false },
    foodTruck: { level: 0, income: 20, quantity: 0, owned: false },
    smallShop: { level: 0, income: 40, quantity: 0, owned: false },
    airbnb: { level: 0, income: 150, quantity: 0, owned: false },
    library: { level: 0, income: 210, quantity: 0, owned: false },
    gym: { level: 0, income: 450, quantity: 0, owned: false },
    cinema: { level: 0, income: 900, quantity: 0, owned: false },
    restaurant: { level: 0, income: 1500, quantity: 0, owned: false },
    hotel: { level: 0, income: 3000, quantity: 0, owned: false },
    gamingStudio: { level: 0, income: 4500, quantity: 0, owned: false },
    factory: { level: 0, income: 8000, quantity: 0, owned: false },
    hospital: { level: 0, income: 12000, quantity: 0, owned: false },
    techStartup: { level: 0, income: 22000, quantity: 0, owned: false },
    themepark: { level: 0, income: 50000, quantity: 0, owned: false },
    autoDealer: { level: 0, income: 90000, quantity: 0, owned: false },
    cryptoFarm: { level: 0, income: 200000, quantity: 0, owned: false },
    techCorp: { level: 0, income: 500000, quantity: 0, owned: false },
    spaceX: { level: 0, income: 660000, quantity: 0, owned: false },
    bank: { level: 0, income: 990000, quantity: 0, owned: false },
    globalCorp: { level: 0, income: 120000, quantity: 0, owned: false },
  },
  upgrades: {
  // ☕ MACHINE À CAFÉ
  coffeeMachine_gain1: {
    id: 'coffeeMachine_gain1',
    name: '☕ Café Colombien Premium',
    description: 'Source du meilleur café colombien. Qualité supérieure et satisfaction client augmentée.',
    reputationCost: 50,
    multiplier: 1.1,
    affectedBusinesses: ['coffeeMachine'],
    purchased: false,
  },
  coffeeMachine_gain2: {
    id: 'coffeeMachine_gain2',
    name: '🌟 Barista Expert',
    description: 'Embauche de baristas qualifiés avec années d\'expérience.',
    reputationCost: 100,
    multiplier: 1.1,
    affectedBusinesses: ['coffeeMachine'],
    purchased: false,
  },

  // 🍕 FOOD TRUCK
  foodTruck_gain1: {
    id: 'foodTruck_gain1',
    name: '🍕 Menu Signature',
    description: 'Création d\'un menu exclusif et reconnu. Augmente la clientèle fidèle.',
    reputationCost: 75,
    multiplier: 1.1,
    affectedBusinesses: ['foodTruck'],
    purchased: false,
  },
  foodTruck_gain2: {
    id: 'foodTruck_gain2',
    name: '⭐ Food Truck Premium',
    description: 'Mise à niveau complète avec équipement haut de gamme.',
    reputationCost: 150,
    multiplier: 1.1,
    affectedBusinesses: ['foodTruck'],
    purchased: false,
  },

  // 🏪 PETIT MAGASIN
  smallShop_gain1: {
    id: 'smallShop_gain1',
    name: '🏪 Produits Premium',
    description: 'Sélection de produits haut de gamme et exclusifs.',
    reputationCost: 75,
    multiplier: 1.1,
    affectedBusinesses: ['smallShop'],
    purchased: false,
  },
  smallShop_gain2: {
    id: 'smallShop_gain2',
    name: '🌐 Commerce En Ligne',
    description: 'Intégration e-commerce et livraison à domicile.',
    reputationCost: 150,
    multiplier: 1.1,
    affectedBusinesses: ['smallShop'],
    purchased: false,
  },

  // 🏠 AIRBNB
  airbnb_gain1: {
    id: 'airbnb_gain1',
    name: '🏠 Propriétés Luxe',
    description: 'Sélection de propriétés haut standing avec services premium.',
    reputationCost: 100,
    multiplier: 1.1,
    affectedBusinesses: ['airbnb'],
    purchased: false,
  },
  airbnb_gain2: {
    id: 'airbnb_gain2',
    name: '🌍 Expansion Mondiale',
    description: 'Présence dans 50 pays. Augmente l\'occupancy rate.',
    reputationCost: 200,
    multiplier: 1.1,
    affectedBusinesses: ['airbnb'],
    purchased: false,
  },

  // 📚 LIBRAIRIE
  library_gain1: {
    id: 'library_gain1',
    name: '📚 Collection Premium',
    description: 'Éditions rares et exemplaires de collection prestigieux.',
    reputationCost: 50,
    multiplier: 1.1,
    affectedBusinesses: ['library'],
    purchased: false,
  },
  library_gain2: {
    id: 'library_gain2',
    name: '🎭 Événements Littéraires',
    description: 'Lectures, dédicaces d\'auteurs et ateliers culturels.',
    reputationCost: 100,
    multiplier: 1.1,
    affectedBusinesses: ['library'],
    purchased: false,
  },

  // 🏋️ SALLE DE GYM
  gym_gain1: {
    id: 'gym_gain1',
    name: '🏋️ Équipement Haut Gamme',
    description: 'Machines de fitness dernière génération et équipement professionnel.',
    reputationCost: 75,
    multiplier: 1.1,
    affectedBusinesses: ['gym'],
    purchased: false,
  },
  gym_gain2: {
    id: 'gym_gain2',
    name: '💪 Coachs Personnels',
    description: 'Équipe de coachs certifiés pour accompagnement personnalisé.',
    reputationCost: 150,
    multiplier: 1.1,
    affectedBusinesses: ['gym'],
    purchased: false,
  },

  // 🎬 CINÉMA
  cinema_gain1: {
    id: 'cinema_gain1',
    name: '🎬 Écrans IMAX',
    description: 'Installation de salles IMAX haute définition premium.',
    reputationCost: 100,
    multiplier: 1.1,
    affectedBusinesses: ['cinema'],
    purchased: false,
  },
  cinema_gain2: {
    id: 'cinema_gain2',
    name: '🍿 Expérience VIP',
    description: 'Salles VIP avec sièges chauffants et service premium.',
    reputationCost: 200,
    multiplier: 1.1,
    affectedBusinesses: ['cinema'],
    purchased: false,
  },

  // 🍽️ RESTAURANT
  restaurant_gain1: {
    id: 'restaurant_gain1',
    name: '🍽️ Chef Michelin',
    description: 'Chef réputé avec expérience internationale et créatif.',
    reputationCost: 150,
    multiplier: 1.1,
    affectedBusinesses: ['restaurant'],
    purchased: false,
  },
  restaurant_gain2: {
    id: 'restaurant_gain2',
    name: '⭐ Gastronomie Fine',
    description: 'Cuisine raffinée avec produits locaux et bio premium.',
    reputationCost: 300,
    multiplier: 1.1,
    affectedBusinesses: ['restaurant'],
    purchased: false,
  },

  // 🏨 HÔTEL
  hotel_gain1: {
    id: 'hotel_gain1',
    name: '🏨 Confort Luxe',
    description: 'Suites avec vue panoramique et services concierge 24/7.',
    reputationCost: 150,
    multiplier: 1.1,
    affectedBusinesses: ['hotel'],
    purchased: false,
  },
  hotel_gain2: {
    id: 'hotel_gain2',
    name: '🌟 Spa & Wellness',
    description: 'Centre spa complet avec soins premium et piscine chauffée.',
    reputationCost: 300,
    multiplier: 1.1,
    affectedBusinesses: ['hotel'],
    purchased: false,
  },

  // 🎮 GAMING STUDIO
  gamingStudio_gain1: {
    id: 'gamingStudio_gain1',
    name: '🎮 Moteur Graphique AAA',
    description: 'Utilisation du moteur Unreal Engine 5 dernière génération.',
    reputationCost: 200,
    multiplier: 1.1,
    affectedBusinesses: ['gamingStudio'],
    purchased: false,
  },
  gamingStudio_gain2: {
    id: 'gamingStudio_gain2',
    name: '🏆 Studio Réputé',
    description: 'Recrutement de game designers et développeurs mondialement reconnus.',
    reputationCost: 400,
    multiplier: 1.1,
    affectedBusinesses: ['gamingStudio'],
    purchased: false,
  },

  // 🏭 USINE
  factory_gain1: {
    id: 'factory_gain1',
    name: '🤖 Automatisation Robot',
    description: 'Installation de robots industriels haute précision.',
    reputationCost: 250,
    multiplier: 1.1,
    affectedBusinesses: ['factory'],
    purchased: false,
  },
  factory_gain2: {
    id: 'factory_gain2',
    name: '⚙️ Chaîne Production IA',
    description: 'Optimisation par intelligence artificielle du processus production.',
    reputationCost: 500,
    multiplier: 1.1,
    affectedBusinesses: ['factory'],
    purchased: false,
  },

  // 🏥 HÔPITAL
  hospital_gain1: {
    id: 'hospital_gain1',
    name: '🏥 Technologie Médicale',
    description: 'IRM, scanner et équipement chirurgical dernière génération.',
    reputationCost: 300,
    multiplier: 1.1,
    affectedBusinesses: ['hospital'],
    purchased: false,
  },
  hospital_gain2: {
    id: 'hospital_gain2',
    name: '⚕️ Spécialistes Réputés',
    description: 'Équipe de docteurs et chirurgiens reconnus mondialement.',
    reputationCost: 600,
    multiplier: 1.1,
    affectedBusinesses: ['hospital'],
    purchased: false,
  },

  // 💻 TECH STARTUP
  techStartup_gain1: {
    id: 'techStartup_gain1',
    name: '💻 Talents Tech',
    description: 'Recrutement d\'engineers Google, Meta et Apple.',
    reputationCost: 250,
    multiplier: 1.1,
    affectedBusinesses: ['techStartup'],
    purchased: false,
  },
  techStartup_gain2: {
    id: 'techStartup_gain2',
    name: '🚀 Licorne Status',
    description: 'Valorisation licorne avec levée de fonds massifs.',
    reputationCost: 500,
    multiplier: 1.1,
    affectedBusinesses: ['techStartup'],
    purchased: false,
  },

  // 🎢 PARC À THÈME
  themePark_gain1: {
    id: 'themePark_gain1',
    name: '🎢 Attractions Futuristes',
    description: 'Montagnes russes technologiques et attractions AR/VR.',
    reputationCost: 300,
    multiplier: 1.1,
    affectedBusinesses: ['themePark'],
    purchased: false,
  },
  themePark_gain2: {
    id: 'themePark_gain2',
    name: '🌟 Parc Mondial',
    description: 'Franchise dans 10 continents avec thèmes uniques.',
    reputationCost: 600,
    multiplier: 1.1,
    affectedBusinesses: ['themePark'],
    purchased: false,
  },

  // 🏎️ CONCESSIONNAIRE AUTO
  autoDealer_gain1: {
    id: 'autoDealer_gain1',
    name: '🏎️ Voitures Luxe',
    description: 'Exclusivité Ferrari, Lamborghini et Rolls Royce.',
    reputationCost: 250,
    multiplier: 1.1,
    affectedBusinesses: ['autoDealer'],
    purchased: false,
  },
  autoDealer_gain2: {
    id: 'autoDealer_gain2',
    name: '⚡ Électrique Premium',
    description: 'Concession officielle Tesla, Lucid et Rimac.',
    reputationCost: 500,
    multiplier: 1.1,
    affectedBusinesses: ['autoDealer'],
    purchased: false,
  },

  // 🪙 CRYPTO FARM
  cryptoFarm_gain1: {
    id: 'cryptoFarm_gain1',
    name: '🪙 GPU Nvidia RTX',
    description: 'Farm avec 10 000 GPU dernière génération.',
    reputationCost: 300,
    multiplier: 1.1,
    affectedBusinesses: ['cryptoFarm'],
    purchased: false,
  },
  cryptoFarm_gain2: {
    id: 'cryptoFarm_gain2',
    name: '⚡ Énergie Verte',
    description: 'Panneaux solaires et éolienne pour mining écologique.',
    reputationCost: 600,
    multiplier: 1.1,
    affectedBusinesses: ['cryptoFarm'],
    purchased: false,
  },

  // 🏢 TECH CORP
  techCorp_gain1: {
    id: 'techCorp_gain1',
    name: '🤖 IA Générative',
    description: 'Développement d\'IA ChatGPT-like propriétaire.',
    reputationCost: 500,
    multiplier: 1.1,
    affectedBusinesses: ['techCorp'],
    purchased: false,
  },
  techCorp_gain2: {
    id: 'techCorp_gain2',
    name: '🌐 Domination Tech',
    description: 'Monopole sur cloud computing et services web globaux.',
    reputationCost: 1000,
    multiplier: 1.1,
    affectedBusinesses: ['techCorp'],
    purchased: false,
  },

  // 🚀 SPACEX
  spaceX_gain1: {
    id: 'spaceX_gain1',
    name: '🚀 Starship Réutilisable',
    description: 'Fusée entièrement réutilisable pour missions spatiales.',
    reputationCost: 500,
    multiplier: 1.1,
    affectedBusinesses: ['spaceX'],
    purchased: false,
  },
  spaceX_gain2: {
    id: 'spaceX_gain2',
    name: '🌌 Colonisation Mars',
    description: 'Infrastructure complète pour établissement humain sur Mars.',
    reputationCost: 1500,
    multiplier: 1.1,
    affectedBusinesses: ['spaceX'],
    purchased: false,
  },

  // 🏦 BANQUE
  bank_gain1: {
    id: 'bank_gain1',
    name: '🏦 Fintech Innovation',
    description: 'Plateforme de trading automatisé avec IA prédictive.',
    reputationCost: 400,
    multiplier: 1.1,
    affectedBusinesses: ['bank'],
    purchased: false,
  },
  bank_gain2: {
    id: 'bank_gain2',
    name: '💰 Banque Universelle',
    description: 'Présence dans 150 pays avec tous les services financiers.',
    reputationCost: 800,
    multiplier: 1.1,
    affectedBusinesses: ['bank'],
    purchased: false,
  },

  // 🌍 GLOBAL CORP
  globalCorp_gain1: {
    id: 'globalCorp_gain1',
    name: '🌍 Portefeuille Diversifié',
    description: 'Acquisitions stratégiques dans tous les secteurs.',
    reputationCost: 500,
    multiplier: 1.1,
    affectedBusinesses: ['globalCorp'],
    purchased: false,
  },
  globalCorp_gain2: {
    id: 'globalCorp_gain2',
    name: '👑 Omnipotence Corporelle',
    description: 'Corporation contrôlant 50% de l\'économie mondiale.',
    reputationCost: 2000,
    multiplier: 1.1,
    affectedBusinesses: ['globalCorp'],
    purchased: false,
  },
},


};

export const useGameStore = create<ExtendedGameState>()(
  persist(
    (set) => ({
      ...initialState,

      clickGame: () =>
        set((state) => ({
          money: state.money + 999999,
          reputation: state.reputation + 1,
        })),

      buyStock: (stockId: string, price: number) =>
        set((state) => {
          if (state.money < price) return state;

          return {
            money: state.money - price,
            ownedStocks: {
              ...state.ownedStocks,
              [stockId]: {
                quantity: (state.ownedStocks[stockId]?.quantity || 0) + 1,
                buyPrice: price,
              },
            },
            totalPassiveIncome: state.totalPassiveIncome + Math.floor(price * 0.01),
          };
        }),

      buyBusiness: (businessId: string, price: number) =>
        set((state) => {
          const business = state.businesses[businessId];
          if (!business || state.money < price) return state;

          const newQuantity = (business.quantity || 0) + 1;
          const newIncome = business.income * newQuantity;

          return {
            money: state.money - price,
            businesses: {
              ...state.businesses,
              [businessId]: {
                ...business,
                owned: true,
                quantity: newQuantity,  // 👈 AJOUTE ÇA
              },
            },
            totalPassiveIncome: state.totalPassiveIncome + business.income,
          };
        }),

      upgradeBusiness: (businessId: string, cost: number) =>
        set((state) => {
          const business = state.businesses[businessId];
          if (!business || !business.owned || state.money < cost)
            return state;

          const newLevel = business.level + 1;
          const incomeBoost = business.income * 0.1;

          return {
            money: state.money - cost,
            businesses: {
              ...state.businesses,
              [businessId]: {
                ...business,
                level: newLevel,
                income: business.income + incomeBoost,
              },
            },
            totalPassiveIncome: state.totalPassiveIncome + incomeBoost,
          };
        }),
      purchaseUpgrade: (upgradeId: string) =>
        set((state) => {
          const upgrade = state.upgrades[upgradeId];
          if (!upgrade || state.reputation < upgrade.reputationCost) return state;

          return {
            reputation: state.reputation - upgrade.reputationCost,
            upgrades: {
              ...state.upgrades,
              [upgradeId]: {
                ...upgrade,
                purchased: true,
              },
            },
          };
        }),

      addPassiveIncome: () =>
        set((state) => ({
          money: state.money + state.totalPassiveIncome,
        })),

      hydrateFromServer: (payload) =>
        set((state) => ({
          ...state,
          ...payload,
        })),

      resetGame: () => set(initialState),
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
