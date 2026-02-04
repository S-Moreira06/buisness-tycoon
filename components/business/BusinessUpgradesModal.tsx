import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { TIER_CONFIG } from '../../constants/tierConfig';
import { useGameStore } from '../../hooks/useGameStore';
import { useUpgradeUnlock } from '../../hooks/useUpgradeUnlock';
import { CustomModal } from '../CustomModal';

interface BusinessUpgradesModalProps {
  visible: boolean;
  businessName: string;
  purchasedUpgrades: any[];
  availableUpgrades: any[];
  lockedUpgrades: any[]; // 🆕 Ajout des upgrades verrouillées
  totalUpgrades: number;
  onClose: () => void;
  onUpgradePress: (upgradeId: string) => void;
}

export const BusinessUpgradesModal = ({
  visible,
  businessName,
  purchasedUpgrades,
  availableUpgrades,
  lockedUpgrades,
  totalUpgrades,
  onClose,
  onUpgradePress,
}: BusinessUpgradesModalProps) => {
  return (
    <CustomModal visible={visible} onDismiss={onClose}>
      <View style={styles.modalInnerContent}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{businessName}</Text>
          <Text style={styles.modalSubtitle}>
            {purchasedUpgrades.length} / {totalUpgrades} améliorations actives
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Liste Scrollable */}
        <ScrollView style={styles.upgradesList} showsVerticalScrollIndicator={false}>
          {totalUpgrades === 0 && (
            <Text style={styles.emptyMessage}>
              Aucune amélioration disponible pour ce business
            </Text>
          )}

          {/* Possédées */}
          {purchasedUpgrades.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Possédées</Text>
              {purchasedUpgrades.map((upgrade) => (
                <Pressable
                  key={upgrade.id}
                  onPress={() => onUpgradePress(upgrade.id)}
                  style={styles.upgradeItem}
                >
                  <LinearGradient
                    colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.15)']}
                    style={styles.upgradeItemGradient}
                  >
                    <LinearGradient
                      colors={TIER_CONFIG[upgrade.tier].gradient}
                      style={styles.upgradeItemTierBar}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.upgradeItemName}>{upgrade.name}</Text>
                      <Text style={styles.upgradeItemBonus}>
                        +{Math.round((upgrade.multiplier - 1) * 100)}%
                      </Text>
                      <Text style={styles.upgradeItemDesc}>{upgrade.description}</Text>
                      <Text style={[styles.upgradeItemDesc, { marginTop: 4 }]}>
                        {TIER_CONFIG[upgrade.tier].icon} {TIER_CONFIG[upgrade.tier].label}
                      </Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </>
          )}

          {/* Disponibles */}
          {availableUpgrades.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Disponibles</Text>
              {availableUpgrades.map((upgrade) => (
                <Pressable
                  key={upgrade.id}
                  onPress={() => onUpgradePress(upgrade.id)}
                  style={styles.upgradeItem}
                >
                  <LinearGradient
                    colors={['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)']}
                    style={styles.upgradeItemGradient}
                  >
                    <LinearGradient
                      colors={TIER_CONFIG[upgrade.tier].gradient}
                      style={styles.upgradeItemTierBar}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.upgradeItemName}>{upgrade.name}</Text>
                      <Text style={styles.upgradeItemCost}>⭐{upgrade.reputationCost}</Text>
                      <Text style={styles.upgradeItemBonus}>
                        Effect: +{Math.round((upgrade.multiplier - 1) * 100)}%
                      </Text>
                      <Text style={[styles.upgradeItemDesc, { marginTop: 4 }]}>
                        {TIER_CONFIG[upgrade.tier].icon} {TIER_CONFIG[upgrade.tier].label}
                      </Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </>
          )}

          {/* 🆕 VERROUILLÉES (affichage simple) */}
          {lockedUpgrades.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Verrouillées</Text>
              {lockedUpgrades.map((upgrade) => (
                <LockedUpgradeItem key={upgrade.id} upgrade={upgrade} />
              ))}
            </>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Button mode="text" onPress={onClose} textColor="#9ca3af">
            Fermer
          </Button>
        </View>
      </View>
    </CustomModal>
  );
};

// 🆕 Composant pour afficher les upgrades verrouillées
const LockedUpgradeItem = ({ upgrade }: { upgrade: any }) => {
  const { businesses, stats, totalPassiveIncome, playerLevel, combo } = useGameStore();

  const { isUnlocked } = useUpgradeUnlock(upgrade.unlockConditions, {
    businesses,
    stats,
    totalPassiveIncome,
    playerLevel,
    combo,
  });

  // Si c'est déverrouillé, ne pas afficher ici (sécurité)
  if (isUnlocked) return null;

  return (
    <View style={styles.upgradeItem}>
      <LinearGradient
        colors={['rgba(55, 65, 81, 0.3)', 'rgba(107, 114, 128, 0.2)']}
        style={styles.upgradeItemGradient}
      >
        <View style={[styles.upgradeItemTierBar, { backgroundColor: '#6b7280' }]} />
        <View style={{ flex: 1, marginLeft: 10, alignItems: 'center' }}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedTitle}>? ? ?</Text>
          <Text style={styles.lockedSubtitle}>Amélioration verrouillée</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  modalInnerContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
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
  // 🆕 STYLES POUR VERROUILLAGE
  lockedIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 8,
  },
  lockedSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
