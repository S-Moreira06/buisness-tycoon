import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UpgradesHeaderProps {
  allUpgradesCount: number;
  purchasedCount: number;
  reputation: number;
}

export const UpgradesHeader = ({
  allUpgradesCount,
  purchasedCount,
  reputation,
}: UpgradesHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>⭐Boosts</Text>
        {allUpgradesCount > 0 && (
          <Text style={styles.subtitle}>
            {purchasedCount} / {allUpgradesCount} débloquées
          </Text>
        )}
      </View>

      <LinearGradient
        colors={['#fbbf24', '#f59e0b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.reputationBadge}
      >
        <Text style={styles.reputationIcon}>⭐</Text>
        <View style={styles.reputationContent}>
          <Text style={styles.reputationLabel}>Réputation</Text>
          <Text style={styles.reputationValue}>{reputation.toFixed(0)}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,


  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#fb7324',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },
  reputationIcon: {
    fontSize: 20,
  },
  reputationContent: {
    alignItems: 'flex-end',
  },
  reputationLabel: {
    fontSize: 8,
    color: '#0a0a0a',
    fontWeight: '600',
  },
  reputationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a0a0a',
  },
});
