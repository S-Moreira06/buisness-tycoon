import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessCard } from '../../components/BusinessCard';
import { ClickButton } from '../../components/ClickButton';
import { ResourceBar } from '../../components/ResourceBar';
import { useAutoIncrement } from '../../hooks/useAutoIncrement';
import { useSyncGame } from '../../hooks/useSyncGame';

const BUSINESSES = [
  { id: 'startup', name: '🚀 Startup', income: 50, price: 1000 },
  { id: 'restaurant', name: '🍕 Restaurant', income: 100, price: 5000 },
  { id: 'factory', name: '🏭 Usine', income: 500, price: 25000 },
  { id: 'techCorp', name: '🖥️ Tech Corp', income: 2000, price: 100000 },
];

export default function GameScreen() {
  useAutoIncrement();
  useSyncGame();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <IconButton
          icon="cog"
          iconColor="#1e88e5"
          size={28}
          onPress={() => router.push('/(game)/settings')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ResourceBar />
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
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerPlaceholder: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
});
