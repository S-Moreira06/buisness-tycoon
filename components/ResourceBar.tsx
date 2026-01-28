import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useGameStore } from '../hooks/useGameStore';

export const ResourceBar = () => {
  const { money, reputation, totalPassiveIncome } = useGameStore();

  // Barre de progression basée sur l'argent (0-1M)
  const moneyProgress = Math.min(money / 1000000, 1);

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>💵 Argent: ${money.toLocaleString()}</Text>
        <ProgressBar progress={moneyProgress} style={styles.bar} />
      </View>

      <View style={styles.stat}>
        <Text style={styles.label}>⭐ Réputation: {reputation}</Text>
      </View>

      <View style={styles.stat}>
        <Text style={styles.label}>
          📈 Passif/sec: ${totalPassiveIncome.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
  },
  stat: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
});
