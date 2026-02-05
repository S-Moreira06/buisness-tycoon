// hooks/useUpgradeUnlock.ts

import { useMemo } from 'react';
import { BUSINESSES_CONFIG } from '../constants/businessesConfig';
import { UnlockCheckResult, UnlockCondition } from '../types/unlockConditions';

export const useUpgradeUnlock = (
  unlockConditions: UnlockCondition[] | undefined,
  gameState: {
    businesses: Record<string, any>;
    stats: {
      totalClicks: number;
      upgradesPurchased: number;
    };
    totalPassiveIncome: number;
    playerLevel: number;
    combo?: { currentStreak: number };
  }
): UnlockCheckResult => {
  return useMemo(() => {
    // Si pas de conditions, toujours déverrouillé
    if (!unlockConditions || unlockConditions.length === 0) {
      return {
        isUnlocked: true,
        progress: 1,
        missingConditions: [],
      };
    }

    const missingConditions: UnlockCheckResult['missingConditions'] = [];

    for (const condition of unlockConditions) {
      let current = 0;
      let required = condition.value;
      let label = condition.label || '';

      switch (condition.type) {
        case 'business_quantity': {
          const business = gameState.businesses[condition.businessId!];
          current = business?.quantity || 0;
          const config = BUSINESSES_CONFIG[condition.businessId!];
          if (!config) {
            console.warn(`⚠️ Business config manquant pour: ${condition.businessId}`);
            label = `Posséder ${required}x ${condition.businessId}`;
          } else {
            label = label || `Posséder ${required}x ${config.name}`;
          }          
          break;
        }

        case 'business_level': {
          const business = gameState.businesses[condition.businessId!];
          current = business?.level || 0;
          const config = BUSINESSES_CONFIG[condition.businessId!];
          label = label || `${config?.name || condition.businessId} niveau ${required}`;
          break;
        }

        case 'upgrades_purchased': {
          current = gameState.stats.upgradesPurchased;
          label = label || `Acheter ${required} améliorations`;
          break;
        }

        case 'passive_income': {
          current = gameState.totalPassiveIncome;
          label = label || `Revenu passif : ${required.toLocaleString()}€/s`;
          break;
        }

        case 'player_level': {
          current = gameState.playerLevel;
          label = label || `Atteindre le niveau ${required}`;
          break;
        }

        case 'total_clicks': {
          current = gameState.stats.totalClicks;
          label = label || `Effectuer ${required.toLocaleString()} clics`;
          break;
        }

        case 'combo_reached': {
          current = gameState.combo?.currentStreak || 0;
          label = label || `Atteindre un combo de ${required}`;
          break;
        }
      }

      const progress = Math.min(current / required, 1);

      if (current < required) {
        missingConditions.push({
          label,
          current,
          required,
          progress,
        });
      }
    }

    const globalProgress = missingConditions.length === 0
      ? 1
      : missingConditions.reduce((sum, c) => sum + c.progress, 0) / unlockConditions.length;

    return {
      isUnlocked: missingConditions.length === 0,
      progress: globalProgress,
      missingConditions,
    };
  }, [unlockConditions, gameState]);
};
