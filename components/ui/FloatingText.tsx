import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

interface FloatingTextProps {
  id: number;
  text: string;
  x: number;
  y: number;
  onComplete: (id: number) => void;
}

export const FloatingText = ({ id, text, x, y, onComplete }: FloatingTextProps) => {
  // Animations indépendantes
  const positionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.2)).current; 
  const rotateAnim = useRef(new Animated.Value(0)).current; 

  // Configuration aléatoire générée une seule fois au démarrage
  const config = useRef({
    angle: Math.random() * 2 * Math.PI,         // Direction (0 à 360°)
    distance: 80 + Math.random() * 100,         // Distance variable
    duration: 700 + Math.random() * 300,        // Durée variable
    // ROTATION : De -360deg à +360deg (Vrille complète aléatoire)
    rotation: (Math.random() - 0.5) * 720,      
    delay: Math.random() * 50,
  }).current;

  useEffect(() => {
    // Calcul de la position cible (Trigo)
    const targetX = Math.cos(config.angle) * config.distance;
    const targetY = Math.sin(config.angle) * config.distance;

    Animated.parallel([
      // 1. Mouvement explosif
      Animated.timing(positionAnim, {
        toValue: { x: targetX, y: targetY },
        duration: config.duration,
        easing: Easing.out(Easing.cubic), // Easing cubique pour un départ rapide
        useNativeDriver: true,
        delay: config.delay,
      }),

      // 2. La rotation 360° (synchronisée avec le mouvement)
      Animated.timing(rotateAnim, {
        toValue: 1, 
        duration: config.duration,
        useNativeDriver: true,
      }),

      // 3. Disparition progressive
      Animated.sequence([
        Animated.delay(config.duration * 0.5),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: config.duration * 0.5,
          useNativeDriver: true,
        }),
      ]),

      // 4. Effet Pop Scale
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 200,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete(id);
    });
  }, []);

  // Interpolation de la rotation (0 -> Valeur Aléatoire)
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.rotation}deg`], // Ex: '0deg' -> '280deg' ou '-310deg'
  });

  return (
    <Animated.Text
      style={[
        styles.text,
        {
          left: x,
          top: y,
          opacity: opacityAnim,
          transform: [
            { translateX: positionAnim.x },
            { translateY: positionAnim.y },
            { scale: scaleAnim },
            { rotate: spin }, // Applique la rotation calculée
          ]
        }
      ]}
    >
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    fontSize: 26, // Encore un peu plus gros pour l'effet cartoon
    fontWeight: '900',
    color: '#10b981',
    width:200,
    zIndex: 9999,
    textShadowColor: 'rgba(0,0,0,1)', 
    textShadowOffset: { width: 2, height: 2 }, // Ombre plus profonde
    textShadowRadius: 2,
    pointerEvents: 'none',
    textAlign: 'center',
  },
});
