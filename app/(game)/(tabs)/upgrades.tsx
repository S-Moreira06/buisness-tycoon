import { UpgradeCard } from '@/components/UpgradeCard';
import { CategoryTabs } from '@/components/upgrades/CategoryTabs';
import { UpgradesHeader } from '@/components/upgrades/UpgradesHeader';
import { UpgradesTabs } from '@/components/upgrades/UpgradesTabs';
import { useGameStore } from '@/hooks/useGameStore';
import { useUpgradesManager } from '@/hooks/useUpgradesManager';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpgradesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const scrollToUpgradeId = params.scrollTo as string | undefined;

  const [category, setCategory] = useState<'business' | 'click'>('business');

  const {
    upgrades,
    reputation,
    purchaseUpgrade,
    businesses,
    clickUpgrades,
    purchaseClickUpgrade,
    playerLevel,
  } = useGameStore();

  // Utilisation du nouveau hook pour business upgrades
  const businessManager = useUpgradesManager(upgrades, businesses, playerLevel, 'business');
  
  // Utilisation du nouveau hook pour click upgrades
  const clickManager = useUpgradesManager(clickUpgrades, businesses, playerLevel, 'click');

  // Sélection du manager actif
  const activeManager = category === 'business' ? businessManager : clickManager;

  // --- CALCUL DES TOTAUX ---
  const totalUpgradesCount = businessManager.total + clickManager.total;
  const totalPurchasedCount = businessManager.totalPurchased + clickManager.totalPurchased;

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
  }, [scrollToUpgradeId, activeManager.displayedUpgrades, router]);

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <UpgradesHeader
          allUpgradesCount={totalUpgradesCount}
          purchasedCount={totalPurchasedCount}
          reputation={reputation}
        />

        <CategoryTabs activeCategory={category} onSelectCategory={setCategory} />

        <UpgradesTabs
          activeTab={activeManager.activeTab}
          onTabChange={activeManager.setActiveTab}
          counts={activeManager.counts}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {activeManager.displayedUpgrades.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>📦</Text>
                <Text style={styles.emptyTitle}>Aucune amélioration trouvée</Text>
                <Text style={styles.emptyMessage}>
                  Essayez de changer de filtre ou de catégorie
                </Text>
              </View>
            </View>
          ) : (
            <>
              {activeManager.displayedUpgrades.map((upgrade: any) => (
                <View
                  key={upgrade.id}
                  ref={(ref) => {
                    upgradeRefs.current[upgrade.id] = ref;
                  }}
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
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 50,marginTop: -15 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCard: {
    width: '100%',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});
