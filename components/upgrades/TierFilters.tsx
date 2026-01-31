import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TIER_CONFIG, TierFilter } from '../../constants/tierConfig';

interface TierFiltersProps {
  activeTier: TierFilter;
  onTierChange: (tier: TierFilter) => void;
}

export const TierFilters = ({ activeTier, onTierChange }: TierFiltersProps) => {
  return (
    <View style={styles.filtersContainer}>
      <Text style={styles.filtersLabel}>Tier :</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
      >
        {(Object.keys(TIER_CONFIG) as TierFilter[]).map((tier) => (
          <Pressable
            key={tier}
            style={[
              styles.filterChip,
              activeTier === tier && styles.activeFilterChip,
              activeTier === tier && { borderColor: TIER_CONFIG[tier].color },
            ]}
            onPress={() => onTierChange(tier)}
          >
            {activeTier === tier && (
              <View
                style={[
                  styles.filterChipGlow,
                  { backgroundColor: TIER_CONFIG[tier].color },
                ]}
              />
            )}
            <Text style={styles.filterChipIcon}>{TIER_CONFIG[tier].icon}</Text>
            <Text
              style={[
                styles.filterChipText,
                activeTier === tier && styles.activeFilterChipText,
              ]}
            >
              {TIER_CONFIG[tier].label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  filtersLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  filtersScroll: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  activeFilterChip: {
    backgroundColor: '#0f0f1e',
    borderWidth: 2,
  },
  filterChipGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  filterChipIcon: {
    fontSize: 14,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeFilterChipText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
