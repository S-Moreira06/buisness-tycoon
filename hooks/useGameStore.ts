import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BUSINESSES_CONFIG } from '../constants/businessesConfig';
import { calculateLevelFromXP, GAME_CONFIG } from '../constants/gameConfig';
import { UPGRADES_CONFIG } from '../constants/upgradesConfig';
import { CLICK_UPGRADES_CONFIG } from '@/constants/clickUpgradesConfig';
import { GameState, ClickUpgradeState } from '../types/game';

interface GameActions {
  toggleHaptics: () => void;
  setPlayerName: (name: string) => void;
  setProfileEmoji: (emoji: string) => void;
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
  purchaseClickUpgrade: (upgradeId: string) => void;
  getClickPower: () => { moneyPerClick: number; critChance: number; critMult: number };
}

type ExtendedGameState = GameState & GameActions;

const initialState: GameState = {
  playerName: 'CEO',
  profileEmoji: '💼',
  money: GAME_CONFIG.INITIAL_MONEY,
  reputation: GAME_CONFIG.INITIAL_REPUTATION,
  totalPassiveIncome: GAME_CONFIG.INITIAL_PASSIVE_INCOME,
  playerLevel: GAME_CONFIG.INITIAL_PLAYER_LEVEL,
  experience: GAME_CONFIG.INITIAL_EXPERIENCE,
  ownedStocks: {},
  businesses: Object.fromEntries(
    Object.values(BUSINESSES_CONFIG).map((business) => [
      business.id,
      { level: 0, income: business.baseIncome, quantity: 0, owned: false },
    ])
  ),
  upgrades: Object.fromEntries(
    Object.values(UPGRADES_CONFIG).map((upgrade) => [
      upgrade.id,
      { ...upgrade, purchased: false },
    ])
  ),
  clickUpgrades: Object.fromEntries(
    Object.values(CLICK_UPGRADES_CONFIG).map((upg) => [
      upg.id,
      { ...upg, purchased: false } as ClickUpgradeState,
    ])
  ),
  settings: {
    hapticsEnabled: true,
    soundEnabled: true,
    notificationsEnabled: true,
  },
};

