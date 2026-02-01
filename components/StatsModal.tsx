import { useGameStore } from '@/hooks/useGameStore';
import { LinearGradient } from 'expo-linear-gradient';
import numeral from 'numeral';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { CustomModal } from './CustomModal';

interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
}

// Déplacer les sous-composants en dehors pour éviter les re-créations inutiles
const StatRow = ({ label, value, color = '#fff' }: { label: string; value: string | number, color?: string }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  }}>
    <Text style={{ color: '#d1d5db', fontSize: 16, fontWeight: '500' }}>{label}</Text>
    <Text style={{ color: color, fontSize: 16, fontWeight: 'bold' }}>{value}</Text>
  </View>
);

const SectionTitle = ({ title, color }: { title: string, color: string }) => (
  <Text style={{ 
      color: color, 
      fontSize: 12, 
      fontWeight: 'bold', 
      textTransform: 'uppercase', 
      marginTop: 20, 
      marginBottom: 8,
      opacity: 0.9 
  }}>
    {title}
  </Text>
);

export const StatsModal = ({ visible, onClose }: StatsModalProps) => {
  const stats = useGameStore(useShallow((state) => state.stats));

  if (!stats) return null;

  return (
    <CustomModal visible={visible} onDismiss={onClose}>
      <LinearGradient
        colors={['rgba(30, 27, 75, 0.95)', 'rgba(49, 46, 129, 0.95)']}
        style={{
          width: '100%',
          height: '100%',
          padding: 20,
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>
          📊 Statistiques
        </Text>

        <ScrollView 
            style={{ width: '100%' }} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
          <SectionTitle title="Activité" color="#fbbf24" />
          <StatRow label="Clics Totaux" value={numeral(stats.totalClicks).format('0,0')} />
          <StatRow label="Clics Critiques" value={numeral(stats.totalCriticalClicks).format('0,0')} />
          <StatRow label="Temps de jeu" value={`${Math.floor(stats.totalPlayTime / 60)} min`} />

          <SectionTitle title="Économie" color="#4ade80" />
          <StatRow label="Argent Généré" value={numeral(stats.totalMoneyEarned).format('$0.00a')} color="#4ade80" />
          <StatRow label="Argent Dépensé" value={numeral(stats.totalMoneySpent).format('$0.00a')} />
          <StatRow label="Fortune Max" value={numeral(stats.maxMoneyReached).format('$0.00a')} color="#fcd34d" />
          
          <SectionTitle title="Progression" color="#60a5fa" />
          <StatRow label="Affaires achetées" value={stats.itemsPurchased} />
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            marginTop: 16,
            paddingVertical: 10,
            paddingHorizontal: 24,
            backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)'
          })}
        >
          <Text style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '500' }}>Fermer</Text>
        </Pressable>

      </LinearGradient>
    </CustomModal>
  );
};
