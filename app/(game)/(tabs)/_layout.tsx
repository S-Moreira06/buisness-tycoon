import { useJobNotification } from '@/hooks/useJobNotification';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function TabsLayout() {
  const hasCompletedJobs = useJobNotification();
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Le header est déjà dans le layout parent
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderTopWidth: 1,
              borderTopColor: '#a855f7',
            }}
          />
        ),
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#acacad',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jeu',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="🎮" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithBadge 
              emoji="💼" 
              color={color} 
              focused={focused} 
              showBadge={hasCompletedJobs} // 🆕
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upgrades"
        options={{
          title: 'Boosts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="⭐" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Param.',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="⚙️" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

// Composant pour les icônes avec effet glow
function TabIcon({ emoji, color, focused }: { emoji: string; color: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 20,
        // @ts-ignore: filter n'est pas supporté nativement mais peut marcher sur le web
        filter: focused ? `drop-shadow(0 0 8px ${color})` : 'none',
        // Correction du transform pour React Native (array instead of string)
        transform: [{ scale: focused ? 1.4 : 1 }],
      }}
    >
      {emoji}
    </Text>
  );
}

function TabIconWithBadge({ 
  emoji, 
  color, 
  focused, 
  showBadge 
}: { 
  emoji: string; 
  color: string; 
  focused: boolean;
  showBadge: boolean;
}) {
  return (
    <View style={{ position: 'relative' }}>
      <Text
        style={{
          fontSize: 20,
          filter: focused ? `drop-shadow(0 0 8px ${color})` : 'none',
          transform: [{ scale: focused ? 1.4 : 1 }],
        }}
      >
        {emoji}
      </Text>
      {showBadge && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -8,
            backgroundColor: '#ef4444',
            borderRadius: 10,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
            !
          </Text>
        </View>
      )}
    </View>
  );
}
