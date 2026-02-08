import { create } from 'zustand';

import { BUSINESSES_CONFIG } from '@/constants/businessesConfig';
import { CLICK_UPGRADES_CONFIG } from '@/constants/clickUpgradesConfig';
import { calculateLevelFromXP, GAME_CONFIG } from '@/constants/gameConfig';
import { UPGRADES_CONFIG } from '@/constants/upgradesConfig';
import { ClickUpgradeState, GameState, GameStats } from '@/types/game';

interface GameActions {
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
  startSession: () => void; // 🆕
  endSession: () => void; // 🆕
  updateDailyStreak: () => void; // 🆕
  clearSessionAchievements: () => void; 
};

type ExtendedGameState = GameState & GameActions;

const initialStats: GameStats = {
  // Activité
  totalClicks: 0,
  totalCriticalClicks: 0,
  totalPlayTime: 0,
  sessionsPlayed: 0,
  longestSession: 0,
  currentSessionStart: Date.now(), // 🆕 On démarre la session
  lastLoginDate: new Date().toISOString(),
  daysPlayedStreak: 1,
  
  // Économie
  totalMoneyEarned: 0,
  totalMoneySpent: 0,
  maxMoneyReached: 0,
  moneyFromClicks: 0,
  moneyFromPassive: 0,
  moneyFromAchievements: 0,
  
  // Réputation
  totalReputationEarned: 0,
  totalReputationSpent: 0,
  maxReputationReached: 0,
  
  // Revenu Passif
  bestPassiveIncomeReached: 0,
  
  // Progression
  businessesBought: 0,
  uniqueBusinessesOwned: 0,
  totalBusinessLevels: 0,
  upgradesPurchased: 0,
  clickUpgradesPurchased: 0,
  businessUpgradesPurchased: 0,
  
  // Achievements
  achievementsUnlocked: 0,
  
  // Milestones
  firstBusinessPurchaseTime: 0,
  firstUpgradePurchaseTime: 0,
  firstAchievementUnlockTime: 0,
  
  // Système
  totalResets: 0,
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
  unlockedAchievements: [],
  sessionNewAchievements: [],
  combo: { currentStreak: 0 },
};

