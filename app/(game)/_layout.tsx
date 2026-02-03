import { GameHeader } from '@/components/GameHeader';
import { GameTimer } from '@/components/GameTimer';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconButton } from 'react-native-paper';

export default function GameLayout() {
  const router = useRouter();
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
