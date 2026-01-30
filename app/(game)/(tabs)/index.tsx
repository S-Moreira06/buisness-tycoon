import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessCard } from '../../../components/BusinessCard';
import { ClickButton } from '../../../components/ClickButton';
import { BUSINESSES_CONFIG } from '../../../constants/businessesConfig';
import { useAutoIncrement } from '../../../hooks/useAutoIncrement';
import { useImmersiveMode } from '../../../hooks/useImmersiveMode';
import { useSyncGame } from '../../../hooks/useSyncGame';

const BUSINESSES = Object.values(BUSINESSES_CONFIG).map((b) => ({
  id: b.id,
  name: `${b.emoji} ${b.name}`,   // pour garder les emojis comme dans ta liste actuelle[file:7]
  income: b.baseIncome,
  price: b.baseCost,
}));

export default function GameScreen() {
  useAutoIncrement();
  useSyncGame();
  const { isHidden, toggleNavigationBar } = useImmersiveMode();
  useEffect(() => {
  toggleNavigationBar(); // Cache au démarrage
}, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

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
    backgroundColor: '#3d3d5a',
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
