import { useAchievementSystem } from '@/hooks/useAchievementSystem';
import { useLevelUpTracker } from '@/hooks/useLevelUpTracker';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  useAchievementSystem();
  useLevelUpTracker();
  const { user, loading } = useAuth();
  const router = useRouter();

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
