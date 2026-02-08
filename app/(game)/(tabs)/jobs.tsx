// app/(game)/(tabs)/jobs.tsx
import { JOBS_CONFIG } from '@/constants/jobsConfig';
import { useGameStore } from '@/hooks/useGameStore';
import { ActiveJob, JobConfig } from '@/types/job';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, ProgressBar, Text } from 'react-native-paper';

export default function JobsScreen() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const startJob = useGameStore((state) => state.startJob);
  const claimJobReward = useGameStore((state) => state.claimJobReward);
  const getActiveJobsWithDetails = useGameStore((state) => state.getActiveJobsWithDetails);
  const playerLevel = useGameStore((state) => state.playerLevel);
  
  const activeJobs = getActiveJobsWithDetails();
  
  // Mettre à jour le timer toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleStartJob = (jobId: string) => {
    const job = JOBS_CONFIG[jobId];
    if (!job) return;
    
    if (job.unlockLevel && playerLevel < job.unlockLevel) {
      Alert.alert('Niveau insuffisant', `Vous devez être niveau ${job.unlockLevel} pour débloquer ce job.`);
      return;
    }
    
    startJob(jobId);
  };
  
  const handleClaimReward = (jobId: string) => {
    claimJobReward(jobId);
  };
  
  const renderJobCard = (jobConfig: JobConfig, activeJob?: ActiveJob) => {
    const isActive = activeJob?.status === 'in_progress';
    const isCompleted = activeJob?.status === 'completed';
    const isLocked = jobConfig.unlockLevel ? playerLevel < jobConfig.unlockLevel : false;
    
    // Calcul du temps restant
    let remainingSeconds = 0;
    let progress = 0;
    
    if (isActive && activeJob) {
      const remaining = Math.max(0, activeJob.endTime - currentTime);
      remainingSeconds = Math.ceil(remaining / 1000);
      progress = 1 - (remaining / (jobConfig.duration * 1000));
    }
    
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
      <Card key={jobConfig.id} style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineMedium">{jobConfig.icon}</Text>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title}>
                {jobConfig.name}
              </Text>
              {isLocked && (
                <Text variant="bodySmall" style={styles.lockText}>
                  🔒 Niveau {jobConfig.unlockLevel} requis
                </Text>
              )}
            </View>
          </View>
          
          <Text variant="bodyMedium" style={styles.description}>
            {jobConfig.description}
          </Text>
          
          <View style={styles.rewards}>
            <Text variant="bodySmall">💰 {jobConfig.rewards.money}€</Text>
            <Text variant="bodySmall">🏆 {jobConfig.rewards.reputation}</Text>
            <Text variant="bodySmall">⭐ {jobConfig.rewards.xp} XP</Text>
          </View>
          
          <Text variant="bodySmall" style={styles.duration}>
            ⏱️ Durée : {formatTime(jobConfig.duration)}
          </Text>
          
          {isActive && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} color="#a855f7" style={styles.progressBar} />
              <Text variant="bodyMedium" style={styles.timer}>
                Temps restant : {formatTime(remainingSeconds)}
              </Text>
            </View>
          )}
          
          {isCompleted && (
            <View style={styles.completedContainer}>
              <Text variant="titleMedium" style={styles.completedText}>
                ✅ Job terminé !
              </Text>
              <Button
                mode="contained"
                onPress={() => handleClaimReward(jobConfig.id)}
                style={styles.claimButton}
                labelStyle={styles.claimButtonLabel}
              >
                Récupérer les récompenses
              </Button>
            </View>
          )}
          
          {!isActive && !isCompleted && (
            <Button
              mode="contained"
              onPress={() => handleStartJob(jobConfig.id)}
              disabled={isLocked}
              style={styles.startButton}
            >
              {isLocked ? 'Verrouillé' : 'Démarrer'}
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.titleSection}>
        <Text variant="headlineLarge" style={styles.screenTitle}>
          💼 Jobs Disponibles
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Complétez des missions pour gagner de l'argent et de la réputation
        </Text>
      </View>
      
      {/* Afficher les jobs actifs en premier */}
      {activeJobs.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            🔥 Jobs en cours
          </Text>
          {activeJobs.map((job) =>
            renderJobCard(JOBS_CONFIG[job.jobId], job)
          )}
        </View>
      )}
      
      {/* Afficher tous les jobs disponibles */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          📋 Tous les jobs
        </Text>
        {Object.values(JOBS_CONFIG).map((jobConfig) => {
          const activeJob = activeJobs.find(aj => aj.jobId === jobConfig.id);
          // Ne pas afficher si déjà dans "en cours"
          if (activeJob) return null;
          return renderJobCard(jobConfig);
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Pour éviter que le tab bar cache le contenu
  },
  titleSection: {
    marginBottom: 24,
  },
  screenTitle: {
    color: '#a855f7',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#acacad',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lockText: {
    color: '#888',
    marginTop: 4,
  },
  description: {
    color: '#ccc',
    marginBottom: 12,
  },
  rewards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  duration: {
    color: '#acacad',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  timer: {
    color: '#a855f7',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  completedText: {
    color: '#4ade80',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: '#4ade80',
  },
  claimButtonLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#a855f7',
    marginTop: 12,
  },
});