export const useGameStore = create<ExtendedGameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      toggleHaptics: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            hapticsEnabled: !state.settings.hapticsEnabled,
          },
        })),

      setPlayerName: (name) => set({ playerName: name }),
      setProfileEmoji: (emoji) => set({ profileEmoji: emoji }),

      purchaseClickUpgrade: (upgradeId) =>
        set((state) => {
          const upgrade = state.clickUpgrades[upgradeId];
          if (!upgrade || upgrade.purchased || state.reputation < upgrade.reputationCost) {
            return state;
          }
          return {
            reputation: state.reputation - upgrade.reputationCost,
            clickUpgrades: {
              ...state.clickUpgrades,
              [upgradeId]: { ...upgrade, purchased: true },
            },
          };
        }),

      getClickPower: () => {
        const state = get();
        let moneyPerClick = GAME_CONFIG.CLICK_REWARD_MONEY;
        let critChance = GAME_CONFIG.BASE_CRIT_CHANCE;
        let critMult = GAME_CONFIG.BASE_CRIT_MULTIPLIER;

        Object.values(state.clickUpgrades).forEach((upg) => {
          if (upg.purchased) {
            if (upg.effectType === 'base_money') moneyPerClick += upg.effectValue;
            if (upg.effectType === 'crit_chance') critChance += upg.effectValue;
            if (upg.effectType === 'crit_multiplier') critMult += upg.effectValue;
          }
        });
        return { moneyPerClick, critChance, critMult };
      },

      clickGame: (overrides) =>
        set((state) => {
          if (overrides?.moneyGain) {
            const xpGain = overrides.xpGain ?? GAME_CONFIG.XP_PER_CLICK;
            return {
              money: state.money + overrides.moneyGain,
              reputation: state.reputation + (overrides.reputationGain ?? GAME_CONFIG.CLICK_REWARD_REPUTATION),
              experience: state.experience + xpGain,
              playerLevel: calculateLevelFromXP(state.experience + xpGain),
            };
          }

          let baseMoney = GAME_CONFIG.CLICK_REWARD_MONEY;
          let critChance = GAME_CONFIG.BASE_CRIT_CHANCE;
          let critMult = GAME_CONFIG.BASE_CRIT_MULTIPLIER;

          Object.values(state.clickUpgrades).forEach((upg) => {
            if (upg.purchased) {
              if (upg.effectType === 'base_money') baseMoney += upg.effectValue;
              if (upg.effectType === 'crit_chance') critChance += upg.effectValue;
              if (upg.effectType === 'crit_multiplier') critMult += upg.effectValue;
            }
          });

          const isCrit = Math.random() < critChance;
          const gain = isCrit ? baseMoney * critMult : baseMoney;
          const xp = GAME_CONFIG.XP_PER_CLICK;

          return {
            money: state.money + gain,
            reputation: state.reputation + GAME_CONFIG.CLICK_REWARD_REPUTATION,
            experience: state.experience + xp,
            playerLevel: calculateLevelFromXP(state.experience + xp),
          };
        }),

      buyStock: (stockId, price) =>
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
            totalPassiveIncome:
              state.totalPassiveIncome +
              Math.floor(price * GAME_CONFIG.STOCK_PASSIVE_INCOME_RATE),
          };
        }),

      buyBusiness: (businessId, price) =>
        set((state) => {
          const business = state.businesses[businessId];
          if (!business || state.money < price) return state;
          
          const newQuantity = (business.quantity || 0) + 1;
          const isFirst = !business.owned;
          const xpGain = isFirst ? GAME_CONFIG.XP_PER_NEW_BUSINESS : 0;
          
          return {
            money: state.money - price,
            businesses: {
              ...state.businesses,
              [businessId]: { ...business, owned: true, quantity: newQuantity },
            },
            totalPassiveIncome: state.totalPassiveIncome + business.income,
            experience: state.experience + xpGain,
            playerLevel: calculateLevelFromXP(state.experience + xpGain),
          };
        }),

      upgradeBusiness: (businessId, cost) =>
        set((state) => {
          const business = state.businesses[businessId];
          if (!business || !business.owned || state.money < cost) return state;
          
          const newLevel = business.level + 1;
          const boost = business.income * GAME_CONFIG.BUSINESS_LEVEL_INCOME_BOOST;
          
          return {
            money: state.money - cost,
            businesses: {
              ...state.businesses,
              [businessId]: { 
                  ...business, 
                  level: newLevel, 
                  income: business.income + boost 
              },
            },
            totalPassiveIncome: state.totalPassiveIncome + boost,
          };
        }),

      addPassiveIncome: () =>
        set((state) => ({ money: state.money + state.totalPassiveIncome })),

      purchaseUpgrade: (upgradeId) =>
        set((state) => {
          const upgrade = state.upgrades[upgradeId];
          if (!upgrade || upgrade.purchased || state.reputation < upgrade.reputationCost) return state;

          const ownsAffected = upgrade.affectedBusinesses.some(id => state.businesses[id]?.owned);
          if (!ownsAffected) return state;

          const newBusinesses = { ...state.businesses };
          let incomeGain = 0;

          upgrade.affectedBusinesses.forEach(id => {
             const bus = newBusinesses[id];
             if (bus && bus.owned) {
                const oldInc = bus.income;
                const newInc = oldInc * upgrade.multiplier;
                newBusinesses[id] = { ...bus, income: newInc };
                incomeGain += (newInc - oldInc) * bus.quantity;
             }
          });

          return {
             reputation: state.reputation - upgrade.reputationCost,
             upgrades: { ...state.upgrades, [upgradeId]: { ...upgrade, purchased: true } },
             businesses: newBusinesses,
             totalPassiveIncome: state.totalPassiveIncome + incomeGain
          };
        }),

      hydrateFromServer: (payload) => set((state) => ({ ...state, ...payload })),
      resetGame: () => set(initialState),
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        settings: { ...current.settings, ...(persisted.settings || {}) },
      }),
    }
  )
);