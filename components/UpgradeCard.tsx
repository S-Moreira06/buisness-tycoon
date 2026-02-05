import { GAME_CONFIG } from '@/constants/gameConfig';
import { useHaptics } from '@/hooks/useHaptics';
import { useUpgradeUnlock } from '@/hooks/useUpgradeUnlock';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { BUSINESSES_CONFIG } from '../constants/businessesConfig';
import { TIER_CONFIG } from '../constants/tierConfig';
import { useGameStore } from '../hooks/useGameStore';
import { CustomModal } from './CustomModal';

interface AffectedBusinessInfo {
  id: string;
  emoji: string;
  name: string;
  owned: boolean;
  quantity: number;
  level: number;
  currentIncome: number;
  futureIncome: number;
  incomeDiff: number;
  intervalInSeconds: number;
}

interface UpgradeCardProps {
  upgrade: any;
  canAfford: boolean;
  onPurchase: () => void;
  type?: 'business' | 'click';
}

export const UpgradeCard = ({ upgrade, canAfford, onPurchase, type = 'business' }: UpgradeCardProps) => {
  const isClickUpgrade = type === 'click';
  const { businesses, stats, totalPassiveIncome, playerLevel, combo } = useGameStore();
  
  
  // ✅ CORRECTION : Passer un objet structuré correctement
  const { isUnlocked, progress, missingConditions } = useUpgradeUnlock(
    upgrade.unlockConditions,
    {
      businesses,
      stats,
      totalPassiveIncome,
      playerLevel,
      combo: combo ? { currentStreak: combo.currentStreak } : { currentStreak: 0 },
    }
  );

  // ✅ Ne pas afficher si verrouillé ET showWhenLocked = false
  if (!isUnlocked && upgrade.showWhenLocked === false) {
    return null;
  }

  const getBonusLabel = () => {
    if (isClickUpgrade) {
      if (upgrade.effectType === 'base_money') return `+${upgrade.effectValue}€`;
      if (upgrade.effectType === 'crit_chance') return `+${upgrade.effectValue * 100}% Crit`;
      if (upgrade.effectType === 'crit_multiplier') return `x${upgrade.effectValue} Crit`;
      return 'Bonus';
    }
    return `+${Math.round((upgrade.multiplier - 1) * 100)}%`;
  };

  const bonusLabel = getBonusLabel();
  const [modalVisible, setModalVisible] = useState(false);
  const { triggerSuccess, triggerLight } = useHaptics();

  const getAffectedBusinessesInfo = (): AffectedBusinessInfo[] => {
    if (isClickUpgrade) return [];
    if (!upgrade.affectedBusinesses) return [];
    
    return upgrade.affectedBusinesses.map((businessId: string) => {
      const config = BUSINESSES_CONFIG[businessId];
      const business = businesses[businessId];
      const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
      const currentIncome = business?.income || 0;
      const totalIncome = currentIncome * (business?.quantity || 0);
      const incomePerSecond = totalIncome / intervalInSeconds;
      const futureIncome = upgrade.purchased ? currentIncome : currentIncome * upgrade.multiplier;
      const futureTotalIncome = futureIncome * (business?.quantity || 0);
      const futureIncomePerSecond = futureTotalIncome / intervalInSeconds;
      const incomeDiff = futureIncomePerSecond - incomePerSecond;

      return {
        id: businessId,
        emoji: config?.emoji || '❓',
        name: config?.name || 'Inconnu',
        owned: business?.owned || false,
        quantity: business?.quantity || 0,
        level: business?.level || 0,
        currentIncome: incomePerSecond,
        futureIncome: futureIncomePerSecond,
        incomeDiff,
        intervalInSeconds,
      };
    });
  };

  const affectedBusinesses = getAffectedBusinessesInfo();
  const ownedBusinesses = affectedBusinesses.filter(b => b.owned);

  const totalCurrentIncome = ownedBusinesses.reduce((sum, b) => sum + b.currentIncome, 0);
  const totalFutureIncome = ownedBusinesses.reduce((sum, b) => sum + b.futureIncome, 0);
  const totalGain = totalFutureIncome - totalCurrentIncome;
  const totalGainPercent = totalCurrentIncome > 0
    ? ((totalGain / totalCurrentIncome) * 100).toFixed(0)
    : '0';

  const handleCardPress = () => {
    triggerLight();
    setModalVisible(true);
  };

  const handlePurchase = (e: any) => {
    e.stopPropagation();
    triggerSuccess();
    onPurchase();
  };

  // ✅ AFFICHAGE VERROUILLÉ
  if (!isUnlocked) {
    return (
      <Pressable onPress={handleCardPress} disabled={!isUnlocked}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          style={[styles.card, styles.lockedCard]}
        >
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedIcon}>🔒</Text>
            <Text style={styles.lockedTitle}>? ? ?</Text>
            <Text style={styles.lockedSubtitle}>Amélioration verrouillée</Text>

            <View style={styles.conditionsContainer}>
              <Text style={styles.conditionsTitle}>Conditions requises :</Text>
              {missingConditions.map((cond, index) => (
                <View key={index} style={styles.conditionRow}>
                  <View style={styles.conditionHeader}>
                    <Text style={styles.conditionLabel}>• {cond.label}</Text>
                    <Text style={styles.conditionProgress}>
                      {cond.current}/{cond.required}
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <LinearGradient
                      colors={['#f59e0b', '#f97316']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressBarFill, { width: `${cond.progress * 100}%` }]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.globalProgressContainer}>
              <Text style={styles.globalProgressLabel}>
                Progression globale : {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  // ✅ AFFICHAGE NORMAL (déverrouillé)
  return (
    <>
      <Pressable onPress={handleCardPress} disabled={upgrade.purchased}>
        <LinearGradient
          colors={upgrade.purchased ? ['#16213e', '#0f3460'] : ['#1a1a2e', '#16213e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, upgrade.purchased && styles.purchasedCard]}
        >
          {!upgrade.purchased && (
            <LinearGradient
              colors={TIER_CONFIG[upgrade.tier]?.gradient || ['#374151', '#6b7280']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.topGlow}
            />
          )}

          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {upgrade.name}
              </Text>

              <LinearGradient
                colors={TIER_CONFIG[upgrade.tier]?.gradient || ['#374151', '#6b7280']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tierBadge}
              >
                <Text style={styles.tierIcon}>{TIER_CONFIG[upgrade.tier]?.icon || '⭐'}</Text>
                <Text style={styles.tierText}>{TIER_CONFIG[upgrade.tier]?.label || 'Common'}</Text>
              </LinearGradient>
            </View>

            <View style={styles.multiplierBadge}>
              <Text style={styles.multiplierText}>{bonusLabel}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={3}>
            {upgrade.description}
          </Text>

          {isClickUpgrade && (
            <View style={styles.effectContainer}>
              <View style={styles.effectBadge}>
                <Text style={styles.effectIcon}>🖱️</Text>
                <Text style={styles.effectText}>
                  {upgrade.effectType === 'base_money' ? 'Augmente le gain par clic' :
                   upgrade.effectType === 'crit_chance' ? 'Augmente la chance critique' : 'Booste le multiplicateur critique'}
                </Text>
              </View>
            </View>
          )}

          {!isClickUpgrade && upgrade.affectedBusinesses && (
            <View style={styles.affectedContainer}>
              <Text style={styles.affectedLabel}>Affecte:</Text>
              <View style={styles.affectedBadges}>
                {upgrade.affectedBusinesses.slice(0, 4).map((businessId: string) => {
                  const config = BUSINESSES_CONFIG[businessId];
                  return (
                    <View key={businessId} style={styles.businessBadge}>
                      <Text style={styles.businessEmoji}>{config?.emoji || '❓'}</Text>
                    </View>
                  );
                })}
                {upgrade.affectedBusinesses.length > 4 && (
                  <View style={styles.moreBadge}>
                    <Text style={styles.moreText}>+{upgrade.affectedBusinesses.length - 4}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <Pressable onPress={handlePurchase}>
            {upgrade.purchased ? (
              <View style={styles.purchasedBanner}>
                <Text style={styles.purchasedText}>✅ Acheté</Text>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={handlePurchase}
                disabled={!canAfford}
                style={styles.button}
                buttonColor={canAfford ? '#fbbf24' : '#374151'}
                textColor={canAfford ? '#0a0a0a' : '#6b7280'}
                icon="star"
              >
                {upgrade.reputationCost} Réputation
              </Button>
            )}
          </Pressable>

          {upgrade.purchased && <View style={styles.purchasedGlow} />}
        </LinearGradient>
      </Pressable>

      {/* MODALE */}
      <CustomModal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={styles.modalInnerContent}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.modalTitle}>{upgrade.name}</Text>
              <LinearGradient
                colors={TIER_CONFIG[upgrade.tier]?.gradient || ['#374151', '#6b7280']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.tierBadge, { alignSelf: 'flex-start' }]}
              >
                <Text style={{ fontSize: 12 }}>{TIER_CONFIG[upgrade.tier]?.icon || '⭐'}</Text>
                <Text style={styles.tierLabel}>{TIER_CONFIG[upgrade.tier]?.label || 'Common'}</Text>
              </LinearGradient>
            </View>
            <View style={styles.multiplierBadge}>
              <Text style={styles.multiplierText}>{bonusLabel}</Text>
            </View>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>{upgrade.description}</Text>
            <View style={styles.divider} />

            {!isClickUpgrade && (
              <>
                <Text style={styles.sectionTitle}>🏢 Businesses affectés</Text>
                <View style={{ gap: 8 }}>
                  {affectedBusinesses.map((business) => (
                    <View key={business.id} style={styles.businessRow}>
                      <View style={styles.businessIconContainer}>
                        <Text style={{ fontSize: 20 }}>{business.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.businessName}>{business.name}</Text>
                        {business.owned && business.quantity > 0 ? (
                          <View>
                            <Text style={styles.businessStat}>
                              Actuel: <Text style={{ color: '#fff' }}>{business.currentIncome.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}€/s</Text>
                            </Text>
                            {!upgrade.purchased && (
                              <Text style={[styles.businessStat, { color: '#10b981' }]}>
                                Gain: +{business.incomeDiff.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}€/s
                              </Text>
                            )}
                          </View>
                        ) : (
                          <Text style={styles.businessStat}>{business.owned ? 'Aucune unité' : 'Non possédé'}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>

                {!upgrade.purchased && ownedBusinesses.length > 0 && totalCurrentIncome > 0 && (
                  <View style={styles.totalGainContainer}>
                    <Text style={styles.totalGainTitle}>Gain total estimé</Text>
                    <Text style={styles.totalGainValue}>
                      +{totalGain.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}€/s
                    </Text>
                    <Text style={styles.totalGainSub}>
                      (+{totalGainPercent}% de revenu total)
                    </Text>
                  </View>
                )}
              </>
            )}

            {isClickUpgrade && (
              <View style={styles.totalGainContainer}>
                <Text style={styles.totalGainTitle}>Effet Permanent</Text>
                <Text style={styles.totalGainValue}>{bonusLabel}</Text>
                <Text style={styles.totalGainSub}>sur vos clics</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            {upgrade.purchased ? (
              <View style={styles.purchasedBanner}>
                <Text style={styles.purchasedText}>✅ Amélioration active</Text>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={(e) => {
                  handlePurchase(e);
                  setModalVisible(false);
                }}
                style={styles.modalButton}
                contentStyle={{ height: 48 }}
                buttonColor={canAfford ? '#7c3aed' : '#374151'}
                disabled={!canAfford}
              >
                Acheter • {upgrade.reputationCost} 💎
              </Button>
            )}
            <Button
              onPress={() => setModalVisible(false)}
              textColor="#9ca3af"
              style={{ marginTop: 8 }}
            >
              Fermer
            </Button>
          </View>
        </View>
      </CustomModal>
    </>
  );
};

// Garde tous tes styles existants (ils sont OK)
const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    position: 'relative',
    overflow: 'hidden',
  },
  purchasedCard: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  multiplierText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  description: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 18,
    marginBottom: 12,
  },
  effectContainer: {
    marginBottom: 12,
  },
  effectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 8,
  },
  effectIcon: {
    fontSize: 16,
  },
  effectText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  affectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  affectedLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  affectedBadges: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  businessBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  businessEmoji: {
    fontSize: 16,
  },
  moreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  moreText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  button: {
    borderRadius: 10,
    elevation: 4,
  },
  purchasedBanner: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  purchasedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  purchasedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 22,
    marginBottom: 6,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tierIcon: {
    fontSize: 12,
  },
  tierText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  multiplierBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalInnerContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
  },
  tierLabel: {
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '600',
  },
  modalScroll: {
    maxHeight: 300,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  businessIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  businessStat: {
    fontSize: 12,
    color: '#9ca3af',
  },
  totalGainContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  totalGainTitle: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalGainValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  totalGainSub: {
    fontSize: 12,
    color: '#10b981',
    opacity: 0.8,
  },
  modalFooter: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  modalButton: {
    borderRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 12,
  },
  lockedCard: {
    borderColor: '#6b7280',
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.85,
  },
  lockedOverlay: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  lockedIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  lockedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 12,
    marginBottom: 6,
  },
  lockedSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  conditionsContainer: {
    width: '100%',
    backgroundColor: '#0a0a0a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 16,
  },
  conditionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  conditionRow: {
    marginBottom: 12,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  conditionLabel: {
    fontSize: 12,
    color: '#d1d5db',
    flex: 1,
  },
  conditionProgress: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    marginLeft: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  globalProgressContainer: {
    width: '100%',
    marginTop: 4,
  },
  globalProgressLabel: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
});
