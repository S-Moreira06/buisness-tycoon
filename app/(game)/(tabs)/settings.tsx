import { CustomModal } from '@/components/CustomModal';
import { getLeaderboard, LeaderboardEntry } from '@/services/leaderboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { ActivityIndicator, Text, TextInput } from 'react-native-paper';
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
      // @ts-ignore: Les couleurs sont correctes mais TypeScript est strict sur les tuples
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
  const hapticsEnabled = useGameStore((s) => s.settings?.hapticsEnabled ?? true);
  const toggleHaptics = useGameStore((s) => s.toggleHaptics);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmoji, setTempEmoji] = useState('👤'); // Valeur par défaut
  const playerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const profileEmoji = useGameStore((s) => s.profileEmoji);
  const setProfileEmoji = useGameStore((s) => s.setProfileEmoji);

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
      level: gameState.playerLevel,
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
              // Correction: ajout des parenthèses pour le groupe de route (auth)
              router.replace('/(auth)/login');
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
  const handleOpenLeaderboard = async () => {
    setIsLeaderboardOpen(true);
    setIsLoadingLeaderboard(true);
    try {
      const data = await getLeaderboard(10);
      setLeaderboardData(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger le classement");
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };
  const formatUid = (uid: string) => `Joueur ${uid.slice(0, 4)}...${uid.slice(-4)}`;

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
            <Text style={styles.sectionTitle}>Compte</Text>
            
            {/* Carte Profil Éditable */}
            <SettingCard
              icon={profileEmoji || '👤'} // Affiche l'emoji du joueur
              title={playerName || 'Nom du CEO'}
              subtitle={auth.currentUser?.email || 'Non connecté'}
              onPress={() => {
                setTempName(playerName); 
                setTempEmoji(profileEmoji);
                setIsEditProfileOpen(true);
              }}
              variant="primary"
              rightElement={<Text style={{color: '#a855f7', fontSize: 12}}>Modifier</Text>}
            />
            
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
                  onValueChange={() => toggleHaptics()}
                  trackColor={{ false: '#374151', true: '#a855f7' }}
                  thumbColor={hapticsEnabled ? '#ffffff' : '#9ca3af'}
                />
              }
            />
          </View>

          {/* SECTION CLASSEMENT */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Classement</Text>
            <SettingCard
              icon="🏆"
              title="Top Joueurs"
              subtitle="Voir les 10 meilleures fortunes"
              onPress={handleOpenLeaderboard}
              variant="primary" // Ou une couleur 'gold' si tu veux créer une variante
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
                  <Text style={styles.statValue}>{useGameStore.getState().playerLevel}</Text>
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
      {/* MODALE CLASSEMENT */}
      <CustomModal
        visible={isLeaderboardOpen}
        onDismiss={() => setIsLeaderboardOpen(false)}
      >
        {/* 
           On utilise une View simple avec un fond semi-transparent ou 
           un dégradé qui remplit L'INTÉRIEUR de la CustomModal existante.
           La CustomModal gère déjà le contour et l'ombre.
        */}
        <LinearGradient
          colors={['rgba(30, 27, 75, 0.95)', 'rgba(49, 46, 129, 0.95)']} // Fond sombre légèrement transparent
          style={{
            width: '100%',
            height: '100%', // Remplit l'espace alloué par CustomModal
            padding: 20,
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>
            🏆 Top 10 Mondial
          </Text>

          {isLoadingLeaderboard ? (
            <ActivityIndicator size="large" color="#a855f7" style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              data={leaderboardData}
              keyExtractor={(item) => item.uid}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(255,255,255,0.1)'
                }}>
                  {/* 1. RANG */}
                  <View style={{ width: 40, alignItems: 'center' }}>
                    <Text style={{ 
                      fontSize: 18, 
                      fontWeight: 'bold', 
                      color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#fff' 
                    }}>
                      #{index + 1}
                    </Text>
                  </View>

                  {/* 2. AVATAR + NOM (Nouveau design) */}
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                    {/* Cercle pour l'emoji */}
                    <View style={{
                      width: 36, 
                      height: 36, 
                      borderRadius: 18, 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}>
                      {/* Affiche l'emoji ou un fallback */}
                      <Text style={{ fontSize: 20 }}>{item.profileEmoji || '👤'}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      {/* Affiche le nom ou un fallback */}
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }} numberOfLines={1}>
                        {item.playerName || `Joueur ${item.uid.slice(0, 4)}`}
                      </Text>
                    </View>
                  </View>

                  {/* 3. ARGENT */}
                  <Text style={{ color: '#4ade80', fontWeight: 'bold', fontSize: 15 }}>
                    $ {(item.money / 1000000).toFixed(1)}M
                  </Text>
                </View>
              )}

              ListEmptyComponent={
                <Text style={{ color: '#9ca3af', textAlign: 'center', marginTop: 20 }}>
                  Aucun classement disponible.
                </Text>
              }
            />
          )}

          <Pressable
            onPress={() => setIsLeaderboardOpen(false)}
            style={({ pressed }) => ({
              marginTop: 16,
              paddingVertical: 10,
              paddingHorizontal: 24,
              backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)'
            })}
          >
            <Text style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '500' }}>Fermer</Text>
          </Pressable>

        </LinearGradient>
      </CustomModal>
      {/* MODALE ÉDITION PROFIL */}
      <CustomModal
        visible={isEditProfileOpen}
        onDismiss={() => setIsEditProfileOpen(false)}
      >
        <LinearGradient
          colors={['rgba(30, 27, 75, 0.95)', 'rgba(49, 46, 129, 0.95)']}
          style={{
            width: '90%',
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(168, 85, 247, 0.3)',
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>
            Modifier mon Profil
          </Text>

          {/* 1. PRÉVISUALISATION ACTUELLE */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 2, borderColor: '#a855f7', marginBottom: 8
            }}>
              <Text style={{ fontSize: 40 }}>{tempEmoji}</Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
              {tempName || 'Nom du CEO'}
            </Text>
          </View>

          {/* 2. CHAMP NOM */}
          <View style={{ width: '100%', marginBottom: 20 }}>
            <Text style={{ color: '#9ca3af', marginBottom: 8, fontSize: 14 }}>Votre Nom</Text>
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              placeholder="Entrez votre nom..."
              placeholderTextColor="#6b7280"
              maxLength={15}
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 12,
                padding: 16,
                color: '#fff',
                fontSize: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)'
              }}
            />
          </View>

          {/* 3. SÉLECTEUR D'EMOJI (GRID) */}
          <View style={{ width: '100%', marginBottom: 24 }}>
            <Text style={{ color: '#9ca3af', marginBottom: 8, fontSize: 14 }}>Choisir un Avatar</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {['👨‍💼', '👩‍💼', '🚀', '🦁', '🤖', '🎩', '💎', '🐺', '🦊', '🐯'].map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => setTempEmoji(emoji)}
                  style={{
                    width: 45, height: 45,
                    borderRadius: 22.5,
                    backgroundColor: tempEmoji === emoji ? '#a855f7' : 'rgba(255,255,255,0.05)',
                    justifyContent: 'center', alignItems: 'center',
                    borderWidth: 1,
                    borderColor: tempEmoji === emoji ? '#fff' : 'transparent'
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* BOUTONS D'ACTION */}
          <Pressable
            onPress={() => {
              if (tempName.trim().length > 0) {
                // On sauvegarde les DEUX : Nom et Emoji
                setPlayerName(tempName.trim());
setProfileEmoji(tempEmoji);
                setIsEditProfileOpen(false);
                // Le hook useSyncGame détectera les changements et sauvegardera tout seul
              } else {
                Alert.alert("Erreur", "Le nom ne peut pas être vide");
              }
            }}
            style={({ pressed }) => ({
              backgroundColor: '#a855f7',
              paddingVertical: 12,
              paddingHorizontal: 32,
              borderRadius: 20,
              opacity: pressed ? 0.8 : 1,
              width: '100%',
              alignItems: 'center'
            })}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sauvegarder</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => setIsEditProfileOpen(false)}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: '#9ca3af' }}>Annuler</Text>
          </Pressable>
        </LinearGradient>
      </CustomModal>


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