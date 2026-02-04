import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BUSINESSES_CONFIG } from '@/constants/businessesConfig';
import { CLICK_UPGRADES_CONFIG } from '@/constants/clickUpgradesConfig';
import { calculateLevelFromXP, GAME_CONFIG } from '@/constants/gameConfig';
import { UPGRADES_CONFIG } from '@/constants/upgradesConfig';
import { ClickUpgradeState, GameState, GameStats } from '@/types/game';

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
  tickPlayTime: () => void;
  purchaseClickUpgrade: (upgradeId: string) => void;
  getClickPower: () => { moneyPerClick: number; critChance: number; critMult: number };
  unlockAchievement: (id: string, rewards: { reputation?: number; xp?: number; money?: number }) => void;
};

type ExtendedGameState = GameState & GameActions;

const initialStats: GameStats = {
  totalClicks: 0,
  totalCriticalClicks: 0,
  totalMoneyEarned: 0,
  totalMoneySpent: 0,
  maxMoneyReached: 0,
  totalPlayTime: 0,
  businessesBought: 0,
  upgradesPurchased: 0,
};

const initialState: GameState = {
  stats: initialStats,
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
  unlockedAchievements: [],
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
          const currentStats = state.stats || {
            totalClicks: 0,
            totalCriticalClicks: 0,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            maxMoneyReached: state.money,
            totalPlayTime: 0,
            businessesBought: 0,
            upgradesPurchased: 0,
          };
          return {
            reputation: state.reputation - upgrade.reputationCost,
            clickUpgrades: {
              ...state.clickUpgrades,
              [upgradeId]: { ...upgrade, purchased: true },
            },
            stats: {
              ...currentStats,
              // On incrémente ici aussi car c'est une "amélioration"
              upgradesPurchased: (currentStats.upgradesPurchased || 0) + 1
            }
          };
        }),

      getClickPower: () => {
        const state = get();
        
        // ========== BASE VALUES ==========
        let moneyPerClick = GAME_CONFIG.CLICK_REWARD_MONEY;
        let critChance = GAME_CONFIG.BASE_CRIT_CHANCE;
        let critMult = GAME_CONFIG.BASE_CRIT_MULTIPLIER;
        
        // ========== CALCULS DYNAMIQUES ==========
        const totalBusinesses = Object.values(state.businesses).reduce(
          (sum, b) => sum + (b.quantity || 0), 
          0
        );
        const totalIncome = state.totalPassiveIncome;
        
        // ========== APPLICATION DES UPGRADES ==========
        Object.values(state.clickUpgrades).forEach((upg) => {
          if (!upg.purchased) return;
          
          switch (upg.effectType) {
            // 🔹 TYPES EXISTANTS (inchangés)
            case 'base_money':
              moneyPerClick += upg.effectValue;
              break;
            case 'crit_chance':
              critChance += upg.effectValue;
              break;
            case 'crit_multiplier':
              critMult += upg.effectValue;
              break;
            
            // 🆕 NOUVEAUX TYPES HYBRIDES
            case 'business_synergy':
              if (upg.scalingType === 'businesses_owned') {
                // Ex: +5% par business possédé
                moneyPerClick *= (1 + totalBusinesses * upg.effectValue);
              }
              break;
            
            case 'scaling':
              if (upg.scalingType === 'reputation') {
                // Ex: +0.1% par point de réputation
                moneyPerClick *= (1 + state.reputation * (upg.scalingFactor || 0));
              }
              if (upg.scalingType === 'total_income') {
                // Ex: Clic = 1% du revenu passif total
                moneyPerClick += totalIncome * (upg.scalingFactor || 0);
              }
              break;
            
            case 'passive_boost':
              // Ex: +0.05% du revenu passif par clic
              moneyPerClick += totalIncome * (upg.scalingFactor || 0);
              break;
          }
        });
        
        return { moneyPerClick, critChance, critMult };
      },


      clickGame: (overrides) =>
        set((state) => {
          // 🛡️ SÉCURITÉ : On s'assure que stats existe toujours
          // Si c'est une vieille sauvegarde, on initialise avec des zéros
          const currentStats = state.stats || {
            totalClicks: 0,
            totalCriticalClicks: 0,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            maxMoneyReached: state.money,
            totalPlayTime: 0,
            businessesBought: 0,
            upgradesPurchased: 0,
          };

          // ---------------------------------------------------------
          // CAS 1 : Clic Automatique / Bonus (Overrides)
          // ---------------------------------------------------------
          if (overrides?.moneyGain) {
            const xpGain = overrides.xpGain ?? GAME_CONFIG.XP_PER_CLICK;
            const moneyGain = overrides.moneyGain;
            const newMoney = state.money + moneyGain;

            return {
              money: newMoney,
              reputation: state.reputation + (overrides.reputationGain ?? GAME_CONFIG.CLICK_REWARD_REPUTATION),
              experience: state.experience + xpGain,
              playerLevel: calculateLevelFromXP(state.experience + xpGain),
              // ✅ IMPORTANT : On met à jour l'économie totale même ici
              stats: {
                ...currentStats,
                totalMoneyEarned: currentStats.totalMoneyEarned + moneyGain,
                maxMoneyReached: Math.max(currentStats.maxMoneyReached, newMoney),
              }
            };
          }

          // ---------------------------------------------------------
          // CAS 2 : Clic Manuel du Joueur
          // ---------------------------------------------------------
          const { moneyPerClick, critChance, critMult } = get().getClickPower();
    
          const isCrit = Math.random() < critChance;
          const gain = isCrit ? moneyPerClick * critMult : moneyPerClick;
          const xp = GAME_CONFIG.XP_PER_CLICK;
          const newMoney = state.money + gain;

          return {
            money: newMoney,
            reputation: state.reputation + GAME_CONFIG.CLICK_REWARD_REPUTATION,
            experience: state.experience + xp,
            playerLevel: calculateLevelFromXP(state.experience + xp),
            stats: {
              ...currentStats,
              totalClicks: currentStats.totalClicks + 1,
              totalCriticalClicks: isCrit 
                ? currentStats.totalCriticalClicks + 1 
                : currentStats.totalCriticalClicks,
              totalMoneyEarned: currentStats.totalMoneyEarned + gain,
              maxMoneyReached: Math.max(currentStats.maxMoneyReached, newMoney),
            },
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
           const currentStats = state.stats || {
            totalClicks: 0,
            totalCriticalClicks: 0,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            maxMoneyReached: state.money,
            totalPlayTime: 0,
            businessesBought: 0,
            upgradesPurchased: 0,
          };
          return {
            money: state.money - price,
            businesses: {
              ...state.businesses,
              [businessId]: { ...business, owned: true, quantity: newQuantity },
            },
            totalPassiveIncome: state.totalPassiveIncome + business.income,
            experience: state.experience + xpGain,
            playerLevel: calculateLevelFromXP(state.experience + xpGain),
            stats: {
              ...state.stats,
              totalMoneySpent: state.stats.totalMoneySpent + price,
              businessesBought: (currentStats.businessesBought || 0) + 1, 
            }
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
        set((state) => {
          const gain = state.totalPassiveIncome;
          const newMoney = state.money + gain;
          
          return { 
            money: newMoney,
            stats: {
              ...state.stats,
              totalMoneyEarned: state.stats.totalMoneyEarned + gain,
              maxMoneyReached: Math.max(state.stats.maxMoneyReached, newMoney),
            }
          };
        }),

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
           const currentStats = state.stats || {
            totalClicks: 0,
            totalCriticalClicks: 0,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            maxMoneyReached: state.money,
            totalPlayTime: 0,
            businessesBought: 0,
            upgradesPurchased: 0,
          };

          return {
             reputation: state.reputation - upgrade.reputationCost,
             upgrades: { ...state.upgrades, [upgradeId]: { ...upgrade, purchased: true } },
             businesses: newBusinesses,
             totalPassiveIncome: state.totalPassiveIncome + incomeGain,
            stats: {
                ...currentStats,
                // On incrémente bien ce champ spécifique
                upgradesPurchased: (currentStats.upgradesPurchased || 0) + 1
            }
          };
        }
      ),

      tickPlayTime: () =>
        set((state) => {
          // Sécurité anti-crash
          const currentStats = state.stats || { 
            totalClicks: 0, 
            totalCriticalClicks: 0, 
            totalMoneyEarned: 0, 
            totalMoneySpent: 0, 
            maxMoneyReached: state.money, 
            totalPlayTime: 0, 
            businessesBought: 0,
            upgradesPurchased: 0, 
          };
          return {
            stats: {
              ...currentStats,
              totalPlayTime: currentStats.totalPlayTime + 1, // +1 seconde
            },
          };
        }
      ),
      
      unlockAchievement: (id, rewards) =>
        set((state) => {
          // Sécurité : ne pas ajouter si déjà présent
          if (state.unlockedAchievements.includes(id)) return state;
          const newXp = state.experience + (rewards.xp || 0);
          const newLevel = calculateLevelFromXP(newXp);
          const newMoney = state.money + (rewards.money || 0);
          return {
            unlockedAchievements: [...state.unlockedAchievements, id],
            reputation: state.reputation + (rewards.reputation || 0),
            experience: newXp,
            playerLevel: newLevel,
            money: newMoney,
            // Mettre à jour maxMoneyReached si on donne de l'argent
            stats: {
              ...state.stats,
              maxMoneyReached: Math.max(state.stats.maxMoneyReached, newMoney),
              totalMoneyEarned: state.stats.totalMoneyEarned + (rewards.money || 0),
            }
          };
        }),
      hydrateFromServer: (payload: any) => set((state) => {
        // 1. FUSION INTELLIGENTE DES SUCCÈS
        // On combine ce qu'on a en local + ce qui vient du cloud
        const localAch = state.unlockedAchievements || [];
        const cloudAch = payload.unlockedAchievements || [];
        const mergedAchievements = Array.from(new Set([...localAch, ...cloudAch]));

        // 2. FUSION DES STATS (On garde le meilleur des deux mondes)
        // Exemple : Si j'ai gagné plus d'argent en offline, je garde mon record local
        const mergedStats = {
          ...state.stats,          // Base locale
          ...(payload.stats || {}), // Override cloud
          totalMoneyEarned: Math.max(state.stats.totalMoneyEarned, payload.stats?.totalMoneyEarned || 0),
          maxMoneyReached: Math.max(state.stats.maxMoneyReached, payload.stats?.maxMoneyReached || 0),
        };

        return {
            ...state,
            ...payload, // On applique le reste du cloud (Money, Reputation...)
            stats: mergedStats,
            unlockedAchievements: mergedAchievements,
        };
      }),      
      resetGame: () => set(initialState),
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        stats: { ...current.stats, ...(persisted.stats || {}) },
        settings: { ...current.settings, ...(persisted.settings || {}) },
      }),
    }
  )
);