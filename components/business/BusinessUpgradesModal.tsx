import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { TIER_CONFIG } from '../../constants/tierConfig';
import { CustomModal } from '../CustomModal';

interface BusinessUpgradesModalProps {
  visible: boolean;
  businessName: string;
  purchasedUpgrades: any[];
  availableUpgrades: any[];
  totalUpgrades: number;
  onClose: () => void;
  onUpgradePress: (upgradeId: string) => void;
}

export const BusinessUpgradesModal = ({
  visible,
  businessName,
  purchasedUpgrades,
  availableUpgrades,
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
        <ScrollView
          style={styles.upgradesList}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
        >
          {totalUpgrades === 0 && (
            <Text style={styles.emptyMessage}>
              Aucune amélioration disponible pour ce business
            </Text>
          )}

          {/* Possédées */}
          {purchasedUpgrades.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Possédées</Text>
              {purchasedUpgrades.map((upgrade) => (
                <Pressable
                  key={upgrade.id}
                  onPress={() => onUpgradePress(upgrade.id)}
                  style={styles.upgradeItem}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                    style={styles.upgradeItemGradient}
                  >
                    <View
                      style={[
                        styles.upgradeItemTierBar,
                        { backgroundColor: TIER_CONFIG[upgrade.tier].color + 'ff' },
                      ]}
                    />
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.upgradeItemName}>{upgrade.name}</Text>
                        <Text style={styles.upgradeItemBonus}>
                          +{Math.round((upgrade.multiplier - 1) * 100)}%
                        </Text>
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

          {/* Disponibles */}
          {availableUpgrades.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Disponibles</Text>
              {availableUpgrades.map((upgrade) => (
                <Pressable
                  key={upgrade.id}
                  onPress={() => onUpgradePress(upgrade.id)}
                  style={styles.upgradeItem}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                    style={styles.upgradeItemGradient}
                  >
                    <View
                      style={[
                        styles.upgradeItemTierBar,
                        { backgroundColor: TIER_CONFIG[upgrade.tier].color + 'ff' },
                      ]}
                    />
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.upgradeItemName}>{upgrade.name}</Text>
                        <Text style={styles.upgradeItemCost}>⭐{upgrade.reputationCost}</Text>
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
          <Button onPress={onClose} textColor="#9ca3af">
            Fermer
          </Button>
        </View>
      </View>
    </CustomModal>
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
});
