import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { calculateXPForLevel, getXPForNextLevel } from '../constants/gameConfig';
import { useGameStore } from '../hooks/useGameStore';

export const LevelBar = () => {
  const { playerLevel, experience } = useGameStore();  // 🔄 Renommé

  const xpForCurrentLevel = calculateXPForLevel(playerLevel);
  const xpForNextLevel = getXPForNextLevel(playerLevel);
  const currentLevelXP = experience - xpForCurrentLevel;
  const progress = Math.min(currentLevelXP / xpForNextLevel, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelText}>⭐ Niveau {playerLevel}</Text>  {/* 🔄 Renommé */}
        <Text style={styles.xpText}>
          {currentLevelXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
        </Text>
      </View>
      <ProgressBar 
        progress={progress} 
        color="#7c3aed" 
        style={styles.progressBar}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f4ff',
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  xpText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0d4f7',
  },
});
