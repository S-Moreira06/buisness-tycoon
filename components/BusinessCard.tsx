import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { GAME_CONFIG } from '../constants/gameConfig'; // 🆕 Import
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

  // 🆕 Calcul du gain adaptatif selon l'intervalle
  const intervalInSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;
  const totalIncome = business?.income * (business?.quantity || 1);
  const incomePerSecond = totalIncome / intervalInSeconds;

  // 🆕 Label dynamique selon l'intervalle
  const incomeLabel = intervalInSeconds === 1 
    ? 'Gain/sec' 
    : `Gain/${intervalInSeconds}s`;

  const canUpgrade = business?.owned && money >= upgradeCost;

  return (
    <Card style={[styles.card, business?.owned && styles.owned]}>
      <Card.Content>
        <Text style={styles.title}>
          {name} (x{business?.quantity || 0}) Lvl {business?.level}
        </Text>
        <Text style={styles.text}>
          {/* 🆕 Affichage avec 2 décimales max */}
          💰 {incomeLabel}: {incomePerSecond.toFixed(2)}€
        </Text>
        <Text style={styles.text}>Coût upgrade: {upgradeCost.toLocaleString()}€</Text>
      </Card.Content>
      <Card.Actions style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => buyBusiness(businessId, buyPrice)}
          disabled={money < buyPrice}
          style={styles.button}
        >
          Acheter: ${buyPrice.toLocaleString()}
        </Button>

        {business?.owned && (
          <Button
            mode="contained"
            onPress={() => upgradeBusiness(businessId, upgradeCost)}
            disabled={!canUpgrade}
            style={styles.button}
          >
            Upgrade
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  owned: {
    backgroundColor: '#e8f5e9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 8,
  },
});
