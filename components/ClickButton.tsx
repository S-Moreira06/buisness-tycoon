import { useHaptics } from '@/hooks/useHaptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { GAME_CONFIG } from '../constants/gameConfig';
import { useGameStore } from '../hooks/useGameStore';

interface FloatingTextProps {
  id: number;
  text: string;
  x: number;
  y: number;
  isCritical: boolean; // Nouvelle prop
  onComplete: (id: number) => void;
}

const FloatingText = ({ id, text, x, y, isCritical, onComplete }: FloatingTextProps) => {
  const positionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.2)).current; 
  const rotateAnim = useRef(new Animated.Value(0)).current; 

  const config = useRef({
    angle: Math.random() * 2 * Math.PI,
    // Les critiques volent plus loin !
    distance: (isCritical ? 120 : 80) + Math.random() * 80, 
    duration: 800 + Math.random() * 300,
    rotation: (Math.random() - 0.5) * 720,      
    delay: Math.random() * 50,
  }).current;

  useEffect(() => {
    const targetX = Math.cos(config.angle) * config.distance;
    const targetY = Math.sin(config.angle) * config.distance;

    Animated.parallel([
      Animated.timing(positionAnim, {
        toValue: { x: targetX, y: targetY },
        duration: config.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
        delay: config.delay,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1, 
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(config.duration * 0.5),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: config.duration * 0.5,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: isCritical ? 2 : 1.5, // Le critique grossit plus (x2)
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.rotation}deg`],
  });

  return (
    <Animated.Text
      style={[
        styles.text,
        // Style conditionnel pour le Critique
        isCritical && styles.criticalText,
        {
          left: x,
          top: y,
          opacity: opacityAnim,
          transform: [
            { translateX: positionAnim.x },
            { translateY: positionAnim.y },
            { scale: scaleAnim },
            { rotate: spin },
          ]
        }
      ]}
    >
      {text}
    </Animated.Text>
  );
};

// --- Composant Principal ---
export const ClickButton = () => {
  const { clickGame, getClickPower } = useGameStore(); 
  const { triggerLight, triggerHeavy } = useHaptics();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;
  
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number, isCritical: boolean}[]>([]);
  const textIdCounter = useRef(0);

  // Animation de respiration
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = (event: GestureResponderEvent) => {
    const { moneyPerClick, critChance, critMult } = getClickPower(); 
    clickGame();
    // --- LOGIQUE CRITIQUE ---
    const isCritical = Math.random() < critChance;
    
     const amount = isCritical ? moneyPerClick * critMult : moneyPerClick;
    
    if (isCritical) {
      triggerHeavy(); // Gère déjà la vérification on/off
    } else {
      triggerLight(); // Gère déjà la vérification on/off
    }
    
    // Animation Bouton
    scaleAnim.setValue(isCritical ? 0.85 : 0.92); // S'écrase plus fort si critique
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 150,
      useNativeDriver: true,
    }).start();

    // Ajout Texte Flottant
    const { locationX, locationY } = event.nativeEvent;
    
    const newId = textIdCounter.current++;
    setFloatingTexts(prev => [
      ...prev, 
      { 
        id: newId, 
        text: `+${Math.floor(amount)}€`, 
        x: locationX - 20, 
        y: locationY - 20,
        isCritical: isCritical
      }
    ]);
  };
  const stats = getClickPower();
  const removeFloatingText = (id: number) => {
    setFloatingTexts(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        {/* BOUTON */}
        <Pressable onPress={handlePress} style={{ position: 'relative' }}>
            <Animated.View style={[styles.glowOuter, { transform: [{ scale: glowAnim }] }]} />
            <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
              <LinearGradient
                colors={['#7c3aed', '#6d28d9']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>👆</Text>
                <View style={styles.buttonBorder} />
              </LinearGradient>
            </Animated.View>

            {floatingTexts.map(item => (
                <FloatingText 
                    key={item.id} 
                    {...item} 
                    onComplete={removeFloatingText} 
                />
            ))}
        </Pressable>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['rgba(31, 41, 55, 0.8)', 'rgba(17, 24, 39, 0.9)']}
            style={styles.statsBadge}
          >
            <View style={styles.statRow}>
                <View>
                    <Text style={styles.statsLabel}>PUISSANCE</Text>
                    <Text style={styles.statsValue}>{Math.floor(stats.moneyPerClick)} €/clic</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View>
                    <Text style={styles.statsLabel}>CRIT %/ CRIT X</Text>
                    {/* Affichage dynamique de la chance de crit */}
                    <Text style={[styles.statsValue, { color: '#fbbf24' }]}>
                        {Math.round(stats.critChance * 100)}% Crit / x{GAME_CONFIG.BASE_CRIT_MULTIPLIER.toFixed(1)}
                    </Text>
                </View>
            </View>
          </LinearGradient>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 10,
    overflow: 'visible',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  // Text Styles
  text: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: '900',
    color: '#10b981', // Vert normal
    zIndex: 9999,
    textShadowColor: 'rgba(0,0,0,1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    pointerEvents: 'none',
  },
  // Style spécifique Critique
  criticalText: {
    fontSize: 30, // BEAUCOUP plus gros
    color: '#fbbf24', // Jaune/Or
    textShadowColor: '#b45309', // Ombre orangée
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  // Bouton
  glowOuter: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    backgroundColor: 'rgba(168, 85, 247, 0.4)',
    zIndex: -1,
  },
  buttonContainer: {
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  buttonEmoji: {
    fontSize: 28,
  },
  buttonBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  // Stats
  statsContainer: {
    flex: 1,
    zIndex:0,
  },
  statsBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statsLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    alignSelf: 'center',
  },
});
