import { useAchievementSystem } from '@/hooks/useAchievementSystem';
import { useGameStore } from '@/hooks/useGameStore';
import { useLevelUpTracker } from '@/hooks/useLevelUpTracker';
import { useSyncGame } from '@/hooks/useSyncGame';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  useAchievementSystem();
  useLevelUpTracker();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isHydrated } = useSyncGame();
  const checkJobsCompletion = useGameStore((state) => state.checkJobsCompletion);

  useEffect(() => {
    console.log('📍 Auth state:', { 
      user: user?.email, 
      loading,
    });

    if (loading) {
      console.log('⏳ Still loading...');
      return;
    }

    // Petit délai pour que l'auth soit bien initialisé
    const timeout = setTimeout(() => {
      if (user) {
        console.log('✅ User found, going to game');
        router.replace('/(game)/(tabs)');
      } else {
        console.log('❌ No user, going to login');
        router.replace('/(auth)/login');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, loading, router]);
  useEffect(() => {
    if (isHydrated) {
      // Vérifier immédiatement si des jobs sont terminés
      checkJobsCompletion();
      console.log('🔍 Vérification des jobs au démarrage');
    }
  }, [isHydrated, checkJobsCompletion]);

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(game)" />
      </Stack>
      {/* <Toast config={toastConfig} /> */}
    </PaperProvider>
  );
}
