import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../../hooks/useGameStore';
import { auth } from '../../../services/firebaseConfig';

interface SettingCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'primary' | 'danger' | 'warning';
  loading?: boolean;
  rightElement?: React.ReactNode;
}

const SettingCard = ({ icon, title, subtitle, onPress, variant = 'primary', loading, rightElement }: SettingCardProps) => {
  const gradientColors = {
    primary: ['rgba(168, 85, 247, 0.15)', 'rgba(124, 58, 237, 0.05)'],
    danger: ['rgba(239, 68, 68, 0.15)', 'rgba(220, 38, 38, 0.05)'],
    warning: ['rgba(245, 158, 11, 0.15)', 'rgba(217, 119, 6, 0.05)'],
  };

  const borderColors = {
    primary: '#a855f7',
    danger: '#ef4444',
    warning: '#f59e0b',
  };

  const content = (
    <LinearGradient
      colors={gradientColors[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor: borderColors[variant] }]}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={borderColors[variant]} />
        ) : rightElement ? (
          rightElement
        ) : (
          <Text style={styles.cardArrow}>›</Text>
        )}
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={loading}>
        {content}
      </Pressable>
    );
  }

  return content;
};

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  
  const resetGame = useGameStore((s) => s.resetGame);
  const router = useRouter();

  const handleResetGame = () => {
    Alert.alert(
      '⚠️ Réinitialiser le jeu',
      'Êtes-vous sûr ? Toute votre progression sera perdue.',
      [
        { text: 'Annuler', style: 'cancel' },
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

  const handleExportData = () => {
    const gameState = useGameStore.getState();
    const data = {
      money: gameState.money,
      level: gameState.level,
      businesses: gameState.businesses,
      upgrades: gameState.upgrades,
      exportedAt: new Date().toISOString(),
    };
    
    console.log('💾 Données exportées:', JSON.stringify(data, null, 2));
    Alert.alert(
      '✅ Export réussi',
      'Tes données ont été exportées dans la console. (Fonctionnalité complète à venir)',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      '👋 Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut(auth);
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('❌ Erreur', 'Impossible de se déconnecter');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={['#a855f7', '#7c3aed']}
                style={styles.headerIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.headerIconEmoji}>⚙️</Text>
              </LinearGradient>
              <View style={styles.headerIconGlow} />
            </View>
            <Text style={styles.title}>Paramètres</Text>
            <Text style={styles.subtitle}>Personnalise ton expérience</Text>
          </View>

          {/* Section Compte */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Compte</Text>
            
            <View style={styles.infoCard}>
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.1)', 'rgba(124, 58, 237, 0.05)']}
                style={styles.infoCardGradient}
              >
                <Text style={styles.infoLabel}>Email connecté</Text>
                <Text style={styles.infoValue}>{auth.currentUser?.email}</Text>
              </LinearGradient>
            </View>

            <SettingCard
              icon="🚪"
              title="Se déconnecter"
              subtitle="Quitter votre session"
              onPress={handleLogout}
              variant="danger"
              loading={loading}
            />
          </View>

          {/* Section Préférences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎛️ Préférences</Text>
            
            <SettingCard
              icon="🔔"
              title="Notifications"
              subtitle="Recevoir des alertes sur les revenus"
              variant="primary"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#374151', true: '#a855f7' }}
                  thumbColor={notificationsEnabled ? '#ffffff' : '#9ca3af'}
                />
              }
            />

            <SettingCard
              icon="🔊"
              title="Sons"
              subtitle="Effets sonores du jeu"
              variant="primary"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: '#374151', true: '#a855f7' }}
                  thumbColor={soundEnabled ? '#ffffff' : '#9ca3af'}
                />
              }
            />

            <SettingCard
              icon="📳"
              title="Vibrations"
              subtitle="Retour haptique sur les actions"
              variant="primary"
              rightElement={
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: '#374151', true: '#a855f7' }}
                  thumbColor={hapticsEnabled ? '#ffffff' : '#9ca3af'}
                />
              }
            />
          </View>

          {/* Section Données */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💾 Données du jeu</Text>
            
            <SettingCard
              icon="📤"
              title="Exporter mes données"
              subtitle="Sauvegarder ta progression"
              onPress={handleExportData}
              variant="primary"
            />

            <SettingCard
              icon="🔄"
              title="Réinitialiser la progression"
              subtitle="⚠️ Action irréversible"
              onPress={handleResetGame}
              variant="warning"
              loading={loading}
            />
          </View>

          {/* Section Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Statistiques</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(168, 85, 247, 0.1)', 'rgba(124, 58, 237, 0.05)']}
                  style={styles.statCardGradient}
                >
                  <Text style={styles.statIcon}>💰</Text>
                  <Text style={styles.statValue}>{useGameStore.getState().money.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Argent total</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.05)']}
                  style={styles.statCardGradient}
                >
                  <Text style={styles.statIcon}>🏢</Text>
                  <Text style={styles.statValue}>
                    {Object.values(useGameStore.getState().businesses).filter(b => b.owned).length}
                  </Text>
                  <Text style={styles.statLabel}>Business possédés</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(245, 158, 11, 0.1)', 'rgba(217, 119, 6, 0.05)']}
                  style={styles.statCardGradient}
                >
                  <Text style={styles.statIcon}>⚡</Text>
                  <Text style={styles.statValue}>
                    {Object.values(useGameStore.getState().upgrades).filter(u => u.purchased).length}
                  </Text>
                  <Text style={styles.statLabel}>Upgrades actifs</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(239, 68, 68, 0.1)', 'rgba(220, 38, 38, 0.05)']}
                  style={styles.statCardGradient}
                >
                  <Text style={styles.statIcon}>🏆</Text>
                  <Text style={styles.statValue}>{useGameStore.getState().level}</Text>
                  <Text style={styles.statLabel}>Niveau</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Section À propos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
            
            <View style={styles.aboutCard}>
              <LinearGradient
                colors={['rgba(55, 65, 81, 0.3)', 'rgba(31, 41, 55, 0.1)']}
                style={styles.aboutCardGradient}
              >
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Application</Text>
                  <Text style={styles.aboutValue}>Business Tycoon</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Version</Text>
                  <Text style={styles.aboutValue}>1.0.0</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Technologies</Text>
                  <Text style={styles.aboutValue}>React Native • Firebase</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Développeur</Text>
                  <Text style={styles.aboutValue}>S.Moreira</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with 💜 by S.Moreira</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  
  // Header
  header: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  headerIconContainer: { position: 'relative', marginBottom: 16 },
  headerIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#a78bfa' },
  headerIconEmoji: { fontSize: 40 },
  headerIconGlow: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: '#a855f7', opacity: 0.3, shadowColor: '#a855f7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },

  // Sections
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 12, paddingLeft: 4 },

  // Cards
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 2, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 32, marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#9ca3af' },
  cardArrow: { fontSize: 32, color: '#9ca3af', fontWeight: '300' },

  // Info Card
  infoCard: { marginBottom: 12 },
  infoCardGradient: { borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)' },
  infoLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4, fontWeight: '600' },
  infoValue: { fontSize: 16, color: '#ffffff', fontWeight: '500' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flex: 1, minWidth: '47%' },
  statCardGradient: { 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },

  // About Card
  aboutCard: { overflow: 'hidden' },
  aboutCardGradient: { borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#374151' },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  aboutLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  aboutValue: { fontSize: 13, color: '#ffffff', fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 4 },

  // Footer
  footer: { alignItems: 'center', marginTop: 24, marginBottom: 16 },
  footerText: { fontSize: 12, color: '#6b7280', fontStyle: 'italic' },
});
