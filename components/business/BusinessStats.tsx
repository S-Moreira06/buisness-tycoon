import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BusinessStatsProps {
  incomePerSecond: number;
  incomeLabel: string;
  upgradeCost: number;
}

export const BusinessStats = ({
  incomePerSecond,
  incomeLabel,
  upgradeCost,
}: BusinessStatsProps) => {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>💰 Revenu</Text>
        <Text style={styles.statValue}>
          {incomePerSecond.toFixed(2)}€{incomeLabel}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>🔼 Upgrade</Text>
        <Text style={styles.statValue}>{upgradeCost.toLocaleString()}€</Text>
      </View>
    </View>
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
