import { ACHIEVEMENTS } from '@/constants/achievementsConfig';
import { ComputedStats } from '@/types/game';
import { useGameStore } from './useGameStore';

/**
 * Hook qui calcule les statistiques dérivées à partir des données brutes
 * ✅ Approche Hybride : On ne stocke pas ces valeurs, on les calcule à la volée
 */
export const useComputedStats = (): ComputedStats => {
    const stats = useGameStore((state) => state.stats);
    const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);

    // ========== PERFORMANCE ==========
    const criticalHitRate = stats.totalClicks > 0
        ? (stats.totalCriticalClicks / stats.totalClicks) * 100
        : 0;

    const averageMoneyPerClick = stats.totalClicks > 0
        ? stats.moneyFromClicks / stats.totalClicks
        : 0;

    const clicksPerMinute = stats.totalPlayTime > 0
        ? (stats.totalClicks / stats.totalPlayTime) * 60
        : 0;

    const moneyPerSecondAverage = stats.totalPlayTime > 0
        ? stats.totalMoneyEarned / stats.totalPlayTime
        : 0;

  // ========== EFFICACITÉ ==========
    const efficiencyRatio = stats.totalMoneySpent > 0
        ? stats.totalMoneyEarned / stats.totalMoneySpent
        : stats.totalMoneyEarned > 0 ? Infinity : 0;

  // ========== RÉPARTITION ==========
    const clickIncomePercentage = stats.totalMoneyEarned > 0
        ? (stats.moneyFromClicks / stats.totalMoneyEarned) * 100
        : 0;

    const passiveIncomePercentage = stats.totalMoneyEarned > 0
        ? (stats.moneyFromPassive / stats.totalMoneyEarned) * 100
        : 0;

  // ========== ACHIEVEMENTS ==========
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const achievementCompletionRate = totalAchievements > 0
        ? (unlockedAchievements.length / totalAchievements) * 100
        : 0;

  // ========== SESSION ==========
    const currentSessionDuration = stats.currentSessionStart > 0
        ? Math.floor((Date.now() - stats.currentSessionStart) / 1000)
        : 0;

    return {
        criticalHitRate,
        averageMoneyPerClick,
        clicksPerMinute,
        moneyPerSecondAverage,
        efficiencyRatio,
        clickIncomePercentage,
        passiveIncomePercentage,
        achievementCompletionRate,
        currentSessionDuration,
    };
};
