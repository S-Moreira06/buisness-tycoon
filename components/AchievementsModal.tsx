import { ACHIEVEMENTS } from '@/constants/achievementsConfig';
import { useGameStore } from '@/hooks/useGameStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CustomModal } from './CustomModal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AchievementsModal = ({ visible, onClose }: Props) => {
  const unlockedIds = useGameStore((state) => state.unlockedAchievements);
  const progress = Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100);

  const renderItem = ({ item }: { item: typeof ACHIEVEMENTS[0] }) => {
    const isUnlocked = unlockedIds.includes(item.id);

    return (
      <View style={[styles.card, !isUnlocked && styles.cardLocked]}>
        <View style={[styles.iconBox, isUnlocked ? styles.iconUnlocked : styles.iconLocked]}>
          <Text style={styles.iconText}>{isUnlocked ? item.icon : '🔒'}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, !isUnlocked && styles.textLocked]}>
            {item.title}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        
        {isUnlocked && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </View>
    );
  };

  return (
    <CustomModal visible={visible} onDismiss={onClose}>
      <LinearGradient
        // On reprend le même dégradé que tes autres modales (Top 10 / Edit Profile)
        // Regarde ton settings.tsx, c'est ce gradient que tu utilises
        colors={['rgba(30, 27, 75, 0.95)', 'rgba(49, 46, 129, 0.95)']}
        style={{
          width: '100%',
          height: '100%',
          padding: 20,
          alignItems: 'center'
        }}
      >
        <Text style={styles.title}>🏆 Succès ({progress}%)</Text>

        {/* Barre de Progression */}
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={['#a855f7', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: `${progress}%` }}
          />
        </View>

        {/* Liste */}
        <FlatList
          data={ACHIEVEMENTS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
        
        {/* Bouton Fermer (Pour match le style de tes autres modales) */}
        <Text 
          onPress={onClose}
          style={styles.closeButton}
        >
          Fermer
        </Text>
      </LinearGradient>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    // IMPORTANT : C'est ce style qui manquait peut-être.
    // On force une taille suffisante pour voir la liste
    width: '90%',
    maxHeight: '80%', 
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardLocked: {
    opacity: 0.5,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconUnlocked: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  iconLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  iconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  textLocked: {
    color: '#9ca3af',
  },
  cardDesc: {
    fontSize: 11,
    color: '#9ca3af',
  },
  closeButton: {
    marginTop: 16,
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 24,
  }
});
