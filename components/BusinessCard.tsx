import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { GAME_CONFIG } from '../constants/gameConfig';
import { useGameStore } from '../hooks/useGameStore';

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
  const { businesses, money, buyBusiness, upgradeBusiness } = useGameStore();
  const business = businesses[businessId];
  const upgradeCost = Math.floor(buyPrice * (business?.level + 1) * 1.5);

  const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
  const totalIncome = business?.income * (business?.quantity || 1);
  const incomePerSecond = totalIncome / intervalInSeconds;

  const incomeLabel =
    intervalInSeconds === 1 ? '/sec' : `/${intervalInSeconds}s`;

  const canUpgrade = business?.owned && money >= upgradeCost;
  const canBuy = money >= buyPrice;

  return (
    <LinearGradient
      colors={
        business?.owned
          ? ['#1a1a2e', '#16213e']
          : ['#0f0f1e', '#1a1a2e']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, business?.owned && styles.ownedCard]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
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
  );
};

const styles = StyleSheet.create({
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
});
