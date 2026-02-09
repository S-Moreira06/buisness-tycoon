// constants/jobsConfig.ts
import { JobConfig } from '@/types/job';

export const JOBS_CONFIG: Record<string, JobConfig> = {
    // ========================================
  // 🔧 TIER DEV/DEBUG (À RETIRER EN PRODUCTION)
  // ========================================
  dev_god_boost: {
    id: 'dev_god_boost',
    name: '[DEV] FOCUS! ELLE SAIT BIEN QUE J\'SUIS FOCUS',
    description: 'HONEY WHERE ARE YOU! WHERE IS YOUR PROJECT... JE SUIS INQUIET...',
    icon: '🫶🏻',
    duration:1, // 1 secondes
    rewards: {
      money: 5000,
      reputation: 0,
      xp: 0,
    },
    unlockLevel: 1,
    cooldown: 5,
  },
  // dev_xp_boost: {
  //   id: 'dev_xp_boost',
  //   name: '[DEV] XP Booster',
  //   description: '⚠️ Job de test uniquement. Donne 500 XP instantanément pour tester la progression des niveaux.',
  //   icon: '⭐',
  //   duration: 5, // 5 secondes
  //   rewards: {
  //     money: 0,
  //     reputation: 0,
  //     xp: 500,
  //   },
  //   unlockLevel: 1,
  //   cooldown: 5,
  // },
  // dev_reputation_boost: {
  //   id: 'dev_reputation_boost',
  //   name: '[DEV] Reputation Booster',
  //   description: '⚠️ Job de test uniquement. Donne 100 réputation pour débloquer rapidement les upgrades.',
  //   icon: '🏆',
  //   duration: 5, // 5 secondes
  //   rewards: {
  //     money: 0,
  //     reputation: 100,
  //     xp: 0,
  //   },
  //   unlockLevel: 1,
  //   cooldown: 5,
  // },

  // dev_money_boost: {
  //   id: 'dev_money_boost',
  //   name: '[DEV] Money Printer',
  //   description: '⚠️ Job de test uniquement. Génère 1000€ pour tester les achats de businesses.',
  //   icon: '💰',
  //   duration: 5, // 5 secondes
  //   rewards: {
  //     money: 1000,
  //     reputation: 0,
  //     xp: 0,
  //   },
  //   unlockLevel: 1,
  //   cooldown: 5,
  // },
  // ========================================
  // 🔰 TIER DÉBUTANT (Niveau 1-5)
  // ========================================
  flyer_distributor: {
    id: 'flyer_distributor',
    name: 'Distributeur de Flyers',
    description: 'Distribuez des prospectus dans les rues pour promouvoir des commerces locaux. Un bon moyen de gagner rapidement ses premiers sous.',
    icon: '📄',
    duration: 5 * 60, // 5 minutes
    rewards: {
      money: 80,
      reputation: 3,
      xp: 35,
    },
    unlockLevel: 1,
    cooldown: 60,
  },
  courier_bike: {
    id: 'courier_bike',
    name: 'Coursier en 2 roues',
    description: 'Livrez des colis à travers la ville en scooter. Rapide, efficace, et lucratif pour les débutants.',
    icon: '🛵',
    duration: 7 * 60, // 7 minutes
    rewards: {
      money: 150,
      reputation: 6,
      xp: 55,
    },
    unlockLevel: 3,
    cooldown: 120,
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
    unlockLevel: 5,
    cooldown: 180,
  },

  // ========================================
  // 💼 TIER INTERMÉDIAIRE (Niveau 6-10)
  // ========================================

  babysitter: {
    id: 'babysitter',
    name: 'Baby-Sitting',
    description: ' Garde d\'enfants au domicile des parents, surveillance des devoirs et activités ludiques.',
    icon: '👶',
    duration: 10 * 60, // 10 minutes
    rewards: {
      money: 250,
      reputation: 15,
      xp: 100,
    },
    unlockLevel: 6,
    cooldown: 300,
  },
  barman: {
    id: 'barman',
    name: 'Barman',
    description: ' Spécialisé dans le shaking abusif de Toutalegout.',
    icon: '🍹',
    duration: 10 * 60, // 10 minutes
    rewards: {
      money: 350,
      reputation: 5,
      xp: 190,
    },
    unlockLevel: 10,
    cooldown: 500,
  },

    // ========================================
  // 🏆 TIER AVANCÉ (Niveau 11-30)
  // ========================================

  freelance_designer: {
    id: 'freelance_designer',
    name: 'Designer Freelance',
    description: 'Créez des visuels pour des petites entreprises. Travail créatif et bien payé.',
    icon: '🎨',
    duration: 25 * 60, // 25 minutes
    rewards: {
      money: 600,
      reputation: 20,
      xp: 250,
    },
    unlockLevel:15,
    cooldown: 600,
  },

  event_photographer: {
    id: 'event_photographer',
    name: 'Photographe d\'Événements',
    description: 'Couvrez des mariages, anniversaires et soirées professionnelles. Prestige et revenus assurés.',
    icon: '📸',
    duration: 20 * 60, // 20 minutes
    rewards: {
      money: 500,
      reputation: 30,
      xp: 290,
    },
    unlockLevel: 19,
    cooldown: 700,
  },

  tech_consultant: {
    id: 'tech_consultant',
    name: 'Consultant IT',
    description: 'Accompagnez des PME dans leur transformation numérique. Expertise technique et rémunération premium.',
    icon: '💻',
    duration: 40 * 60, // 40 minutes
    rewards: {
      money: 1200,
      reputation: 35,
      xp: 320,
    },
    unlockLevel: 15,
    cooldown: 800,
  },

  real_estate_agent: {
    id: 'real_estate_agent',
    name: 'Agent Immobilier',
    description: 'Vendez des biens immobiliers haut de gamme. Commissions généreuses et réseau influent.',
    icon: '🏡',
    duration: 45 * 60, // 45 minutes
    rewards: {
      money: 1800,
      reputation: 45,
      xp: 420,
    },
    unlockLevel: 25,
    cooldown: 900,
  },

  // ========================================
  // 💎 TIER ÉLITE (Niveau 30+)
  // ========================================

  investment_banker: {
    // A prévoir : investissement d'un montant au choix du joueur, prevision de gain et benefices reels aléatoires
    id: 'investment_banker',
    name: 'Banquier d\'Affaires',
    description: 'Gérez des fusions-acquisitions pour des multinationales. Les montants en jeu sont colossaux.',
    icon: '💼',
    duration: 60 * 60, // 1 heure
    rewards: {
      money: 3500,
      reputation: 60,
      xp: 600,
    },
    unlockLevel: 30,
    cooldown:1000,
  },

  celebrity_manager: {
    id: 'celebrity_manager',
    name: 'Manager de Célébrités',
    description: 'Gérez la carrière de stars internationales. Prestige maximum et revenus stratosphériques.',
    icon: '⭐',
    duration: 90 * 60, // 1h30
    rewards: {
      money: 5000,
      reputation: 100,
      xp: 850,
    },
    unlockLevel: 35,
    cooldown: 1100,
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
