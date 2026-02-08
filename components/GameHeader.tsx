import { formatMoney, formatNumber, formatPrice, formatReputation, formatXP } from '@/utils/formatNumber';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { calculateXPForLevel, GAME_CONFIG, getXPForNextLevel } from '../constants/gameConfig';
import { useGameStore } from '../hooks/useGameStore';
import { AvatarModal } from './AvatarModal'; // 🆕
import { CustomModal } from './CustomModal';

interface TooltipData {
  title: string;
  description: string;
  value: string;
  isAvatar?: boolean;
}

export const GameHeader = () => {
  const router = useRouter();
  const { 
    money, 
    reputation, 
    totalPassiveIncome, 
    playerLevel, 
    experience, 
    profileEmoji, 
    playerName,
    sessionNewAchievements // 🆕 Récupérer les nouveaux succès
  } = useGameStore();
  
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false); // 🆕

  // Calcul XP
  const xpForCurrentLevel = calculateXPForLevel(playerLevel);
  const xpForNextLevel = getXPForNextLevel(playerLevel);
  const currentLevelXP = experience - xpForCurrentLevel;
  const xpProgress = Math.min(currentLevelXP / xpForNextLevel, 1);
  const intervalSeconds = GAME_CONFIG.AUTO_INCREMENT_INTERVAL / 1000;

  const showTooltip = (data: TooltipData) => {
    setTooltipData(data);
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
    setTooltipData(null);
  };

  return (
    <>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
        style={styles.headerContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* LIGNE 1 : XP + Avatar + Level */}
        <View style={styles.topRow}>
          {/* XP Bar à gauche */}
          <View style={styles.xpContainer}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpLabel}>⚡ LVL {playerLevel}</Text>
              <Text style={styles.xpValue}>
                {formatXP(currentLevelXP)} / {formatXP(xpForNextLevel)} XP
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={xpProgress}
                color="#a855f7"
                style={styles.progressBar}
              />
              <View style={[styles.progressGlow, { width: `${xpProgress * 100}%` }]} />
            </View>
          </View>

          {/* Avatar (Dynamique) avec Badge 🆕 */}
          <Pressable 
            style={styles.avatarContainer}
            onPress={() => setAvatarModalVisible(true)} // 🆕 Ouvre la modal au lieu du tooltip
          >
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(124, 58, 237, 0.1)']}
              style={styles.avatar}
            >
              <Text style={styles.avatarEmoji}>{profileEmoji || '👤'}</Text>
            </LinearGradient>
            <View style={styles.avatarGlow} />
            
            {/* 🆕 BADGE DE NOTIFICATION */}
            {sessionNewAchievements.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {sessionNewAchievements.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* LIGNE 2 : Ressources (Money, Reputation, Passif) */}
        <View style={styles.bottomRow}>
          {/* Argent */}
          <Pressable
            style={[styles.statCard, styles.statCardMed]}
            onPress={() =>
              showTooltip({
                title: '💰 Argent',
                description: 'Ton capital total pour acheter des businesses et faire des upgrades.',
                value: `${formatNumber(money, 2)} €`,
              })
            }
          >
            <Text style={styles.statEmoji}>💰</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Argent</Text>
              <Text style={styles.statValue}>{formatPrice(money)}</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() =>
              showTooltip({
                title: '⭐ Réputation',
                description: "Ta réputation te permet d'acheter des upgrades puissants.",
                value: formatNumber(reputation),
              })
            }
          >
            <View style={[styles.statContent, styles.statContentCenter]}>
              <Text style={styles.statLabel}>⭐</Text>
              <Text style={styles.statValue}>{formatReputation(reputation)}</Text>
            </View>
          </Pressable>

          {/* Revenu Passif */}
          <Pressable
            style={[styles.statCard, styles.statCardMed]}
            onPress={() =>
              showTooltip({
                title: '📈 Revenu Passif',
                description: `Argent gagné automatiquement toutes les ${intervalSeconds} secondes grâce à tes businesses.`,
                value: `${formatMoney(totalPassiveIncome)}`,
              })
            }
          >
            <Text style={styles.statEmoji}>📈</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Passif/{intervalSeconds}s</Text>
              <Text style={styles.statValue}>{formatMoney(totalPassiveIncome)}</Text>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      {/* CUSTOM MODAL POUR LES TOOLTIPS (ressources Money/Rep/Passif) */}
      <CustomModal visible={tooltipVisible} onDismiss={hideTooltip}>
        <View style={styles.tooltipCard}>
          <LinearGradient
            colors={['#1a1a2e', '#0f0f1e']}
            style={styles.tooltipGradient}
          >
            <Text style={styles.tooltipTitle}>{tooltipData?.title}</Text>
            <Text style={styles.tooltipDescription}>{tooltipData?.description}</Text>
            <View style={styles.tooltipValueContainer}>
              <Text style={styles.tooltipValue}>{tooltipData?.value}</Text>
            </View>
          </LinearGradient>
        </View>
      </CustomModal>

      {/* 🆕 AVATAR MODAL (Profil + Nouveautés) */}
      <AvatarModal
        visible={avatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  xpContainer: {
    flex: 1,
    marginRight: 12,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a855f7',
    textShadowColor: '#a855f7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  xpValue: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  progressBarContainer: {
    position: 'relative',
    height: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1f2937',
  },
  progressGlow: {
    position: 'absolute',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a855f7',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  avatarGlow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#a855f7',
    opacity: 0.3,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  // 🆕 STYLES BADGE NOTIFICATION
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  statCardMed: {
    flex: 2,
  },
  statCardBig: {
    flex: 3,
  },
  statEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statContentCenter: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tooltipCard: {
    width: '100%',
  },
  tooltipGradient: {
    padding: 20,
    minWidth: 280,
    alignItems: 'center',
  },
  tooltipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  tooltipDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  tooltipValueContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#a855f7',
    width: '100%',
  },
  tooltipValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a855f7',
    textAlign: 'center',
  },
});
