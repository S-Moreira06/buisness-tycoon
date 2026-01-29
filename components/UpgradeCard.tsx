import { StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-paper";

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onPurchase: () => void;
}

export const UpgradeCard = ({ upgrade, canAfford, onPurchase }: UpgradeCardProps) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{upgrade.name}</Text>
        <Text variant="bodySmall" style={styles.description}>
          {upgrade.description}
        </Text>
        <Text variant="bodySmall" style={styles.effect}>
          Effet: +{Math.round((upgrade.multiplier - 1) * 100)}% de revenu
        </Text>
        <Button
          mode={upgrade.purchased ? 'outlined' : 'contained'}
          disabled={!canAfford || upgrade.purchased}
          onPress={onPurchase}
        >
          {upgrade.purchased 
            ? '✅ Acheté' 
            : `⭐ ${upgrade.reputationCost} Réputation`}
        </Button>
      </Card.Content>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#b697c4',
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    marginBottom: 12,
    color: '#666',
    lineHeight: 18,
  },
  effect: {
    marginBottom: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  purchasedButton: {
    backgroundColor: '#e8f5e9',
  },
});
