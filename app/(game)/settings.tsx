import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../hooks/useGameStore';
import { auth } from '../../services/firebaseConfig';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);
  const resetGame = useGameStore((s) => s.resetGame);
  const router = useRouter();

  const handleResetGame = () => {
    Alert.alert(
      '⚠️ Réinitialiser le jeu',
      'Êtes-vous sûr ? Toute votre progression sera perdue.',
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Réinitialiser',
          onPress: async () => {
            setLoading(true);
            try {
              resetGame();
              Alert.alert('✅ Succès', 'Le jeu a été réinitialisé');
            } catch (error) {
              Alert.alert('❌ Erreur', 'Impossible de réinitialiser');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de se déconnecter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>
          ⚙️ Paramètres
        </Text>
        <Button
            mode="contained"
            icon="gamepad-variant"
            onPress={() => router.push('/(game)')}
            style={styles.button}
            buttonColor="#a855f7"
            textColor="#ffffff"
            loading={loading}
          >
            🎮 Retour au jeu
          </Button>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Compte
          </Text>
          <Text variant="bodySmall" style={styles.email}>
            {auth.currentUser?.email}
          </Text>
          <Button
            mode="contained"
            onPress={handleLogout}
            loading={loading}
            disabled={loading}
            buttonColor="#d32f2f"
            style={styles.button}
          >
            Se déconnecter
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Données du jeu
          </Text>
          <Text variant="bodySmall" style={styles.warning}>
            ⚠️ Cette action est irréversible
          </Text>
          <Button
            mode="contained"
            onPress={handleResetGame}
            loading={loading}
            disabled={loading}
            buttonColor="#ff6f00"
            style={styles.button}
          >
            Réinitialiser le jeu
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            À propos
          </Text>
          <Text variant="bodySmall" style={styles.info}>
            🎮 Business Tycoon v1.0.0
          </Text>
          <Text variant="bodySmall" style={styles.info}>
            Créé avec React Native + Firebase
          </Text>
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
  },
  title: {
    marginTop: 20,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  email: {
    marginBottom: 12,
    color: '#666',
  },
  warning: {
    marginBottom: 12,
    color: '#ff6f00',
    fontWeight: '500',
  },
  info: {
    marginBottom: 6,
    color: '#666',
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 8,
  },
});
