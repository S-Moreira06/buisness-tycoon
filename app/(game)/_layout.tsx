import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        title: 'Business Tycoon',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Business Tycoon' }} />
      <Stack.Screen name="settings" options={{ title: 'Paramètres' }} />
    </Stack>
  );
}
