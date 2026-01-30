import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UpgradeCard } from '../../../components/UpgradeCard';
import { useGameStore } from '../../../hooks/useGameStore';

type TabType = 'all' | 'available' | 'purchased';

export default function UpgradesScreen() {
  const { upgrades, reputation, purchaseUpgrade, businesses } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const allUpgrades = Object.values(upgrades).filter((upgrade) =>
    upgrade.affectedBusinesses.some(
      (businessId) => businesses[businessId]?.owned
    )
  );

  const purchasedUpgrades = allUpgrades.filter(u => u.purchased);
  const availableUpgrades = allUpgrades.filter(u => !u.purchased);

  // Sélection des upgrades selon l'onglet actif
  const displayedUpgrades = 
    activeTab === 'all' ? allUpgrades :
    activeTab === 'purchased' ? purchasedUpgrades :
    availableUpgrades;

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* Header avec stats */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>⭐ Améliorations</Text>
            {allUpgrades.length > 0 && (
              <Text style={styles.subtitle}>
                {purchasedUpgrades.length} / {allUpgrades.length} débloquées
              </Text>
            )}
          </View>

          {/* Badge réputation */}
          <LinearGradient
            colors={['#fbbf24', '#f59e0b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reputationBadge}
          >
            <Text style={styles.reputationIcon}>⭐</Text>
            <View style={styles.reputationContent}>
              <Text style={styles.reputationLabel}>Réputation</Text>
              <Text style={styles.reputationValue}>{reputation}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            {activeTab === 'all' && (
              <LinearGradient
                colors={['#a855f7', '#7c3aed']}
                style={styles.tabGradient}
              />
            )}
            <Text style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText
            ]}>
              📋 Tous
            </Text>
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{allUpgrades.length}</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            {activeTab === 'available' && (
              <LinearGradient
                colors={['#a855f7', '#7c3aed']}
                style={styles.tabGradient}
              />
            )}
            <Text style={[
              styles.tabText,
              activeTab === 'available' && styles.activeTabText
            ]}>
              🛒 Disponibles
            </Text>
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{availableUpgrades.length}</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'purchased' && styles.activeTab]}
            onPress={() => setActiveTab('purchased')}
          >
            {activeTab === 'purchased' && (
              <LinearGradient
                colors={['#a855f7', '#7c3aed']}
                style={styles.tabGradient}
              />
            )}
            <Text style={[
              styles.tabText,
              activeTab === 'purchased' && styles.activeTabText
            ]}>
              ✅ Possédées
            </Text>
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{purchasedUpgrades.length}</Text>
            </View>
          </Pressable>
        </View>

        {/* Liste ou message vide */}
        {displayedUpgrades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e']}
              style={styles.emptyCard}
            >
              <Text style={styles.emptyEmoji}>
                {activeTab === 'all' ? '🏢' : 
                 activeTab === 'purchased' ? '🎯' : 
                 '💰'}
              </Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'all' ? 'Aucune amélioration disponible' :
                 activeTab === 'purchased' ? 'Aucune amélioration possédée' :
                 'Aucune amélioration à acheter'}
              </Text>
              <Text style={styles.emptyMessage}>
                {activeTab === 'all' 
                  ? 'Achète des businesses pour débloquer des upgrades !'
                  : activeTab === 'purchased'
                  ? 'Achète des améliorations pour booster tes revenus !'
                  : 'Félicitations ! Tu as acheté toutes les améliorations disponibles !'}
              </Text>
            </LinearGradient>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {displayedUpgrades.map((upgrade) => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={reputation >= upgrade.reputationCost && !upgrade.purchased}
                onPurchase={() => purchaseUpgrade(upgrade.id)}
              />
            ))}
            {/* Padding en bas pour la tab bar */}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  reputationIcon: {
    fontSize: 20,
  },
  reputationContent: {
    alignItems: 'flex-end',
  },
  reputationLabel: {
    fontSize: 10,
    color: '#0a0a0a',
    fontWeight: '600',
  },
  reputationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a0a0a',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#374151',
    position: 'relative',
    overflow: 'hidden',
    gap: 6,
  },
  activeTab: {
    borderColor: '#a855f7',
    borderWidth: 2,
  },
  tabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabBadge: {
    backgroundColor: '#374151',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
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
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
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
