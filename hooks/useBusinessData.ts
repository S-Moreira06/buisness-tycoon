import { BUSINESSES_CONFIG } from '@/constants/businessesConfig';
import { useMemo } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';
import { useGameStore } from './useGameStore';

export const useBusinessData = (
  businessId: string,
  business: any,
  upgrades: any
) => {
  const { businesses, stats, totalPassiveIncome, playerLevel, combo } = useGameStore();
  return useMemo(() => {
    const baseCost = BUSINESSES_CONFIG[businessId]?.baseCost || 0;
    // ✅ Guard clause : si business n'existe pas ou n'est pas possédé
    if (!business || !business.owned) {
      return {
        upgradeCost: 0,
        upgradeBoost: 0,
        incomePerSecond: 0,
        incomeLabel: '/sec',
        businessUpgrades: [],
        purchasedUpgrades: [],
        availableUpgrades: [],
        lockedUpgrades: [],
        hasUpgrades: false,
      };
    }
    const upgradeCost = Math.floor(baseCost * (business.level + 1) * 0.1);
    const currentIncome = business.income || 0;
    const totalBoost = currentIncome * GAME_CONFIG.UPGRADE_MULTIPLIER;
    const upgradeBoost = totalBoost - currentIncome;

    const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
    const totalIncome = currentIncome * (business.quantity || 1);    
    const incomePerSecond = totalIncome / intervalInSeconds;
    const incomeLabel = intervalInSeconds === 1 ? '/sec' : `/${intervalInSeconds}s`;

     const businessUpgrades = Object.values(upgrades).filter((upgrade: any) =>
      upgrade.affectedBusinesses.includes(businessId)
    );
    
    const purchasedUpgrades = businessUpgrades.filter((u: any) => u.purchased);
    
    // ✅ Séparer disponibles vs verrouillées
    const nonPurchased = businessUpgrades.filter((u: any) => !u.purchased);
    
    const availableUpgrades: any[] = [];
    const lockedUpgrades: any[] = [];
    
    nonPurchased.forEach((upgrade: any) => {
      // Si pas de conditions, toujours disponible
      if (!upgrade.unlockConditions || upgrade.unlockConditions.length === 0) {
        availableUpgrades.push(upgrade);
        return;
      }
      
      // Vérifier si déverrouillé
      const { isUnlocked } = checkUnlockConditions(
        upgrade.unlockConditions,
        { businesses, stats, totalPassiveIncome, playerLevel, combo }
      );
      
      if (isUnlocked) {
        availableUpgrades.push(upgrade);
      } else {
        lockedUpgrades.push(upgrade);
      }
    });
    return {
      upgradeCost,
      upgradeBoost,
      incomePerSecond,
      incomeLabel,
      businessUpgrades,
      purchasedUpgrades,
      availableUpgrades,
       lockedUpgrades,
      hasUpgrades: businessUpgrades.length > 0,
    };
  }, [businessId, business, upgrades, businesses, stats, totalPassiveIncome, playerLevel, combo]); // ✅ Retirer buyPrice
};
// ✅ Fonction helper inline pour éviter hook dans loop
function checkUnlockConditions(
  unlockConditions: any[] | undefined,
  gameState: any
): { isUnlocked: boolean } {
  if (!unlockConditions || unlockConditions.length === 0) {
    return { isUnlocked: true };
  }

  for (const condition of unlockConditions) {
    let current = 0;
    const required = condition.value;

    switch (condition.type) {
      case 'business_quantity':
        current = gameState.businesses[condition.businessId]?.quantity || 0;
        break;
      case 'business_level':
        current = gameState.businesses[condition.businessId]?.level || 0;
        break;
      case 'upgrades_purchased':
        current = gameState.stats.upgradesPurchased;
        break;
      case 'passive_income':
        current = gameState.totalPassiveIncome;
        break;
      case 'player_level':
        current = gameState.playerLevel;
        break;
      case 'total_clicks':
        current = gameState.stats.totalClicks;
        break;
      case 'combo_reached':
        current = gameState.combo?.currentStreak || 0;
        break;
    }

    if (current < required) {
      return { isUnlocked: false };
    }
  }

  return { isUnlocked: true };
}