export const useGameStore = create<ExtendedGameState>()(
    (set, get) => ({
      ...initialState,



      setPlayerName: (name) => set({ playerName: name }),
      setProfileEmoji: (emoji) => set({ profileEmoji: emoji }),
      clearSessionAchievements: () => set({ sessionNewAchievements: [] }),
      purchaseClickUpgrade: (upgradeId) =>
        set((state) => {
          const upgrade = state.clickUpgrades[upgradeId];
          if (!upgrade || upgrade.purchased || state.reputation < upgrade.reputationCost) {
            return state;
          }
          
          const currentStats = state.stats || initialStats;
          
          // 🆕 Milestone : Premier upgrade
          const firstUpgradeTime = currentStats.firstUpgradePurchaseTime === 0 
            ? Date.now() 
            : currentStats.firstUpgradePurchaseTime;
          
          return {
            reputation: state.reputation - upgrade.reputationCost,
            clickUpgrades: {
              ...state.clickUpgrades,
              [upgradeId]: { ...upgrade, purchased: true },
            },
            stats: {
              ...currentStats,
              totalReputationSpent: currentStats.totalReputationSpent + upgrade.reputationCost, // 🆕
              upgradesPurchased: currentStats.upgradesPurchased + 1,
              clickUpgradesPurchased: currentStats.clickUpgradesPurchased + 1, // 🆕
              firstUpgradePurchaseTime: firstUpgradeTime, // 🆕
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
          const currentStats = state.stats || initialStats;

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
              stats: {
                ...currentStats,
                totalMoneyEarned: currentStats.totalMoneyEarned + moneyGain,
                // 🆕 On considère les overrides comme du revenu "externe" (achievements, bonus)
                moneyFromAchievements: currentStats.moneyFromAchievements + moneyGain,
                maxMoneyReached: Math.max(currentStats.maxMoneyReached, newMoney),
                totalReputationEarned: currentStats.totalReputationEarned + (overrides.reputationGain ?? GAME_CONFIG.CLICK_REWARD_REPUTATION),
                maxReputationReached: Math.max(currentStats.maxReputationReached, state.reputation + (overrides.reputationGain ?? GAME_CONFIG.CLICK_REWARD_REPUTATION)),
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
          const repGain = GAME_CONFIG.CLICK_REWARD_REPUTATION;
          const newMoney = state.money + gain;
          const newReputation = state.reputation + repGain;

          return {
            money: newMoney,
            reputation: newReputation,
            experience: state.experience + xp,
            playerLevel: calculateLevelFromXP(state.experience + xp),
            stats: {
              ...currentStats,
              // Activité
              totalClicks: currentStats.totalClicks + 1,
              totalCriticalClicks: isCrit 
                ? currentStats.totalCriticalClicks + 1 
                : currentStats.totalCriticalClicks,
              
              // Économie
              totalMoneyEarned: currentStats.totalMoneyEarned + gain,
              moneyFromClicks: currentStats.moneyFromClicks + gain, // 🆕
              maxMoneyReached: Math.max(currentStats.maxMoneyReached, newMoney),
              
              // Réputation
              totalReputationEarned: currentStats.totalReputationEarned + repGain, // 🆕
              maxReputationReached: Math.max(currentStats.maxReputationReached, newReputation), // 🆕
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
          const currentStats = state.stats || initialStats;
          
          // 🆕 Compte les types uniques de business possédés
          const uniqueCount = isFirst 
            ? currentStats.uniqueBusinessesOwned + 1 
            : currentStats.uniqueBusinessesOwned;
          
          // 🆕 Milestone : Premier achat
          const firstPurchaseTime = currentStats.firstBusinessPurchaseTime === 0 
            ? Date.now() 
            : currentStats.firstBusinessPurchaseTime;
          
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
              ...currentStats,
              totalMoneySpent: currentStats.totalMoneySpent + price,
              businessesBought: currentStats.businessesBought + 1,
              uniqueBusinessesOwned: uniqueCount, // 🆕
              firstBusinessPurchaseTime: firstPurchaseTime, // 🆕
              bestPassiveIncomeReached: Math.max(currentStats.bestPassiveIncomeReached, state.totalPassiveIncome + business.income), // 🆕
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
            stats: {
              ...state.stats,
              totalMoneySpent: state.stats.totalMoneySpent + cost,
              totalBusinessLevels: state.stats.totalBusinessLevels + 1, // 🆕
              bestPassiveIncomeReached: Math.max(state.stats.bestPassiveIncomeReached, state.totalPassiveIncome + boost), // 🆕
            }
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
              moneyFromPassive: state.stats.moneyFromPassive + gain,
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
          
          const currentStats = state.stats || initialStats;
          
          // 🆕 Milestone : Premier upgrade
          const firstUpgradeTime = currentStats.firstUpgradePurchaseTime === 0 
            ? Date.now() 
            : currentStats.firstUpgradePurchaseTime;

          return {
            reputation: state.reputation - upgrade.reputationCost,
            upgrades: { ...state.upgrades, [upgradeId]: { ...upgrade, purchased: true } },
            businesses: newBusinesses,
            totalPassiveIncome: state.totalPassiveIncome + incomeGain,
            stats: {
              ...currentStats,
              totalReputationSpent: currentStats.totalReputationSpent + upgrade.reputationCost, // 🆕
              upgradesPurchased: currentStats.upgradesPurchased + 1,
              businessUpgradesPurchased: currentStats.businessUpgradesPurchased + 1, // 🆕
              firstUpgradePurchaseTime: firstUpgradeTime, // 🆕
              bestPassiveIncomeReached: Math.max(currentStats.bestPassiveIncomeReached, state.totalPassiveIncome + incomeGain), // 🆕
            }
          };
        }),


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
          if (state.unlockedAchievements.includes(id)) return state;
          
          const newXp = state.experience + (rewards.xp || 0);
          const newLevel = calculateLevelFromXP(newXp);
          const newMoney = state.money + (rewards.money || 0);
          const newReputation = state.reputation + (rewards.reputation || 0);
          
          const currentStats = state.stats || initialStats;
          
          // 🆕 Milestone : Premier achievement
          const firstAchievementTime = currentStats.firstAchievementUnlockTime === 0 
            ? Date.now() 
            : currentStats.firstAchievementUnlockTime;
          
          return {
            unlockedAchievements: [...state.unlockedAchievements, id],
            sessionNewAchievements: [...state.sessionNewAchievements, id],
            reputation: newReputation,
            experience: newXp,
            playerLevel: newLevel,
            money: newMoney,
            stats: {
              ...currentStats,
              // Économie
              maxMoneyReached: Math.max(currentStats.maxMoneyReached, newMoney),
              totalMoneyEarned: currentStats.totalMoneyEarned + (rewards.money || 0),
              moneyFromAchievements: currentStats.moneyFromAchievements + (rewards.money || 0), // 🆕
              
              // Réputation
              totalReputationEarned: currentStats.totalReputationEarned + (rewards.reputation || 0), // 🆕
              maxReputationReached: Math.max(currentStats.maxReputationReached, newReputation), // 🆕
              
              // Achievements
              achievementsUnlocked: currentStats.achievementsUnlocked + 1, // 🆕
              firstAchievementUnlockTime: firstAchievementTime, // 🆕
            }
          };
        }),
      
      

      hydrateFromServer: (payload: any) => set((state) => {
        // ========================================
        // 🛡️ MIGRATION V2.0 : STATS COMPLÈTES
        // ========================================
        
        // 1. FUSION INTELLIGENTE DES SUCCÈS
        const localAch = state.unlockedAchievements || [];
        const cloudAch = payload.unlockedAchievements || [];
        const mergedAchievements = Array.from(new Set([...localAch, ...cloudAch]));

        // 2. MIGRATION DES STATS AVEC PROTECTION COMPLÈTE
        const cloudStats = payload.stats || {};
        
        // 🔄 Calcul des valeurs manquantes si nécessaire
        const calculateUniqueBusinesses = () => {
          const businesses = payload.businesses || state.businesses;
          return Object.values(businesses).filter((b: any) => b.owned).length;
        };
        
        const calculateTotalBusinessLevels = () => {
          const businesses = payload.businesses || state.businesses;
          return Object.values(businesses).reduce((sum: number, b: any) => sum + (b.level || 0), 0);
        };
        
        const migratedStats = {
          // ========== BASE : On part de l'état actuel ou initialStats ==========
          ...initialStats,
          ...state.stats,
          
          // ========== OVERRIDE : Ce qui vient du cloud ==========
          ...cloudStats,
          
          // ========== FUSION INTELLIGENTE : On garde le meilleur ==========
          totalMoneyEarned: Math.max(
            state.stats.totalMoneyEarned || 0, 
            cloudStats.totalMoneyEarned || 0
          ),
          maxMoneyReached: Math.max(
            state.stats.maxMoneyReached || 0, 
            cloudStats.maxMoneyReached || 0
          ),
          maxReputationReached: Math.max(
            state.stats.maxReputationReached || 0,
            cloudStats.maxReputationReached || 0
          ),
          bestPassiveIncomeReached: Math.max(
            state.stats.bestPassiveIncomeReached || 0,
            cloudStats.bestPassiveIncomeReached || 0
          ),
          longestSession: Math.max(
            state.stats.longestSession || 0,
            cloudStats.longestSession || 0
          ),
          daysPlayedStreak: Math.max(
            state.stats.daysPlayedStreak || 1,
            cloudStats.daysPlayedStreak || 1
          ),
          
          // ========== RECALCUL : Si les champs n'existent pas dans le cloud ==========
          // Activité
          sessionsPlayed: cloudStats.sessionsPlayed ?? (state.stats.sessionsPlayed || 1),
          currentSessionStart: Date.now(), // ✅ Toujours réinitialisé à la connexion
          lastLoginDate: new Date().toISOString(), // ✅ Mis à jour à NOW
          
          // Économie
          moneyFromClicks: cloudStats.moneyFromClicks ?? (state.stats.moneyFromClicks || 0),
          moneyFromPassive: cloudStats.moneyFromPassive ?? (state.stats.moneyFromPassive || 0),
          moneyFromAchievements: cloudStats.moneyFromAchievements ?? (state.stats.moneyFromAchievements || 0),
          
          // Réputation
          totalReputationEarned: cloudStats.totalReputationEarned ?? (state.stats.totalReputationEarned || payload.reputation || 0),
          totalReputationSpent: cloudStats.totalReputationSpent ?? (state.stats.totalReputationSpent || 0),
          
          // Progression
          uniqueBusinessesOwned: cloudStats.uniqueBusinessesOwned ?? calculateUniqueBusinesses(),
          totalBusinessLevels: cloudStats.totalBusinessLevels ?? calculateTotalBusinessLevels(),
          
          // Séparation des upgrades (si anciennes sauvegardes n'avaient que "upgradesPurchased")
          clickUpgradesPurchased: cloudStats.clickUpgradesPurchased ?? 0,
          businessUpgradesPurchased: cloudStats.businessUpgradesPurchased ?? (cloudStats.upgradesPurchased || 0),
          
          // Achievements
          achievementsUnlocked: cloudStats.achievementsUnlocked ?? mergedAchievements.length,
          
          // Milestones (on garde les timestamps s'ils existent)
          firstBusinessPurchaseTime: cloudStats.firstBusinessPurchaseTime ?? (state.stats.firstBusinessPurchaseTime || 0),
          firstUpgradePurchaseTime: cloudStats.firstUpgradePurchaseTime ?? (state.stats.firstUpgradePurchaseTime || 0),
          firstAchievementUnlockTime: cloudStats.firstAchievementUnlockTime ?? (state.stats.firstAchievementUnlockTime || 0),
          
          // Système
          totalResets: cloudStats.totalResets ?? (state.stats.totalResets || 0),
        };

        // ========================================
        // 3. RETOUR FINAL AVEC TOUTES LES DONNÉES
        // ========================================
        return {
          ...state,           // Base locale
          ...payload,         // Override avec le cloud (money, reputation, businesses, etc.)
          stats: migratedStats,
          unlockedAchievements: mergedAchievements,
        };
      }),

      // 🆕 GESTION DES SESSIONS
      startSession: () =>
        set((state) => {
          const now = Date.now();
          const lastLogin = new Date(state.stats.lastLoginDate);
          const today = new Date();
          
          // Calcul du streak (jours consécutifs)
          const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          let newStreak = state.stats.daysPlayedStreak;
          
          if (daysDiff === 1) {
            // Jour consécutif
            newStreak += 1;
          } else if (daysDiff > 1) {
            // Streak cassé
            newStreak = 1;
          }
          // Si daysDiff === 0 (même jour), on garde le streak actuel
          
          return {
            sessionNewAchievements: [],
            stats: {
              ...state.stats,
              sessionsPlayed: state.stats.sessionsPlayed + 1,
              currentSessionStart: now,
              lastLoginDate: today.toISOString(),
              daysPlayedStreak: newStreak,
            }
          };
        }),

      endSession: () =>
        set((state) => {
          const sessionDuration = Math.floor((Date.now() - state.stats.currentSessionStart) / 1000);
          
          return {
            stats: {
              ...state.stats,
              longestSession: Math.max(state.stats.longestSession, sessionDuration),
              currentSessionStart: 0, // Reset pour la prochaine session
            }
          };
        }),

      updateDailyStreak: () =>
        set((state) => {
          // Cette fonction peut être appelée quotidiennement (ex: via un cron ou au login)
          const lastLogin = new Date(state.stats.lastLoginDate);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff > 1) {
            // Streak cassé
            return {
              stats: {
                ...state.stats,
                daysPlayedStreak: 1,
                lastLoginDate: today.toISOString(),
              }
            };
          }
          
          return state; // Rien à faire
        }),
          
      resetGame: () => 
        set((state) => ({
          ...initialState,
          stats: {
            ...initialStats,
            totalResets: state.stats.totalResets + 1, // 🆕 On garde le compteur de resets
          }
        })),

    }),
  
);