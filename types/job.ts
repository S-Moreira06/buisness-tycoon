// types/job.ts

export type JobStatus = 'available' | 'in_progress' | 'completed' | 'claimed';

export interface JobConfig {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  duration: number; // En secondes
  rewards: {
    money: number;
    reputation: number;
    xp: number;
  };
  unlockLevel?: number; // Niveau requis pour débloquer (optionnel)
  cooldown?: number; // Temps d'attente avant de refaire le job (en secondes, optionnel)
}

export interface ActiveJob {
  jobId: string;
  status: JobStatus;
  startedAt: number; // Timestamp en millisecondes
  completedAt?: number; // Timestamp en millisecondes (undefined si pas terminé)
  endTime: number; // Timestamp calculé (startedAt + duration)
  cooldownEndTime?: number; // 🆕 Timestamp de fin du cooldown
}

export interface JobState {
  activeJobs: Record<string, ActiveJob>; // Map jobId -> ActiveJob
  completedJobsCount: Record<string, number>; // Statistique : nombre de fois qu'un job a été complété
  totalJobsCompleted: number; // Stat globale
}
