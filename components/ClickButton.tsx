import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../hooks/useGameStore';

export const ClickButton = () => {
  const { clickGame, money } = useGameStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  // Animation de glow pulsante continue
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

  const handlePress = () => {
    clickGame();

    // Animation rapide et moderne
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Glow effect subtil */}
      <Animated.View
        style={[
          styles.glowOuter,
          {
            transform: [{ scale: glowAnim }],
            opacity: glowAnim.interpolate({
              inputRange: [1, 1.2],
              outputRange: [0.2, 0.4],
            }),
          },
        ]}
      />

      <View style={styles.content}>
        {/* Bouton moderne */}
        <Pressable onPress={handlePress}>
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed', '#6d28d9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonEmoji}>💎</Text>
            </LinearGradient>

            {/* Bordure subtile */}
            <View style={styles.buttonBorder} />
          </Animated.View>
        </Pressable>

        {/* Badge argent à droite */}
        <View style={styles.moneyContainer}>
          <LinearGradient
            colors={['#1a1a2e', '#0f0f1e']}
            style={styles.moneyBadge}
          >
            <Text style={styles.moneyLabel}>💰 Banque</Text>
            <Text style={styles.moneyValue}>
              {money.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}€
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#a855f7',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  buttonEmoji: {
    fontSize: 36,
  },
  buttonBorder: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    opacity: 0.2,
  },
  moneyContainer: {
    flex: 1,
  },
  moneyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  moneyLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
    fontWeight: '600',
  },
  moneyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a855f7',
  },
});
