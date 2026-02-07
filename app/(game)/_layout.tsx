import { GameHeader } from '@/components/GameHeader';
import { GameTimer } from '@/components/GameTimer';
import { useGameStore } from '@/hooks/useGameStore';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function GameLayout() {
  const startSession = useGameStore((state) => state.startSession);
  const endSession = useGameStore((state) => state.endSession);

  useEffect(() => {
    // Démarre la session au montage
    startSession();

    // Termine la session au démontage (fermeture de l'app)
    return () => {
      endSession();
    };
  }, [startSession, endSession]);
  const router = useRouter();
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);
  return (
    <>
      <StatusBar hidden={true} />
      <GameTimer />
      <Stack
        screenOptions={{
          title: 'Business Tycoon',
          header: () => <GameHeader />,
          headerStyle: { 
            backgroundColor: '#7c3aed', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: { 
            color: '#fff', 
            fontWeight: 'bold',
          },
            headerRight: () => ( 
              <>
              <IconButton
                icon="cog"
                size={24}
                onPress={() => router.push('/(game)/(tabs)/settings')}
              />
              <IconButton
                icon="one-up"
                size={24}
                onPress={() => router.push('/(game)/(tabs)/upgrades')}
              />
              </>
            ),
        }}
      >
      </Stack>
    </>
  );
}
