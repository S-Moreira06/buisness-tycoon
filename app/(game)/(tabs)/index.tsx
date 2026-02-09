import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AnimatedBackground from '@/components/AnimatedBackground';
import { BusinessCard } from '../../../components/BusinessCard';
import { ClickButton } from '../../../components/ClickButton';
import { BUSINESSES_CONFIG, calculateBusinessPrice, getNextLockedBusiness } from '../../../constants/businessesConfig';
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
  const { businesses, playerLevel } = useGameStore();// Récupération de l'état des businesses pour calculer les prix dynamiquement et du level pour l'affichage du prochain a unlock uniquement
  const nextLockedBusiness = getNextLockedBusiness(playerLevel);// Récupérer le prochain business à débloquer
  
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
          {Object.values(BUSINESSES_CONFIG)
            .filter(businessConfig => {
              // 🆕 Afficher uniquement les businesses débloqués
              const isUnlocked = !businessConfig.unlockLevel || playerLevel >= businessConfig.unlockLevel;
              return isUnlocked;
            })
            .map((businessConfig) => {
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
        {nextLockedBusiness && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                🔒 Prochain Business
              </Text>
              <Text style={styles.levelBadge}>
                Niveau {nextLockedBusiness.unlockLevel} requis
              </Text>
            </View>
            
            <BusinessCard
              key={nextLockedBusiness.id}
              businessId={nextLockedBusiness.id}
              name={`${nextLockedBusiness.emoji} ${nextLockedBusiness.name}`}
              buyPrice={nextLockedBusiness.baseCost}
              locked={true} // 🆕 Prop pour afficher l'état verrouillé
            />
          </View>
        )}
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
   sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  levelBadge: {
    color: '#fbbf24',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: 'bold',
  },
});
