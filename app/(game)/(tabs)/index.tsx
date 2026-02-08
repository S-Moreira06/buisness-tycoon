import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AnimatedBackground from '@/components/AnimatedBackground';
import { BusinessCard } from '../../../components/BusinessCard';
import { ClickButton } from '../../../components/ClickButton';
import { BUSINESSES_CONFIG, calculateBusinessPrice } from '../../../constants/businessesConfig';
import { useAutoIncrement } from '../../../hooks/useAutoIncrement';
import { useGameStore } from '../../../hooks/useGameStore'; // ✅ AJOUT
import { useImmersiveMode } from '../../../hooks/useImmersiveMode';
import { useSyncGame } from '../../../hooks/useSyncGame';

// ❌ SUPPRIMÉ : La constante statique BUSINESSES qui cassait la progression
// const BUSINESSES = Object.values(BUSINESSES_CONFIG).map((b) => ({...}));

export default function GameScreen() {
  useAutoIncrement();
  useSyncGame();
  const { isHidden, toggleNavigationBar } = useImmersiveMode();
  
  // ✅ NOUVEAU : Récupération de l'état des businesses pour calculer les prix dynamiquement
  const { businesses } = useGameStore();
  
  useEffect(() => {
    toggleNavigationBar(); // Cache au démarrage
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <AnimatedBackground 
        colors={['#000000', '#2d00f7', '#2d0a70', '#830db9']}
        speed={10}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <ClickButton />

        <View style={styles.section}>
          {Object.values(BUSINESSES_CONFIG).map((businessConfig) => {
            // ✅ CALCUL DYNAMIQUE : Le prix augmente selon la quantité possédée
            const businessState = businesses[businessConfig.id];
            const currentQuantity = businessState?.quantity || 0;
            const currentPrice = calculateBusinessPrice(
              businessConfig.baseCost,
              businessConfig.costMultiplier,
              currentQuantity
            );

            return (
              <BusinessCard
                key={businessConfig.id}
                businessId={businessConfig.id}
                name={`${businessConfig.emoji} ${businessConfig.name}`}
                baseIncome={businessConfig.baseIncome}
                buyPrice={currentPrice} // ✅ Prix recalculé à chaque render
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d3d5a',
  },
  content: {
    flex: 1,
    zIndex: 1, // S'assurer que le contenu est au-dessus
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
    marginBottom: 60,
  },
});
