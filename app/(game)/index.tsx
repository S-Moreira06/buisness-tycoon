import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessCard } from '../../components/BusinessCard';
import { ClickButton } from '../../components/ClickButton';
import { ResourceBar } from '../../components/ResourceBar';
import { useAutoIncrement } from '../../hooks/useAutoIncrement';
import { useImmersiveMode } from '../../hooks/useImmersiveMode';
import { useSyncGame } from '../../hooks/useSyncGame';


const BUSINESSES = [
  { id: 'coffeeMachine', name: '☕ Machine à Café', income: 5, price: 850 },
  { id: 'foodTruck', name: '🍕 Food Truck', income: 20, price: 5000 },
  { id: 'smallShop', name: '🏪 Petit Magasin', income: 40, price: 10000 },
  { id: 'airbnb', name: '🏠 Airbnb', income: 150, price: 17850 },
  { id: 'library', name: '📚 Librairie', income: 210, price: 30000 },
  { id: 'gym', name: '🏋️ Salle de Sport', income: 450, price: 75000 },
  { id: 'cinema', name: '🎬 Cinéma', income: 900, price: 150000 },
  { id: 'restaurant', name: '🍽️ Restaurant', income: 1500, price: 300000 },
  { id: 'hotel', name: '🏨 Hôtel', income: 3000, price: 500000 },
  { id: 'gamingStudio', name: '🎮 Gaming Studio', income: 4500, price: 750000 },
  { id: 'factory', name: '🏭 Usine', income: 8000, price: 1500000 },
  { id: 'hospital', name: '🏥 Hôpital', income: 12000, price: 3000000 },
  { id: 'techStartup', name: '📱 Tech Startup', income: 22000, price: 5000000 },
  { id: 'themepark', name: '🎪 Parc d\'attractions', income: 50000, price: 10000000 },
  { id: 'autoDealer', name: '🚗 Concession Auto', income: 90000, price: 15000000 },
  { id: 'cryptoFarm', name: '⛏️ Crypto Farm', income: 200000, price: 50000000 },
  { id: 'techCorp', name: '🖥️ Tech Corp', income: 500000, price: 100000000 },
  { id: 'spaceX', name: '🚁 SpaceX', income: 660000, price: 250000000 },
  { id: 'bank', name: '💰 Bank', income: 990000, price: 500000000 },
  { id: 'globalCorp', name: '🌍 Global Corporation', income:120000, price: 1000000000 },
];

export default function GameScreen() {
  useAutoIncrement();
  useSyncGame();
  const { isHidden, toggleNavigationBar } = useImmersiveMode();
  useEffect(() => {
  toggleNavigationBar(); // Cache au démarrage
}, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

        

        <ResourceBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ClickButton />

        <View style={styles.section}>
          {BUSINESSES.map((business) => (
            <BusinessCard
              key={business.id}
              businessId={business.id}
              name={business.name}
              baseIncome={business.income}
              buyPrice={business.price}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerPlaceholder: {
    flex: 1,
  },
  section: {
    marginBottom: 0,
  },
});
