import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface BusinessHeaderProps {
  name: string;
  quantity: number;
  level: number;
  hasUpgrades: boolean;
  purchasedCount: number;
  totalCount: number;
  onUpgradesPress: () => void;
}

export const BusinessHeader = ({
  name,
  quantity,
  level,
  hasUpgrades,
  purchasedCount,
  totalCount,
  onUpgradesPress,
}: BusinessHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.badges}>
        {quantity > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>×{quantity}</Text>
          </View>
        )}
        {level > 0 && (
          <View style={[styles.badge, styles.levelBadge]}>
            <Text style={styles.levelText}>Lv.{level}</Text>
          </View>
        )}
        {hasUpgrades && (
          <Pressable
            style={[
              styles.badge,
              purchasedCount === totalCount
                ? styles.upgradesBadgeFull
                : purchasedCount > 0
                ? styles.upgradesBadgePartial
                : styles.upgradesBadgeNone,
            ]}
            onPress={onUpgradesPress}
          >
            <Text style={styles.upgradesBadgeText}>
              ⭐ {purchasedCount}/{totalCount}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
});
