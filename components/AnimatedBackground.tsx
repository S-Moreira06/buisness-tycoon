// components/AnimatedBackground.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AnimatedBackgroundProps {
  colors?: string[];
  speed?: number; // En secondes (défaut: 8)
}

export default function AnimatedBackground({ 
  colors = ['#000000', '#1a0a2e', '#16003e'], 
  speed = 8 
}: AnimatedBackgroundProps) {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, {
        duration: speed * 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Boucle infinie
      true // Reverse (aller-retour)
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.3 + animation.value * 0.4, // Oscille entre 0.3 et 0.7
    };
  });

  return (
    <AnimatedLinearGradient
      colors={colors}
      style={[StyleSheet.absoluteFillObject, animatedStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
}
