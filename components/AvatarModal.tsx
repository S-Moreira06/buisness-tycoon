import { ACHIEVEMENTS } from '@/constants/achievementsConfig';
import { useGameStore } from '@/hooks/useGameStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { CustomModal } from './CustomModal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'news';

export const AvatarModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const { 
    sessionNewAchievements, 
    clearSessionAchievements, 
    playerName, 
    profileEmoji, 
    playerLevel 
  } = useGameStore();
  
  // Déterminer l'onglet initial : si nouveautés → ouvrir sur "news", sinon "profile"
  const [activeTab, setActiveTab] = useState<TabType>(
    sessionNewAchievements.length > 0 ? 'news' : 'profile'
  );

  const goToSettings = () => {
    onClose();
    router.push('/(game)/(tabs)/settings');
  };

  const handleClearNotifications = () => {
    clearSessionAchievements();
  };

  // Récupérer les données complètes des nouveaux succès
  const newAchievements = ACHIEVEMENTS.filter(ach => 
    sessionNewAchievements.includes(ach.id)
  );

  const renderNewsItem = ({ item }: { item: typeof ACHIEVEMENTS[0] }) => (
    <View style={styles.newsCard}>
      <View style={styles.newsIconContainer}>
        <Text style={styles.newsIcon}>{item.icon}</Text>
      </View>
      
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
        
        <View style={styles.rewardsContainer}>
          {item.rewards.reputation && (
            <Text style={styles.rewardText}>
              ⭐ +{item.rewards.reputation}
            </Text>
          )}
          {item.rewards.xp && (
            <Text style={styles.rewardText}>
              ⚡ +{item.rewards.xp} XP
            </Text>
          )}
          {item.rewards.money && (
            <Text style={styles.rewardText}>
              💰 +{item.rewards.money}$
            </Text>
          )}
        </View>
      </View>
      
      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
    </View>
  );

  return (
    <CustomModal visible={visible} onDismiss={onClose}>
      <LinearGradient
        colors={['rgba(30, 27, 75, 0.95)', 'rgba(49, 46, 129, 0.95)']}
        style={styles.container}
      >
        {/* TABS */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
              Profil
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.tab, activeTab === 'news' && styles.tabActive]}
            onPress={() => setActiveTab('news')}
          >
            <Text style={[styles.tabText, activeTab === 'news' && styles.tabTextActive]}>
              Nouveautés
            </Text>
            {sessionNewAchievements.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{sessionNewAchievements.length}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* CONTENU PROFIL */}
        {activeTab === 'profile' && (
          <View style={styles.profileContent}>
            <Text style={styles.profileEmoji}>{profileEmoji || '👤'}</Text>
            <Text style={styles.profileTitle}>{playerName || 'Non défini'}</Text>
            <Text style={styles.profileSubtitle}>Niveau {playerLevel}</Text>
            
            <Button
              mode="contained"
              icon="cog"
              onPress={goToSettings}
              style={styles.settingsButton}
              buttonColor="#a855f7"
              textColor="#ffffff"
            >
              Paramètres
            </Button>
          </View>
        )}

        {/* CONTENU NOUVEAUTÉS */}
        {activeTab === 'news' && (
          <View style={styles.newsContent}>
            {newAchievements.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎯</Text>
                <Text style={styles.emptyText}>Aucun nouveau succès</Text>
                <Text style={styles.emptySubtext}>
                  Continuez à jouer pour débloquer des achievements !
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.newsHeader}>
                  <Text style={styles.newsHeaderTitle}>
                    🎉 {newAchievements.length} Nouveau{newAchievements.length > 1 ? 'x' : ''} Succès
                  </Text>
                  <Pressable onPress={handleClearNotifications}>
                    <Text style={styles.clearButton}>Tout marquer comme vu</Text>
                  </Pressable>
                </View>
                
                <FlatList
                  data={newAchievements}
                  keyExtractor={(item) => item.id}
                  renderItem={renderNewsItem}
                  contentContainerStyle={styles.newsList}
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}
          </View>
        )}
        
        {/* BOUTON FERMER */}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Fermer</Text>
        </Pressable>
      </LinearGradient>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  
  // TABS
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: '#a855f7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // PROFIL
  profileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  settingsButton: {
    marginTop: 16,
    borderRadius: 8,
    width: '80%',
  },
  
  // NOUVEAUTÉS
  newsContent: {
    flex: 1,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clearButton: {
    fontSize: 12,
    color: '#a855f7',
    fontWeight: '600',
  },
  newsList: {
    paddingBottom: 20,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: '#a855f7',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  newsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newsIcon: {
    fontSize: 24,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 13,
    color: '#d1d5db',
    marginBottom: 8,
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardText: {
    fontSize: 12,
    color: '#a855f7',
    fontWeight: '600',
  },
  
  // EMPTY STATE
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  
  // CLOSE BUTTON
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
