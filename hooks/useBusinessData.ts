import { BUSINESSES_CONFIG } from '@/constants/businessesConfig';
import { useMemo } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

export const useBusinessData = (
  businessId: string,
  business: any,
  upgrades: any
) => {
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

    // Upgrades
    const businessUpgrades = Object.values(upgrades).filter((upgrade: any) =>
      upgrade.affectedBusinesses.includes(businessId)
    );
    const purchasedUpgrades = businessUpgrades.filter((u: any) => u.purchased);
    const availableUpgrades = businessUpgrades.filter((u: any) => !u.purchased);

    return {
      upgradeCost,
      upgradeBoost,
      incomePerSecond,
      incomeLabel,
      businessUpgrades,
      purchasedUpgrades,
      availableUpgrades,
      hasUpgrades: businessUpgrades.length > 0,
    };
  }, [businessId, business, upgrades]); // ✅ Retirer buyPrice
};
