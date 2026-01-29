import * as NavigationBar from 'expo-navigation-bar';
import { useState } from 'react';

export function useImmersiveMode() {
  const [isHidden, setIsHidden] = useState(false);

  const toggleNavigationBar = async () => {
    try {
      if (isHidden) {
        // Affiche la barre
        await NavigationBar.setVisibilityAsync('visible');
        setIsHidden(false);
      } else {
        // Cache la barre
        await NavigationBar.setVisibilityAsync('hidden');
        setIsHidden(true);
      }
    } catch (error) {
      console.error('Erreur immersive mode:', error);
    }
  };

  return { isHidden, toggleNavigationBar };
}
