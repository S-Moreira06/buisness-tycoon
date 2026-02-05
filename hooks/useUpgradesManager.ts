import { useMemo, useState } from 'react';

export type TabType = 'purchased' | 'available' | 'locked';

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

export const useUpgradesManager = (
  upgradesData: any,
  businesses: any,
  playerLevel: number,
  type: 'business' | 'click'
) => {
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [activeTier, setActiveTier] = useState('all');

  const { allUpgrades, purchasedUpgrades, availableUpgrades, lockedUpgrades } =
    useMemo(() => {
      let all: any[] = [];

      if (type === 'business') {
        all = Object.values(upgradesData).filter((upgrade: any) =>
          upgrade.affectedBusinesses?.some(
            (businessId: string) => businesses[businessId]?.owned
          )
        );
      } else {
        all = Object.values(upgradesData || {});
      }

      const purchased = all.filter((u: any) => u.purchased);
      const notPurchased = all.filter((u: any) => !u.purchased);

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
    }, [upgradesData, businesses, playerLevel, type]);

  const displayedUpgrades = useMemo(() => {
    let list =
      activeTab === 'purchased'
        ? purchasedUpgrades
        : activeTab === 'available'
        ? availableUpgrades
        : lockedUpgrades;

    if (activeTier !== 'all') {
      list = list.filter((u: any) => u.tier === activeTier);
    }

    return list;
  }, [
    activeTab,
    activeTier,
    purchasedUpgrades,
    availableUpgrades,
    lockedUpgrades,
  ]);

  const sortedUpgrades = useMemo(() => {
    const list = [...displayedUpgrades];
    if (activeTab === 'locked') {
      return list;
    }
    return list.sort((a: any, b: any) => a.reputationCost - b.reputationCost);
  }, [displayedUpgrades, activeTab]);

  const counts = useMemo(
    () => ({
      purchased: purchasedUpgrades.length,
      available: availableUpgrades.length,
      locked: lockedUpgrades.length,
    }),
    [purchasedUpgrades.length, availableUpgrades.length, lockedUpgrades.length]
  );

  return {
    activeTab,
    setActiveTab,
    activeTier,
    setActiveTier,
    allUpgrades,
    displayedUpgrades: sortedUpgrades,
    counts,
    total: allUpgrades.length,
    totalPurchased: purchasedUpgrades.length,
  };
};
