/**
 * Configuration des tiers d'upgrades
 * Système de progression par paliers
 */

export interface TierConfig {
  color: string;
  gradient: [string, string];
  label: string;
  icon: string;
  minReputation: number;
}

export const TIER_CONFIG: Record<string, TierConfig> = {
  all: {
    color: '#6b7280',
    gradient: ['#6b7280', '#4b5563'],
    label: 'Tous',
    icon: '🎯',
    minReputation: 0,
  },
  bronze: {
    color: '#cd7f32',
    gradient: ['#cd7f32', '#a0522d'],
    label: 'Bronze',
    icon: '🥉',
    minReputation: 0,
  },
  silver: {
    color: '#c0c0c0',
    gradient: ['#d4d4d4', '#a8a8a8'],
    label: 'Argent',
    icon: '🥈',
    minReputation: 100,
  },
  gold: {
    color: '#ffd700',
    gradient: ['#ffd700', '#ffaa00'],
    label: 'Or',
    icon: '🥇',
    minReputation: 300,
  },
  platinum: {
    color: '#e5e4e2',
    gradient: ['#e5e4e2', '#b8b8b8'],
    label: 'Platine',
    icon: '💎',
    minReputation: 800,
  },
  diamond: {
    color: '#b9f2ff',
    gradient: ['#b9f2ff', '#4dd0e1'],
    label: 'Diamant',
    icon: '💠',
    minReputation: 1500,
  },
  master: {
    color: '#ff00ff',
    gradient: ['#ff00ff', '#aa00ff'],
    label: 'Master',
    icon: '👑',
    minReputation: 3000,
  },
} as const;

// Type helpers
export type TierType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
export type TierFilter = TierType | 'all';

// Ordre des tiers pour affichage
export const TIER_ORDER: TierType[] = [
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
  'master',
];

// Helper pour obtenir le tier en fonction de la réputation
export const getTierByReputation = (reputation: number): TierType => {
  if (reputation >= 3000) return 'master';
  if (reputation >= 1500) return 'diamond';
  if (reputation >= 800) return 'platinum';
  if (reputation >= 300) return 'gold';
  if (reputation >= 100) return 'silver';
  return 'bronze';
};

// Helper pour obtenir le prochain tier
export const getNextTier = (currentTier: TierType): TierType | null => {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  if (currentIndex === -1 || currentIndex === TIER_ORDER.length - 1) {
    return null;
  }
  return TIER_ORDER[currentIndex + 1];
};

// Helper pour calculer la progression vers le prochain tier
export const getTierProgress = (reputation: number): {
  currentTier: TierType;
  nextTier: TierType | null;
  progress: number; // 0-1
  reputationNeeded: number;
} => {
  const currentTier = getTierByReputation(reputation);
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: 1,
      reputationNeeded: 0,
    };
  }

  const currentMin = TIER_CONFIG[currentTier].minReputation;
  const nextMin = TIER_CONFIG[nextTier].minReputation;
  const progress = (reputation - currentMin) / (nextMin - currentMin);
  const reputationNeeded = nextMin - reputation;

  return {
    currentTier,
    nextTier,
    progress: Math.min(progress, 1),
    reputationNeeded: Math.max(reputationNeeded, 0),
  };
};
