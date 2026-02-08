// hooks/useJobNotification.ts
import { useEffect } from 'react';
import { useGameStore } from './useGameStore';

/**
 * Hook qui vérifie toutes les secondes si des jobs sont terminés
 * et retourne un booléen pour afficher le badge
 */
export function useJobNotification() {
  const checkJobsCompletion = useGameStore((state) => state.checkJobsCompletion);
  const hasCompletedJobs = useGameStore((state) => state.hasCompletedJobs());
  
  useEffect(() => {
    // Vérifier immédiatement au mount
    checkJobsCompletion();
    
    // Puis toutes les secondes
    const interval = setInterval(() => {
      checkJobsCompletion();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [checkJobsCompletion]);
  
  return hasCompletedJobs;
}
