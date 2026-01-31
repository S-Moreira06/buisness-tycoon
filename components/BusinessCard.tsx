import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { GAME_CONFIG } from '../constants/gameConfig';
import { TIER_CONFIG } from '../constants/tierConfig';
import { useGameStore } from '../hooks/useGameStore';
import { CustomModal } from './CustomModal';

interface BusinessCardProps {
  businessId: string;
  name: string;
  baseIncome: number;
  buyPrice: number;
}

export const BusinessCard = ({
  businessId,
  name,
  baseIncome,
  buyPrice,
}: BusinessCardProps) => {
  const router = useRouter();
  const { businesses, money, buyBusiness, upgradeBusiness, upgrades } = useGameStore();
  const business = businesses[businessId];
  const [modalVisible, setModalVisible] = useState(false);

  const upgradeCost = Math.floor(buyPrice * (business?.level + 1) * 1.5);
  const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
  const totalIncome = business?.income * (business?.quantity || 1);
  const incomePerSecond = totalIncome / intervalInSeconds;
  const incomeLabel = intervalInSeconds === 1 ? '/sec' : `/${intervalInSeconds}s`;
  const canUpgrade = business?.owned && money >= upgradeCost;
  const canBuy = money >= buyPrice;

  // 🆕 Compter les upgrades qui affectent ce business
  const businessUpgrades = Object.values(upgrades).filter((upgrade) =>
    upgrade.affectedBusinesses.includes(businessId)
  );
  const purchasedUpgrades = businessUpgrades.filter((u) => u.purchased);
  const availableUpgrades = businessUpgrades.filter((u) => !u.purchased);
  const hasUpgrades = businessUpgrades.length > 0;

  // 🆕 Navigation vers la page upgrades avec l'ID de l'upgrade
  const handleUpgradePress = (upgradeId: string) => {
    setModalVisible(false);
    router.push({
      pathname: '/(game)/(tabs)/upgrades',
      params: { scrollTo: upgradeId },
    });
  };

  return (
    <>
      <LinearGradient
        colors={business?.owned ? ['#1a1a2e', '#16213e'] : ['#0f0f1e', '#1a1a2e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, business?.owned && styles.ownedCard]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.badges}>
            {business?.quantity > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>×{business.quantity}</Text>
              </View>
            )}
            {business?.level > 0 && (
              <View style={[styles.badge, styles.levelBadge]}>
                <Text style={styles.levelText}>Lv.{business.level}</Text>
              </View>
            )}
            {/* 🆕 Badge upgrades cliquable */}
            {hasUpgrades && (
              <Pressable
                style={[
                  styles.badge,
                  purchasedUpgrades.length === businessUpgrades.length
                    ? styles.upgradesBadgeFull
                    : purchasedUpgrades.length > 0
                    ? styles.upgradesBadgePartial
                    : styles.upgradesBadgeNone,
                ]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.upgradesBadgeText}>
                  ⭐ {purchasedUpgrades.length}/{businessUpgrades.length}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Stats */}
        {business?.owned && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>💰 Revenu</Text>
              <Text style={styles.statValue}>
                {incomePerSecond.toFixed(2)}€{incomeLabel}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>🔼 Upgrade</Text>
              <Text style={styles.statValue}>
                {upgradeCost.toLocaleString()}€
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {!business?.owned ? (
            <Button
              mode="contained"
              onPress={() => buyBusiness(businessId, buyPrice)}
              disabled={!canBuy}
              style={styles.buyButton}
              buttonColor={canBuy ? '#a855f7' : '#374151'}
              textColor="#ffffff"
              icon="cash"
            >
              Acheter {buyPrice.toLocaleString()}€
            </Button>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={() => buyBusiness(businessId, buyPrice)}
                disabled={!canBuy}
                style={[styles.actionButton, styles.buyMoreButton]}
                buttonColor={canBuy ? '#10b981' : '#374151'}
                textColor="#ffffff"
                compact
              >
                +1
              </Button>
              <Button
                mode="contained"
                onPress={() => upgradeBusiness(businessId, upgradeCost)}
                disabled={!canUpgrade}
                style={[styles.actionButton, styles.upgradeButton]}
                buttonColor={canUpgrade ? '#f59e0b' : '#374151'}
                textColor="#ffffff"
                compact
              >
                ⬆ Upgrade
              </Button>
            </>
          )}
        </View>

        {/* Bordure brillante si owned */}
        {business?.owned && <View style={styles.glowBorder} />}
      </LinearGradient>

            {/* 🆕 MODALE LISTE DES UPGRADES REFACTORISÉE */}
      <CustomModal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={styles.modalInnerContent}>
          
          {/* Header Modale */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{name}</Text>
            <Text style={styles.modalSubtitle}>
              {purchasedUpgrades.length} / {businessUpgrades.length} améliorations actives
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Liste Scrollable Limitée */}
          <ScrollView 
            style={styles.upgradesList} 
            showsVerticalScrollIndicator={true} // Utile ici pour voir qu'il y a plus
            indicatorStyle="white"
          >
            {/* Message si vide */}
            {businessUpgrades.length === 0 && (
              <Text style={styles.emptyMessage}>
                Aucune amélioration disponible pour ce business
              </Text>
            )}

            {/* Liste : Possédées */}
            {purchasedUpgrades.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>✅ Possédées</Text>
                {purchasedUpgrades.map((upgrade) => (
                  <Pressable
                    key={upgrade.id}
                    onPress={() => handleUpgradePress(upgrade.id)}
                    style={styles.upgradeItem}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                      style={styles.upgradeItemGradient}
                    >
                      {/* Barre de couleur du Tier */}
                      <View style={[styles.upgradeItemTierBar, { backgroundColor: TIER_CONFIG[upgrade.tier].color || '#fff' }]} />
                      
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Text style={styles.upgradeItemName}>{upgrade.name}</Text>
                           <Text style={styles.upgradeItemBonus}>+{Math.round((upgrade.multiplier - 1) * 100)}%</Text>
                        </View>
                        
                        <Text style={styles.upgradeItemDesc} numberOfLines={1}>
                          {upgrade.description}
                        </Text>
                        
                        <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: '#9ca3af' }}>
                                {TIER_CONFIG[upgrade.tier].icon} {TIER_CONFIG[upgrade.tier].label}
                            </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Liste : Disponibles */}
            {availableUpgrades.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>🔓 Disponibles</Text>
                {availableUpgrades.map((upgrade) => (
                  <Pressable
                    key={upgrade.id}
                    onPress={() => handleUpgradePress(upgrade.id)}
                    style={styles.upgradeItem}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                      style={styles.upgradeItemGradient}
                    >
                      <View style={[styles.upgradeItemTierBar, { backgroundColor: TIER_CONFIG[upgrade.tier].color || '#fff' }]} />
                      
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Text style={styles.upgradeItemName}>{upgrade.name}</Text>
                           <Text style={styles.upgradeItemCost}>⭐ {upgrade.reputationCost}</Text>
                        </View>
                        
                        <Text style={styles.upgradeItemBonus}>
                            Effect: +{Math.round((upgrade.multiplier - 1) * 100)}%
                        </Text>
                        
                        <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                            {TIER_CONFIG[upgrade.tier].icon} {TIER_CONFIG[upgrade.tier].label}
                        </Text>
                      </View>
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
             <Button onPress={() => setModalVisible(false)} textColor="#9ca3af">
              Fermer
            </Button>
          </View>

        </View>
      </CustomModal>

    </>
  );
};

const styles = StyleSheet.create({
  // ========== STYLES EXISTANTS (INCHANGÉS) ==========
  card: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    position: 'relative',
    overflow: 'hidden',
  },
  ownedCard: {
    borderColor: '#a855f7',
    borderWidth: 2,
  },
  glowBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  levelBadge: {
    backgroundColor: '#a855f7',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  buyButton: {
    flex: 1,
    borderRadius: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  buyMoreButton: {
    flex: 0.4,
  },
  upgradeButton: {
    flex: 0.6,
  },

  // ========== 🆕 NOUVEAUX STYLES BADGE UPGRADES ==========
  upgradesBadgeFull: {
    backgroundColor: '#10b981',
  },
  upgradesBadgePartial: {
    backgroundColor: '#f59e0b',
  },
  upgradesBadgeNone: {
    backgroundColor: '#6b7280',
  },
  upgradesBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },

    // ========== 🆕 STYLES MODALE REFACTORISÉS ==========
  modalInnerContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Fond sombre unifié
    padding: 24,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d1d5db',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyMessage: {
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  // ✅ LA LIMITATION DEMANDÉE EST ICI
  upgradesList: {
    maxHeight: 300, 
    flexGrow: 0, 
  },
  modalFooter: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  
  // Styles des items
  upgradeItem: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  upgradeItemGradient: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  upgradeItemTierBar: {
    width: 3,
    borderRadius: 2,
    opacity: 0.8,
  },
  upgradeItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  upgradeItemBonus: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10b981',
  },
  upgradeItemDesc: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  upgradeItemCost: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fbbf24',
  },

});
