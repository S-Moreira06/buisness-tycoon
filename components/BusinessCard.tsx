import { useHaptics } from '@/hooks/useHaptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useBusinessData } from '../hooks/useBusinessData';
import { useGameStore } from '../hooks/useGameStore';
import { BusinessActions } from './business/BusinessActions';
import { BusinessHeader } from './business/BusinessHeader';
import { BusinessStats } from './business/BusinessStats';
import { BusinessUpgradesModal } from './business/BusinessUpgradesModal';

interface BusinessCardProps {
  businessId: string;
  name: string;
  baseIncome: number;
  buyPrice: number;
  baseCost?: number,
}

export const BusinessCard = ({
  businessId,
  name,
  buyPrice,
  baseCost,
}: BusinessCardProps) => {
  const router = useRouter();
  const { businesses, money, buyBusiness, upgradeBusiness, upgrades } = useGameStore();
  const { triggerSuccess, triggerMedium } = useHaptics();
  const business = businesses[businessId];
  const [modalVisible, setModalVisible] = useState(false);

  // FIX: passer businessId en paramètre
  const {
    upgradeCost,
    upgradeBoost,
    incomePerSecond,
    incomeLabel,
    businessUpgrades,
    purchasedUpgrades,
    availableUpgrades,
    lockedUpgrades,
    hasUpgrades,
  } = useBusinessData(businessId, business, upgrades);

  const canUpgrade = business?.owned && money >= upgradeCost;
  const canBuy = money >= buyPrice;

  const handleUpgradePress = (upgradeId: string) => {
    setModalVisible(false);
    router.push({
      pathname: '/(game)/(tabs)/upgrades',
      params: { scrollTo: upgradeId },
    });
  };
  const handleBuy = () => {
    triggerSuccess(); // Feedback de succès pour l'achat [code_file:1]
    buyBusiness(businessId, buyPrice);
  };

  const handleUpgrade = () => {
    triggerMedium(); // Feedback sec pour l'upgrade [code_file:1]
    upgradeBusiness(businessId, upgradeCost);
  };
  return (
    <>
      <LinearGradient
        colors={business?.owned ? ['#1a1a2e', '#16213e'] : ['#0f0f1e', '#1a1a2e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, business?.owned && styles.ownedCard]}
      >
        <BusinessHeader
          name={name}
          quantity={business?.quantity || 0}
          level={business?.level || 0}
          hasUpgrades={hasUpgrades}
          purchasedCount={purchasedUpgrades.length}
          totalCount={businessUpgrades.length}
          onUpgradesPress={() => setModalVisible(true)}
        />

        {business?.owned && (
          <BusinessStats
            incomePerSecond={incomePerSecond}
            incomeLabel={incomeLabel}
            upgradeCost={upgradeCost}
            upgradeBoost={upgradeBoost}
          />
        )}

        <BusinessActions
          owned={business?.owned || false}
          buyPrice={buyPrice}
          upgradeCost={upgradeCost}
          canBuy={canBuy}
          canUpgrade={canUpgrade}
          onBuy={handleBuy} 
          onUpgrade={handleUpgrade}
        />

        {business?.owned && <View style={styles.glowBorder} />}
      </LinearGradient>

      <BusinessUpgradesModal
        visible={modalVisible}
        businessName={name}
        purchasedUpgrades={purchasedUpgrades}
        availableUpgrades={availableUpgrades}
        totalUpgrades={businessUpgrades.length}
        onClose={() => setModalVisible(false)}
        onUpgradePress={handleUpgradePress}
        lockedUpgrades={lockedUpgrades}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    paddingBottom: 8,
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
});
