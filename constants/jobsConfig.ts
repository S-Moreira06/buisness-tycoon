// constants/jobsConfig.ts
import { JobConfig } from '@/types/job';

export const JOBS_CONFIG: Record<string, JobConfig> = {
  // ========================================
  // 🔰 TIER DÉBUTANT (Niveau 1-5)
  // ========================================
  
  courier_bike: {
    id: 'courier_bike',
    name: 'Coursier en 2 roues',
    description: 'Livrez des colis à travers la ville en scooter. Rapide, efficace, et lucratif pour les débutants.',
    icon: '🛵',
    duration: 5 * 60, // 5 minutes
    rewards: {
      money: 150,
      reputation: 6,
      xp: 55,
    },
    unlockLevel: 1,
    cooldown: 0,
  },

  flyer_distributor: {
    id: 'flyer_distributor',
    name: 'Distributeur de Flyers',
    description: 'Distribuez des prospectus dans les rues pour promouvoir des commerces locaux. Un bon moyen de gagner rapidement.',
    icon: '📄',
    duration: 3 * 60, // 3 minutes
    rewards: {
      money: 80,
      reputation: 3,
      xp: 35,
    },
    unlockLevel: 1,
    cooldown: 0,
  },

  dog_walker: {
    id: 'dog_walker',
    name: 'Promeneur de Chiens',
    description: 'Baladez des chiens dans le parc. Simple, agréable et rémunérateur.',
    icon: '🐕',
    duration: 8 * 60, // 8 minutes
    rewards: {
      money: 220,
      reputation: 8,
      xp: 75,
    },
    unlockLevel: 2,
    cooldown: 0,
  },

  // ========================================
  // 💼 TIER INTERMÉDIAIRE (Niveau 5-10)
  // ========================================

  delivery_van: {
    id: 'delivery_van',
    name: 'Livreur en Camionnette',
    description: 'Transportez des marchandises volumineuses pour des entreprises locales. Plus lucratif que le scooter.',
    icon: '🚚',
    duration: 12 * 60, // 12 minutes
    rewards: {
      money: 450,
      reputation: 15,
      xp: 140,
    },
    unlockLevel: 5,
    cooldown: 0,
  },

  freelance_designer: {
    id: 'freelance_designer',
    name: 'Designer Freelance',
    description: 'Créez des visuels pour des petites entreprises. Travail créatif et bien payé.',
    icon: '🎨',
    duration: 15 * 60, // 15 minutes
    rewards: {
      money: 600,
      reputation: 20,
      xp: 180,
    },
    unlockLevel: 6,
    cooldown: 0,
  },

  event_photographer: {
    id: 'event_photographer',
    name: 'Photographe d\'Événements',
    description: 'Couvrez des mariages, anniversaires et soirées professionnelles. Prestige et revenus assurés.',
    icon: '📸',
    duration: 20 * 60, // 20 minutes
    rewards: {
      money: 850,
      reputation: 28,
      xp: 240,
    },
    unlockLevel: 8,
    cooldown: 0,
  },

  // ========================================
  // 🏆 TIER AVANCÉ (Niveau 10-15)
  // ========================================

  tech_consultant: {
    id: 'tech_consultant',
    name: 'Consultant IT',
    description: 'Accompagnez des PME dans leur transformation numérique. Expertise technique et rémunération premium.',
    icon: '💻',
    duration: 25 * 60, // 25 minutes
    rewards: {
      money: 1200,
      reputation: 35,
      xp: 320,
    },
    unlockLevel: 10,
    cooldown: 0,
  },

  real_estate_agent: {
    id: 'real_estate_agent',
    name: 'Agent Immobilier',
    description: 'Vendez des biens immobiliers haut de gamme. Commissions généreuses et réseau influent.',
    icon: '🏡',
    duration: 30 * 60, // 30 minutes
    rewards: {
      money: 1800,
      reputation: 45,
      xp: 420,
    },
    unlockLevel: 12,
    cooldown: 0,
  },

  // ========================================
  // 💎 TIER ÉLITE (Niveau 15+)
  // ========================================

  investment_banker: {
    id: 'investment_banker',
    name: 'Banquier d\'Affaires',
    description: 'Gérez des fusions-acquisitions pour des multinationales. Les montants en jeu sont colossaux.',
    icon: '💼',
    duration: 40 * 60, // 40 minutes
    rewards: {
      money: 3500,
      reputation: 60,
      xp: 600,
    },
    unlockLevel: 15,
    cooldown: 0,
  },

  celebrity_manager: {
    id: 'celebrity_manager',
    name: 'Manager de Célébrités',
    description: 'Gérez la carrière de stars internationales. Prestige maximum et revenus stratosphériques.',
    icon: '⭐',
    duration: 50 * 60, // 50 minutes
    rewards: {
      money: 5000,
      reputation: 80,
      xp: 850,
    },
    unlockLevel: 18,
    cooldown: 0,
  },
};

// ========================================
// 🔧 HELPER : Obtenir les jobs débloqués
// ========================================
export const getUnlockedJobs = (playerLevel: number): JobConfig[] => {
  return Object.values(JOBS_CONFIG).filter(
    (job) => !job.unlockLevel || playerLevel >= job.unlockLevel
  );
};

// ========================================
// 🔧 HELPER : Obtenir le prochain job à débloquer
// ========================================
export const getNextLockedJob = (playerLevel: number): JobConfig | null => {
  const lockedJobs = Object.values(JOBS_CONFIG)
    .filter((job) => job.unlockLevel && playerLevel < job.unlockLevel)
    .sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
  
  return lockedJobs[0] || null;
};
