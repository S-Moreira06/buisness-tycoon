import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
import { calculateXPForLevel, GAME_CONFIG, getXPForNextLevel } from '../constants/gameConfig';
import { useGameStore } from '../hooks/useGameStore';
import { CustomModal } from './CustomModal';

interface TooltipData {
  title: string;
  description: string;
  value: string;
  isAvatar?: boolean;
}

export const GameHeader = () => {
  const router = useRouter();
  const { money, reputation, totalPassiveIncome, playerLevel, experience } = useGameStore();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

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
  const goToSettings = () => {
    hideTooltip();
    router.push('/(game)/(tabs)/settings');
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
                {currentLevelXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
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

          {/* Avatar (placeholder) */}
          <Pressable
            style={styles.avatarContainer}
            onPress={() =>
              showTooltip({
                title: '👤 Profil',
                description: 'Ton avatar de joueur',
                value: `Niveau ${playerLevel}`,
                isAvatar: true,
              })
            }
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarEmoji}>👤</Text>
            </LinearGradient>
            <View style={styles.avatarGlow} />
          </Pressable>
        </View>

        {/* LIGNE 2 : Ressources (Money, Reputation, Passif) */}
        <View style={styles.bottomRow}>
          {/* Argent */}
          <Pressable
            style={styles.statCard}
            onPress={() =>
              showTooltip({
                title: '💰 Argent',
                description: 'Ton capital total pour acheter des businesses et faire des upgrades.',
                value: `${money.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`,
              })
            }
          >
            <Text style={styles.statEmoji}>💰</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Argent</Text>
              <Text style={styles.statValue}>{money.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</Text>
            </View>
          </Pressable>

          {/* Revenu Passif */}
          <Pressable
            style={styles.statCard}
            onPress={() =>
              showTooltip({
                title: '📈 Revenu Passif',
                description: `Argent gagné automatiquement toutes les ${intervalSeconds} secondes grâce à tes businesses.`,
                value: `${totalPassiveIncome.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€/${intervalSeconds}s`,
              })
            }
          >
            <Text style={styles.statEmoji}>📈</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Passif/{intervalSeconds}s</Text>
              <Text style={styles.statValue}>{totalPassiveIncome.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</Text>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

     {/* CUSTOM MODAL POUR LES TOOLTIPS */}
      <CustomModal
        visible={tooltipVisible}
        onDismiss={hideTooltip}
      >
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

            {/* 🆕 Bouton Paramètres si c'est le tooltip avatar */}
            {tooltipData?.isAvatar && (
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
            )}
          </LinearGradient>
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 6,
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
  statEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  statContent: {
    flex: 1,
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
  // Tooltip Styles simplifiés (plus besoin de l'overlay modal ici)
  tooltipCard: {
    // La CustomModal a déjà un container avec overflow hidden et border radius
    width: '100%',
  },
  tooltipGradient: {
    padding: 20,
    minWidth: 280,
    alignItems: 'center', // Centrer le contenu
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
   settingsButton: {
    marginTop: 16,
    borderRadius: 8,
    width: '100%', 
  },
});
