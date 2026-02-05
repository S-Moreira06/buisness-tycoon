import { useMemo, useState } from 'react';
import { TabType } from '../components/upgrades/UpgradesTabs';
import { TierFilter } from '../constants/tierConfig';
// ✅ Fonction de vérification des conditions (extraite pour réutilisation)
const checkUnlockConditions = (
  upgrade: any,
  businesses: any,
  playerLevel: number
): boolean => {
  if (!upgrade.unlockConditions || upgrade.unlockConditions.length === 0) {
    return true;
  }

  return upgrade.unlockConditions.every((condition: any) => {
    switch (condition.type) {
      case 'business_quantity':
        const business = businesses[condition.businessId];
        return business && business.quantity >= condition.value;
      case 'player_level':
        return playerLevel >= condition.value;
      default:
        return true;
    }
  });
};
export const useUpgradesFilters = (upgrades: any, businesses: any, playerLevel: number) => {
  const [activeTab, setActiveTab] = useState<TabType>('purchased');
  const [activeTier, setActiveTier] = useState<TierFilter>('all');

  const { allUpgrades, purchasedUpgrades, availableUpgrades, lockedUpgrades } =
    useMemo(() => {
      const all = Object.values(upgrades).filter((upgrade: any) =>
        upgrade.affectedBusinesses.some(
          (businessId: string) => businesses[businessId]?.owned
        )
      );

      const purchased = all.filter((u: any) => u.purchased);
      const notPurchased = all.filter((u: any) => !u.purchased);
      // ✅ Séparation disponibles / verrouillés
      const available = notPurchased.filter((u: any) =>
        checkUnlockConditions(u, businesses, playerLevel)
      );
      const locked = notPurchased.filter(
        (u: any) => !checkUnlockConditions(u, businesses, playerLevel)
      );

      return {
        allUpgrades: all,
        purchasedUpgrades: purchased,
        availableUpgrades: available,
        lockedUpgrades: locked,
      };
    }, [upgrades, businesses, playerLevel]);

    const displayedUpgrades = useMemo(() => {
      // 1. Filtrer par tab
      let filtered =
        activeTab === 'purchased'
          ? purchasedUpgrades
          : activeTab === 'available'
          ? availableUpgrades
          : lockedUpgrades;

      // 2. Filtrer par tier
      if (activeTier !== 'all') {
        filtered = filtered.filter((u: any) => u.tier === activeTier);
      }

      return filtered;
    }, [
      activeTab,
      activeTier,
      allUpgrades,
      purchasedUpgrades,
      availableUpgrades,
    ]);

  return {
    activeTab,
    setActiveTab,
    activeTier,
    setActiveTier,
    allUpgrades,
    purchasedUpgrades,
    availableUpgrades,
    lockedUpgrades,
    displayedUpgrades,
  };
};
