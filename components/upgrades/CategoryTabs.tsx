import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryTabsProps {
  activeCategory: 'business' | 'click';
  onSelectCategory: (category: 'business' | 'click') => void;
}

export const CategoryTabs = ({ activeCategory, onSelectCategory }: CategoryTabsProps) => {
  return (
    <View style={styles.container}>
      {/* Onglet Business */}
      <Pressable
        style={[styles.tab, activeCategory === 'business' && styles.activeTab]}
        onPress={() => onSelectCategory('business')}
      >
        {activeCategory === 'business' && (
          <LinearGradient
            colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={[styles.emoji, activeCategory === 'business' && styles.activeText]}>🏢</Text>
        <Text style={[styles.text, activeCategory === 'business' && styles.activeText]}>Business</Text>
      </Pressable>

      {/* Onglet Clics */}
      <Pressable
        style={[styles.tab, activeCategory === 'click' && styles.activeTab]}
        onPress={() => onSelectCategory('click')}
      >
        {activeCategory === 'click' && (
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={[styles.emoji, activeCategory === 'click' && styles.activeText]}>🖱️</Text>
        <Text style={[styles.text, activeCategory === 'click' && styles.activeText]}>Clics</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1f2937',
    overflow: 'hidden',
    gap: 8,
  },
  activeTab: {
    borderColor: '#a855f7',
    backgroundColor: '#1f2937', 
  },
  emoji: {
    fontSize: 20,
  },
  text: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 14,
  },
  activeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
