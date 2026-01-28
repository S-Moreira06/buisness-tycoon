import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
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

  if (!business?.owned) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.text}>💰 Gain/sec: ${baseIncome}</Text>
          <Text style={styles.text}>Prix: ${buyPrice}</Text>
          <Button
            mode="contained"
            onPress={() => buyBusiness(businessId, buyPrice)}
            disabled={money < buyPrice}
            style={styles.button}
          >
            Acheter
          </Button>
        </Card.Content>
      </Card>
    );
  }

  const upgradeCost = Math.floor(buyPrice * (business.level + 1) * 1.5);

  return (
    <Card style={[styles.card, styles.owned]}>
      <Card.Content>
        <Text style={styles.title}>{name} (Lvl {business.level})</Text>
        <Text style={styles.text}>💰 Gain/sec: ${business.income}</Text>
        <Text style={styles.text}>Coût upgrade: ${upgradeCost}</Text>
        <Button
          mode="contained"
          onPress={() => upgradeBusiness(businessId, upgradeCost)}
          disabled={money < upgradeCost}
          style={styles.button}
        >
          Upgrade
        </Button>
      </Card.Content>
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
  button: {
    marginTop: 8,
  },
});
