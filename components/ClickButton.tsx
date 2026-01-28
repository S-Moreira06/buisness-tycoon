import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../hooks/useGameStore';

export const ClickButton = () => {
  const { clickGame, money } = useGameStore();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    clickGame();
    
    // Animation du bouton
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.button,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.buttonText}>💰 CLICK</Text>
        </Animated.View>
      </Pressable>
      <Text style={styles.moneyDisplay}>
        ${money.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    marginVertical: 40,
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  moneyDisplay: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
});
