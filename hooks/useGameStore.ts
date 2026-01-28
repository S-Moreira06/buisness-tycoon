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
  money: 10000,
  reputation: 100,
  totalPassiveIncome: 0,
  ownedStocks: {},
  businesses: {
    startup: { level: 0, income: 50, owned: false },
    restaurant: { level: 0, income: 100, owned: false },
    factory: { level: 0, income: 500, owned: false },
    techCorp: { level: 0, income: 2000, owned: false },
  },
};

export const useGameStore = create<ExtendedGameState>()(
  persist(
    (set) => ({
      ...initialState,

      clickGame: () =>
        set((state) => ({
          money: state.money + 10,
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

          return {
            money: state.money - price,
            businesses: {
              ...state.businesses,
              [businessId]: {
                ...business,
                owned: true,
                level: 1,
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
          const incomeBoost = business.income * 0.5;

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
