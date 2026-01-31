import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BUSINESSES_CONFIG } from '../constants/businessesConfig';
import { calculateLevelFromXP, GAME_CONFIG } from '../constants/gameConfig';
import { UPGRADES_CONFIG } from '../constants/upgradesConfig';
import { GameState } from '../types/game';

interface ExtendedGameState extends GameState {
  clickGame: (overrides?: {
    moneyGain?: number;
    reputationGain?: number;
    xpGain?: number;
  }) => void;
  buyStock: (stockId: string, price: number) => void;
  buyBusiness: (businessId: string, price: number) => void;
  upgradeBusiness: (businessId: string, cost: number) => void;
  addPassiveIncome: () => void;
  purchaseUpgrade: (upgradeId: string) => void; 
  hydrateFromServer: (payload: Partial<GameState>) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  money: GAME_CONFIG.INITIAL_MONEY,
  reputation: GAME_CONFIG.INITIAL_REPUTATION,
  totalPassiveIncome: GAME_CONFIG.INITIAL_PASSIVE_INCOME,
  playerLevel: GAME_CONFIG.INITIAL_PLAYER_LEVEL,  // 🔄 Renommé
  experience: GAME_CONFIG.INITIAL_EXPERIENCE,
  ownedStocks: {},
  businesses: Object.fromEntries(
    Object.values(BUSINESSES_CONFIG).map(business => [
      business.id,
      { level: 0, income: business.baseIncome, quantity: 0, owned: false }
    ])
  ),
  upgrades: Object.fromEntries(
    Object.values(UPGRADES_CONFIG).map(upgrade => [
      upgrade.id,
      { ...upgrade, purchased: false }
    ])
  ),
};

export const useGameStore = create<ExtendedGameState>()(
  persist(
    (set) => ({
      ...initialState,

      clickGame: (overrides) =>
        set((state) => {
          const moneyGain = overrides?.moneyGain ?? GAME_CONFIG.CLICK_REWARD_MONEY;
          const reputationGain = overrides?.reputationGain ?? GAME_CONFIG.CLICK_REWARD_REPUTATION;
          const xpGain = overrides?.xpGain ?? GAME_CONFIG.XP_PER_CLICK;

          const newXP = state.experience + xpGain;
          const newPlayerLevel = calculateLevelFromXP(newXP);

          return {
            money: state.money + moneyGain,
            reputation: state.reputation + reputationGain,
            experience: newXP,
            playerLevel: newPlayerLevel,
          };
        }),



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
            totalPassiveIncome: state.totalPassiveIncome + Math.floor(price * GAME_CONFIG.STOCK_PASSIVE_INCOME_RATE),
          };
        }),

      buyBusiness: (businessId: string, price: number) =>
        set((state) => {
          const business = state.businesses[businessId];
          if (!business || state.money < price) return state;

          const isFirstPurchase = !business.owned;
          const newQuantity = (business.quantity || 0) + 1;
          
          const xpGain = isFirstPurchase ? GAME_CONFIG.XP_PER_NEW_BUSINESS : 0;
          const newXP = state.experience + xpGain;
          const newPlayerLevel = calculateLevelFromXP(newXP);  // 🔄 Renommé

          return {
            money: state.money - price,
            businesses: {
              ...state.businesses,
              [businessId]: {
                ...business,
                owned: true,
                quantity: newQuantity,
              },
            },
            totalPassiveIncome: state.totalPassiveIncome + business.income,
            experience: newXP,
            playerLevel: newPlayerLevel,  // 🔄 Renommé
          };
        }),


      upgradeBusiness: (businessId: string, cost: number) =>
        set((state) => {
          const business = state.businesses[businessId];
          if (!business || !business.owned || state.money < cost)
            return state;

          const newLevel = business.level + 1;
          const incomeBoost = business.income * GAME_CONFIG.BUSINESS_LEVEL_INCOME_BOOST;

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
          if (!upgrade || upgrade.purchased || state.reputation < upgrade.reputationCost) 
            return state;
          // 🆕 VÉRIFIER QUE LE JOUEUR POSSÈDE AU MOINS UN BUSINESS AFFECTÉ
          const ownsAffectedBusiness = upgrade.affectedBusinesses.some(
            (businessId) => state.businesses[businessId]?.owned
          );
          if (!ownsAffectedBusiness) return state;

          // 1. Calculer les nouveaux revenus pour les businesses affectés
          const updatedBusinesses = { ...state.businesses };
          let passiveIncomeIncrease = 0;

          upgrade.affectedBusinesses.forEach((businessId) => {
            const business = updatedBusinesses[businessId];
            if (business && business.owned) {
              // Calcul du boost de revenu
              const oldIncome = business.income;
              const newIncome = oldIncome * upgrade.multiplier;
              const incomeBoost = newIncome - oldIncome;

              // Mise à jour du business
              updatedBusinesses[businessId] = {
                ...business,
                income: newIncome,
              };

              // Cumul pour le passif total (boost * quantité possédée)
              passiveIncomeIncrease += incomeBoost * (business.quantity || 1);
            }
          });

          // 2. Retourner le nouvel état
          return {
            reputation: state.reputation - upgrade.reputationCost,
            upgrades: {
              ...state.upgrades,
              [upgradeId]: {
                ...upgrade,
                purchased: true,
              },
            },
            businesses: updatedBusinesses,
            totalPassiveIncome: state.totalPassiveIncome + passiveIncomeIncrease,
          };
        }),


      addPassiveIncome: () =>
        set((state) => ({
          money: state.money + state.totalPassiveIncome,
        })),
      
      addExperience: (amount: number) =>
        set((state) => {
          const newXP = state.experience + amount;
          const newPlayerLevel = calculateLevelFromXP(newXP);  // 🔄 Renommé
          
          return {
            experience: newXP,
            playerLevel: newPlayerLevel,  // 🔄 Renommé
          };
        }),


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
