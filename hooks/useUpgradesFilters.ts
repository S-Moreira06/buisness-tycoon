import { useMemo, useState } from 'react';
import { TabType } from '../components/upgrades/UpgradesTabs';
import { TierFilter } from '../constants/tierConfig';

export const useUpgradesFilters = (upgrades: any, businesses: any) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [activeTier, setActiveTier] = useState<TierFilter>('all');

  const { allUpgrades, purchasedUpgrades, availableUpgrades } = useMemo(() => {
    const all = Object.values(upgrades).filter((upgrade: any) =>
      upgrade.affectedBusinesses.some(
        (businessId: string) => businesses[businessId]?.owned
      )
    );

    const purchased = all.filter((u: any) => u.purchased);
    const available = all.filter((u: any) => !u.purchased);

    return {
      allUpgrades: all,
      purchasedUpgrades: purchased,
      availableUpgrades: available,
    };
  }, [upgrades, businesses]);

  const displayedUpgrades = useMemo(() => {
    // 1. Filtrer par tab
    let filtered =
      activeTab === 'all'
        ? allUpgrades
        : activeTab === 'purchased'
        ? purchasedUpgrades
        : availableUpgrades;

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
    displayedUpgrades,
  };
};
