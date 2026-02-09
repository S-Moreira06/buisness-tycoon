// components/business/BusinessStats.tsx
import { formatIncomePerSecond } from '@/utils/formatNumber';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusinessStatsProps {
  incomePerSecond: number;
  incomeLabel: string;
  upgradeCost: number;
  upgradeBoost: number;
  quantity: number; // 🆕 AJOUT : nombre de business possédés
}

export const BusinessStats = ({
  incomePerSecond,
  upgradeCost,
  upgradeBoost,
  quantity, // 🆕
}: BusinessStatsProps) => {
  const [showUnit, setShowUnit] = useState(false); // 🆕 État du toggle

  // 🆕 Calculs selon le mode
  const income = showUnit ? incomePerSecond / quantity : incomePerSecond;
  const upgrade = showUnit ? upgradeBoost : upgradeBoost * quantity ;
  const badge = showUnit ? '- X 1' : `- X ${quantity}`;

  return (
    <TouchableOpacity 
      style={styles.statsRow} 
      onPress={() => setShowUnit(!showUnit)} // 🆕 Toggle au clic
      activeOpacity={0.7}
    >
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>💰 Revenu {badge}</Text>
        <Text style={styles.statValue}>
          {formatIncomePerSecond(income, false)}
        </Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statLabel}>🔼Bonus d'Upgrade {badge}</Text>
        <Text style={styles.statValue}>
          +{formatIncomePerSecond(upgrade,false)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
});
