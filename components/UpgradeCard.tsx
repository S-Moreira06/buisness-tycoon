import { GAME_CONFIG } from '@/constants/gameConfig';
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
}


export const UpgradeCard = ({ upgrade, canAfford, onPurchase }: UpgradeCardProps) => {
  const multiplierPercent = Math.round((upgrade.multiplier - 1) * 100);
  const [modalVisible, setModalVisible] = useState(false);
  const { businesses } = useGameStore();

  // Récupérer les infos de tous les businesses affectés
  // const getAffectedBusinessesInfo = () => {
  //   return upgrade.affectedBusinesses.map((businessId: string) => {
      // const config = BUSINESSES_CONFIG[businessId];
      // const business = businesses[businessId];
      // const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
      
      // const currentIncome = business?.income || 0;
      // const totalIncome = currentIncome * (business?.quantity || 0);
      // const incomePerSecond = totalIncome / intervalInSeconds;
      
      // const futureIncome = upgrade.purchased 
      //   ? currentIncome 
      //   : currentIncome * upgrade.multiplier;
      // const futureTotalIncome = futureIncome * (business?.quantity || 0);
      // const futureIncomePerSecond = futureTotalIncome / intervalInSeconds;
      
      // const incomeDiff = futureIncomePerSecond - incomePerSecond;

  //     return {
  //       id: businessId,
  //       emoji: config?.emoji || '❓',
  //       name: config?.name || 'Inconnu',
  //       owned: business?.owned || false,
  //       quantity: business?.quantity || 0,
  //       level: business?.level || 0,
  //       currentIncome: incomePerSecond,
  //       futureIncome: futureIncomePerSecond,
  //       incomeDiff,
  //       intervalInSeconds,
  //     };
  //   });
  // };
  const getAffectedBusinessesInfo = (): AffectedBusinessInfo[] => {
        return upgrade.affectedBusinesses.map((businessId: string) => {
            const config = BUSINESSES_CONFIG[businessId];
            const business = businesses[businessId];
            const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
            
            const currentIncome = business?.income || 0;
            const totalIncome = currentIncome * (business?.quantity || 0);
            const incomePerSecond = totalIncome / intervalInSeconds;
            
            const futureIncome = upgrade.purchased 
              ? currentIncome 
              : currentIncome * upgrade.multiplier;
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
  
  // Calcul du gain total
  const totalCurrentIncome = ownedBusinesses.reduce((sum, b) => sum + b.currentIncome, 0);
  const totalFutureIncome = ownedBusinesses.reduce((sum, b) => sum + b.futureIncome, 0);
  const totalGain = totalFutureIncome - totalCurrentIncome;
  const totalGainPercent = totalCurrentIncome > 0 
    ? ((totalGain / totalCurrentIncome) * 100).toFixed(0) 
    : '0';

  const handleCardPress = () => {
    setModalVisible(true);
  };

  const handlePurchase = (e: any) => {
    e.stopPropagation(); // Empêcher l'ouverture de la modale
    onPurchase();
  };

  return (
    <>
      {/* Card cliquable */}
      <Pressable onPress={handleCardPress}>
        <LinearGradient
          colors={
            upgrade.purchased
              ? ['#16213e', '#0f3460']
              : ['#1a1a2e', '#16213e']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, upgrade.purchased && styles.purchasedCard]}
        >
          {/* 🆕 Barre top avec couleur du tier */}
          {!upgrade.purchased && (
            <LinearGradient
              colors={TIER_CONFIG[upgrade.tier].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.topGlow}
            />
          )}


          {/* Header avec tier badge */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {upgrade.name}
              </Text>
              
              {/* 🆕 Badge Tier */}
              <LinearGradient
                colors={TIER_CONFIG[upgrade.tier].gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tierBadge}
              >
                <Text style={styles.tierIcon}>
                  {TIER_CONFIG[upgrade.tier].icon}
                </Text>
                <Text style={styles.tierText}>
                  {TIER_CONFIG[upgrade.tier].label}
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.multiplierBadge}>
              <Text style={styles.multiplierText}>+{multiplierPercent}%</Text>
            </View>
          </View>


          {/* Description */}
          <Text style={styles.description} numberOfLines={3}>
            {upgrade.description}
          </Text>

          {/* Effet */}
          <View style={styles.effectContainer}>
            <View style={styles.effectBadge}>
              <Text style={styles.effectIcon}>📈</Text>
              <Text style={styles.effectText}>
                Boost de {multiplierPercent}% de revenu
              </Text>
            </View>
          </View>

          {/* Businesses affectés */}
          <View style={styles.affectedContainer}>
            <Text style={styles.affectedLabel}>Affecte:</Text>
            <View style={styles.affectedBadges}>
              {upgrade.affectedBusinesses.slice(0, 4).map((businessId: string) => {
                const config = BUSINESSES_CONFIG[businessId];
                return (
                  <View key={businessId} style={styles.businessBadge}>
                    <Text style={styles.businessEmoji}>
                      {config?.emoji || '❓'}
                    </Text>
                  </View>
                );
              })}
              {upgrade.affectedBusinesses.length > 4 && (
                <View style={styles.moreBadge}>
                  <Text style={styles.moreText}>
                    +{upgrade.affectedBusinesses.length - 4}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Bouton d'achat - empêche la propagation du clic */}
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

      {/* MODALE DÉTAILS UPGRADE */}
            {/* ================= MODALE REFACTORISÉE ================= */}
      <CustomModal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={styles.modalInnerContent}>
          
          {/* Header Modale */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.modalTitle}>{upgrade.name}</Text>
              <View style={[styles.tierBadge, { alignSelf: 'flex-start' }]}>
                <Text style={{ fontSize: 12 }}>{TIER_CONFIG[upgrade.tier].icon}</Text>
                <Text style={styles.tierLabel}>{TIER_CONFIG[upgrade.tier].label}</Text>
              </View>
            </View>
            
            <View style={styles.multiplierBadge}>
              <Text style={styles.multiplierText}>+{multiplierPercent}%</Text>
            </View>
          </View>

          {/* Contenu Scrollable */}
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>{upgrade.description}</Text>

            <View style={styles.divider} />

            {/* Section Businesses */}
            <Text style={styles.sectionTitle}>🏢 Businesses affectés</Text>
            
            <View style={{ gap: 8 }}>
              {affectedBusinesses.map((business) => (
                <View key={business.id} style={styles.businessRow}>
                  {/* Icone */}
                  <View style={styles.businessIconContainer}>
                    <Text style={{ fontSize: 20 }}>{business.emoji}</Text>
                  </View>
                  
                  {/* Infos */}
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

            {/* Total Gains (si applicable) */}
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
          </ScrollView>

          {/* Footer Actions */}
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
  height: 3, // 🆕 Un peu plus épais pour mieux voir
  shadowColor: '#000', // 🆕 Ombre dynamique
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
  // Styles modale
  modalOverlay: {
    flex: 1,
    marginTop: 115,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  blurContainer: {
    padding: 0,
    width: '90%',
    maxWidth: 420,
    maxHeight: '80%',
  },
  modalContent: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 16,
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
  businessesList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  businessItem: {
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 10,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  businessItemEmoji: {
    fontSize: 20,
  },
  businessItemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  notOwnedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  notOwnedBadgeText: {
    fontSize: 12,
  },
  businessStats: {
    gap: 6,
  },
  businessStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gainRow: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  businessStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  businessStatValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  futureText: {
    color: '#10b981',
  },
  gainText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  notOwnedItemText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  totalGainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#10b981',
    marginBottom: 16,
  },
  totalGainIcon: {
    fontSize: 28,
  },
  totalGainContent: {
    flex: 1,
  },
  totalGainLabel: {
    fontSize: 11,
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '600',
  },
  totalGainValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  totalGainPercent: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    opacity: 0.9,
  },
  alreadyPurchasedBanner: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  alreadyPurchasedText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // 🆕 STYLES TIER - À AJOUTER DANS StyleSheet.create
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
    // ... vos styles de carte existants ...

  // NOUVEAUX STYLES MODALE
  modalInnerContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)', // Fond sombre bleuté semi-transparent
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
  // tierBadge: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 6,
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 8,
  // },
  modalScroll: {
    maxHeight: 300,
    
  },
  // sectionTitle: {
  //   fontSize: 13,
  //   fontWeight: '700',
  //   color: '#9ca3af',
  //   marginBottom: 12,
  //   textTransform: 'uppercase',
  //   letterSpacing: 0.5,
  // },
  // divider: {
  //   height: 1,
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  //   marginVertical: 20,
  // },
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Vert très léger
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
  // totalGainValue: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#10b981',
  // },
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

});
