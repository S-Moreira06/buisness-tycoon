import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TabType = 'all' | 'available' | 'purchased';

interface UpgradesTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    all: number;
    available: number;
    purchased: number;
  };
}

export const UpgradesTabs = ({
  activeTab,
  onTabChange,
  counts,
}: UpgradesTabsProps) => {
  const tabs: Array<{ key: TabType; icon: string; label: string }> = [
    { key: 'all', icon: '📋', label: 'Tous' },
    { key: 'available', icon: '🛒', label: 'Disponibles' },
    { key: 'purchased', icon: '✅', label: 'Possédées' },
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
        >
          {activeTab === tab.key && (
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              style={styles.tabGradient}
            />
          )}
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.icon} {tab.label}
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{counts[tab.key]}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingTop: 2,
    paddingBottom: 6,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#374151',
    position: 'relative',
    overflow: 'hidden',
    gap: 6,
  },
  activeTab: {
    borderColor: '#a855f7',
    borderWidth: 3,
  },
  tabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabBadge: {
    backgroundColor: '#374151',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
