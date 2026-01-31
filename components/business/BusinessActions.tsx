import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface BusinessActionsProps {
  owned: boolean;
  buyPrice: number;
  upgradeCost: number;
  canBuy: boolean;
  canUpgrade: boolean;
  onBuy: () => void;
  onUpgrade: () => void;
}

export const BusinessActions = ({
  owned,
  buyPrice,
  upgradeCost,
  canBuy,
  canUpgrade,
  onBuy,
  onUpgrade,
}: BusinessActionsProps) => {
  return (
    <View style={styles.actions}>
      {!owned ? (
        <Button
          mode="contained"
          onPress={onBuy}
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
            onPress={onBuy}
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
            onPress={onUpgrade}
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
  );
};

const styles = StyleSheet.create({
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
});
