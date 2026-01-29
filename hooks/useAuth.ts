import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('👤 Auth state changed:', currentUser?.email || 'No user');
        setUser(currentUser);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
