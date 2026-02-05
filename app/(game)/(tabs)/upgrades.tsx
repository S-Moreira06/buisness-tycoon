import { UpgradeCard } from '@/components/UpgradeCard';
import { CategoryTabs } from '@/components/upgrades/CategoryTabs';
import { UpgradesHeader } from '@/components/upgrades/UpgradesHeader';
import { UpgradesTabs } from '@/components/upgrades/UpgradesTabs';
import { TierFilter } from '@/constants/tierConfig';
import { useGameStore } from '@/hooks/useGameStore';
import { useUpgradesFilters } from '@/hooks/useUpgradesFilters';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpgradesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const scrollToUpgradeId = params.scrollTo as string | undefined;
  const [category, setCategory] = useState<'business' | 'click'>('business');
  const [clickActiveTier, setClickActiveTier] = useState<TierFilter>('all'); 
  const [clickActiveTab, setClickActiveTab] = useState<'all' | 'available' | 'purchased'>('all');
  const { upgrades, reputation, purchaseUpgrade, businesses, clickUpgrades, purchaseClickUpgrade, playerLevel} = useGameStore();
  const {
    activeTab,
    setActiveTab,
    activeTier,
    setActiveTier,
    allUpgrades,
    purchasedUpgrades,
    availableUpgrades,
    displayedUpgrades: displayedBusinessUpgrades,
  } = useUpgradesFilters(upgrades, businesses);

  
  // --- CALCUL DES TOTAUX ---
  
  // 1. Total Business (déjà calculé par ton hook, on le récupère)
  const totalBusiness = allUpgrades.length;
  const purchasedBusiness = purchasedUpgrades.length;

  // 2. Total Clics
const allClickUpgradesList = useMemo(() => {
  if (!clickUpgrades) return [];
  return Object.values(clickUpgrades).sort((a: any, b: any) => a.reputationCost - b.reputationCost);
}, [clickUpgrades]);
  const totalClick = allClickUpgradesList.length;
  const purchasedClickUpgrades = useMemo(() => 
  allClickUpgradesList.filter((u: any) => u.purchased), 
[allClickUpgradesList]);
  const purchasedClick = allClickUpgradesList.filter((u: any) => u.purchased).length;
const availableClickUpgrades = useMemo(() => 
  allClickUpgradesList.filter((u: any) => !u.purchased), 
[allClickUpgradesList]);
  // 3. Grand Total (C'est ça qu'on envoie au Header)
  const totalUpgradesCount = totalBusiness + totalClick;
  const totalPurchasedCount = purchasedBusiness + purchasedClick;

  
  const displayedClickUpgrades = useMemo(() => {
  let list = allClickUpgradesList;

  // Filtre par Onglet (Tab)
  if (clickActiveTab === 'purchased') {
    list = list.filter((u: any) => u.purchased);
  } else if (clickActiveTab === 'available') {
    list = list.filter((u: any) => !u.purchased);
  }

  // Filtre par Tier
  if (clickActiveTier !== 'all') {
    list = list.filter((u: any) => u.tier === clickActiveTier);
  }

  return list;
}, [allClickUpgradesList, clickActiveTab, clickActiveTier]);
  const displayedList = category === 'business' ? displayedBusinessUpgrades : displayedClickUpgrades;
  const upgradeRefs = useRef<{ [key: string]: View | null }>({});
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll automatique vers l'upgrade ciblé
  useEffect(() => {
    if (scrollToUpgradeId && upgradeRefs.current[scrollToUpgradeId]) {
      setTimeout(() => {
        upgradeRefs.current[scrollToUpgradeId]?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
            setTimeout(() => router.setParams({ scrollTo: undefined }), 500);
          },
          () => router.setParams({ scrollTo: undefined })
        );
      }, 300);
    }
  }, [scrollToUpgradeId, displayedBusinessUpgrades, router]);
// 🆕 Fonction de vérification des conditions
const checkUnlockConditions = (upgrade: any): boolean => {
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

// 🆕 Tri de displayedList : débloqués d'abord, verrouillés ensuite
const sortedDisplayedList = useMemo(() => {
  const list = category === 'business' ? displayedBusinessUpgrades : displayedClickUpgrades;
  
  return [...list].sort((a: any, b: any) => {
    const aUnlocked = checkUnlockConditions(a);
    const bUnlocked = checkUnlockConditions(b);

    if (aUnlocked === bUnlocked) {
      return a.reputationCost - b.reputationCost;
    }

    return aUnlocked ? -1 : 1;
  });
}, [category, displayedBusinessUpgrades, displayedClickUpgrades, businesses, playerLevel]);
 return (
    <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <UpgradesHeader
          allUpgradesCount={totalUpgradesCount}
          purchasedCount={totalPurchasedCount}
          reputation={reputation}
        />

        {/* 4. AJOUT DU SELECTEUR DE CATEGORIE EN HAUT */}
        <CategoryTabs 
          activeCategory={category} 
          onSelectCategory={setCategory} 
        />

        {/* LES FILTRES BUSINESS (affichés seulement si catégorie = business) */}
        {category === 'business' ? (
          <>
            <UpgradesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={{
                all: allUpgrades.length,
                available: availableUpgrades.length,
                purchased: purchasedUpgrades.length,
              }}
            />
            {/* <TierFilters activeTier={activeTier} onTierChange={setActiveTier} /> */}
          </>
        ):(
          <>
            <UpgradesTabs
              activeTab={clickActiveTab}
              onTabChange={setClickActiveTab}
              counts={{
                all: allClickUpgradesList.length,
                available: availableClickUpgrades.length,
                purchased: purchasedClickUpgrades.length,
              }}
            />
            {/* <TierFilters activeTier={clickActiveTier} onTierChange={setClickActiveTier} /> */}
          </>
          )}

        {displayedList.length === 0 ? (
          <View style={styles.emptyContainer}>
            {/* ... TON COMPOSANT EMPTY EXISTANT ... */}
            {/* Tu peux garder ton bloc existant ici, il s'adaptera si la liste est vide */}
            <Text style={styles.emptyTitle}>Aucune amélioration trouvée</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sortedDisplayedList.map((upgrade: any) => (
              <View
                key={upgrade.id}
                ref={(ref) => { upgradeRefs.current[upgrade.id] = ref }}
                collapsable={false}
              >
                <UpgradeCard
                  upgrade={upgrade}
                  canAfford={reputation >= upgrade.reputationCost && !upgrade.purchased}
                  onPurchase={() => {
                    if (category === 'business') {
                      purchaseUpgrade(upgrade.id);
                    } else {
                      purchaseClickUpgrade(upgrade.id);
                    }
                  }}
                  type={category}
                />
              </View>
            ))}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyCard: { width: '100%', padding: 32, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  emptyMessage: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
});
