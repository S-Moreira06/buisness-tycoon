import { useMemo } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

export const useBusinessData = (
  businessId: string,
  business: any,
  buyPrice: number,
  upgrades: any
) => {
  return useMemo(() => {
    const upgradeCost = Math.floor(buyPrice * (business?.level + 1) * 1.5);
    const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
    const totalIncome = (business?.income || 0) * (business?.quantity || 1);
    const incomePerSecond = totalIncome / intervalInSeconds;
    const incomeLabel = intervalInSeconds === 1 ? '/sec' : `/${intervalInSeconds}s`;

    // Upgrades - FIX: utiliser businessId directement
    const businessUpgrades = Object.values(upgrades).filter((upgrade: any) =>
      upgrade.affectedBusinesses.includes(businessId)
    );
    const purchasedUpgrades = businessUpgrades.filter((u: any) => u.purchased);
    const availableUpgrades = businessUpgrades.filter((u: any) => !u.purchased);

    return {
      upgradeCost,
      incomePerSecond,
      incomeLabel,
      businessUpgrades,
      purchasedUpgrades,
      availableUpgrades,
      hasUpgrades: businessUpgrades.length > 0,
    };
  }, [businessId, business, buyPrice, upgrades]);
};
