import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UpgradeCard } from '../../../components/UpgradeCard';
import { TierFilters } from '../../../components/upgrades/TierFilters';
import { UpgradesHeader } from '../../../components/upgrades/UpgradesHeader';
import { UpgradesTabs } from '../../../components/upgrades/UpgradesTabs';
import { TIER_CONFIG } from '../../../constants/tierConfig';
import { useGameStore } from '../../../hooks/useGameStore';
import { useUpgradesFilters } from '../../../hooks/useUpgradesFilters';

export default function UpgradesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const scrollToUpgradeId = params.scrollTo as string | undefined;

  const { upgrades, reputation, purchaseUpgrade, businesses } = useGameStore();
  const {
    activeTab,
    setActiveTab,
    activeTier,
    setActiveTier,
    allUpgrades,
    purchasedUpgrades,
    availableUpgrades,
    displayedUpgrades,
  } = useUpgradesFilters(upgrades, businesses);

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
  }, [scrollToUpgradeId, displayedUpgrades, router]);

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <UpgradesHeader
          allUpgradesCount={allUpgrades.length}
          purchasedCount={purchasedUpgrades.length}
          reputation={reputation}
        />

        <UpgradesTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            all: allUpgrades.length,
            available: availableUpgrades.length,
            purchased: purchasedUpgrades.length,
          }}
        />

        <TierFilters activeTier={activeTier} onTierChange={setActiveTier} />

        {displayedUpgrades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>
                {activeTier !== 'all'
                  ? TIER_CONFIG[activeTier].icon
                  : activeTab === 'all'
                  ? '📦'
                  : activeTab === 'purchased'
                  ? '🎉'
                  : '🛒'}
              </Text>
              <Text style={styles.emptyTitle}>
                {activeTier !== 'all'
                  ? `Aucune amélioration ${TIER_CONFIG[activeTier].label}`
                  : activeTab === 'all'
                  ? 'Aucune amélioration disponible'
                  : activeTab === 'purchased'
                  ? 'Aucune amélioration possédée'
                  : 'Aucune amélioration à acheter'}
              </Text>
              <Text style={styles.emptyMessage}>
                {activeTier !== 'all'
                  ? `Achète des businesses pour débloquer des upgrades ${TIER_CONFIG[activeTier].label} !`
                  : activeTab === 'purchased'
                  ? 'Achète des amliorations pour booster tes revenus !'
                  : 'Félicitations ! Tu as acheté toutes les améliorations disponibles !'}
              </Text>
            </LinearGradient>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {displayedUpgrades.map((upgrade: any) => (
              <View
                key={upgrade.id}
                ref={(ref) => (upgradeRefs.current[upgrade.id] = ref)}
                collapsable={false}
              >
                <UpgradeCard
                  upgrade={upgrade}
                  canAfford={reputation >= upgrade.reputationCost && !upgrade.purchased}
                  onPurchase={() => purchaseUpgrade(upgrade.id)}
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
