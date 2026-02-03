import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { useGameStore } from './useGameStore'; // <--- 1. Import du Store

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('👤 Auth state changed:', currentUser?.email || 'No user');

      if (!currentUser) {
        // 🚨 DÉCONNEXION DÉTECTÉE
        // On remet le jeu à zéro pour éviter que le prochain utilisateur
        // ne récupère les données de celui qui vient de partir.
        console.log('🧹 Cleaning up local game data...');
        useGameStore.getState().resetGame();
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
