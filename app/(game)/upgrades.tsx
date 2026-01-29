import { UpgradeCard } from "@/components/UpgradeCard";
import { useGameStore } from "@/hooks/useGameStore";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function UpgradesScreen() {
  const { upgrades, reputation, purchaseUpgrade, businesses } = useGameStore();
  const availableUpgrades = Object.values(upgrades).filter((upgrade) =>
    upgrade.affectedBusinesses.some(
      (businessId) => businesses[businessId]?.owned
    )
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        🎯 Améliorations
      </Text>
      
      <Text variant="bodySmall" style={styles.reputationDisplay}>
        ⭐ Réputation disponible: {reputation}
      </Text>

      <ScrollView>
        {availableUpgrades.length === 0 ? (
          <Text style={styles.emptyMessage}>
            🏢 Aucune amélioration disponible.{'\n'}
            Achète des businesses pour débloquer des upgrades !
          </Text>
        ) : (
          availableUpgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              canAfford={
                reputation >= upgrade.reputationCost && 
                !upgrade.purchased
              }
              onPurchase={() => purchaseUpgrade(upgrade.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reputationDisplay: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    fontWeight: '600',
    color: '#333',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
});

