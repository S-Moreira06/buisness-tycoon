import { useComputedStats } from '@/hooks/useComputedStats';
import { useGameStore } from '@/hooks/useGameStore';
import { formatCompact, formatMoney, formatTime } from '@/utils/formatNumber';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { CustomModal } from './CustomModal';

interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
}

// ========== TYPES DE TABS ==========
type TabType = 'activity' | 'economy' | 'performance' | 'progression' | 'engagement';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  color: string;
}

const TABS: Tab[] = [
  { id: 'activity', label: 'Activité', icon: '🎮', color: '#fbbf24' },
  { id: 'economy', label: 'Économie', icon: '💰', color: '#4ade80' },
  { id: 'performance', label: 'Performance', icon: '📊', color: '#60a5fa' },
  { id: 'progression', label: 'Progression', icon: '🚀', color: '#a855f7' },
  { id: 'engagement', label: 'Engagement', icon: '🏆', color: '#f87171' },
];

// ========== COMPOSANTS RÉUTILISABLES ==========
const StatRow = ({ 
  label, 
  value, 
  color = '#fff', 
  subtitle 
}: { 
  label: string; 
  value: string | number; 
  color?: string;
  subtitle?: string;
}) => (
  <View style={styles.statRow}>
    <View style={styles.statLabelContainer}>
      <Text style={styles.statLabel}>{label}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

const SectionTitle = ({ title, color }: { title: string; color: string }) => (
  <Text style={[styles.sectionTitle, { color }]}>
    {title}
  </Text>
);

// ========== COMPOSANT PRINCIPAL ==========
export const StatsModal = ({ visible, onClose }: StatsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('activity');
  
  const stats = useGameStore(useShallow((state) => state.stats));
  const computed = useComputedStats();

  if (!stats) return null;

  // ========== RENDU DES CONTENUS PAR TAB ==========
  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <>
            <SectionTitle title="Clics" color="#fbbf24" />
            <StatRow label="Clics Totaux" value={formatCompact(stats.totalClicks, 0)} />
            <StatRow 
              label="Clics Critiques" 
              value={formatCompact(stats.totalCriticalClicks, 0)} 
              color="#f87171"
            />
            <StatRow 
              label="Taux de Critique" 
              value={`${computed.criticalHitRate.toFixed(1)}%`} 
              color="#fbbf24"
            />
            
            <SectionTitle title="Temps de Jeu" color="#60a5fa" />
            <StatRow label="Temps Total" value={formatTime(stats.totalPlayTime)} />
            <StatRow 
              label="Session Actuelle" 
              value={formatTime(computed.currentSessionDuration)} 
              color="#4ade80"
            />
            <StatRow label="Plus Longue Session" value={formatTime(stats.longestSession)} />
            <StatRow label="Sessions Jouées" value={stats.sessionsPlayed} />
          </>
        );

      case 'economy':
        return (
          <>
            <SectionTitle title="Fortune" color="#4ade80" />
            <StatRow 
              label="Argent Total Généré" 
              value={formatMoney(stats.totalMoneyEarned)} 
              color="#4ade80"
            />
            <StatRow 
              label="Argent Dépensé" 
              value={formatMoney(stats.totalMoneySpent)} 
              color="#f87171"
            />
            <StatRow 
              label="Record Fortune" 
              value={formatMoney(stats.maxMoneyReached)} 
              color="#fcd34d"
            />
            
            <SectionTitle title="Répartition des Revenus" color="#60a5fa" />
            <StatRow 
              label="Revenus via Clics" 
              value={`${formatMoney(stats.moneyFromClicks)} (${computed.clickIncomePercentage.toFixed(1)}%)`}
              subtitle={`Moy: ${formatMoney(computed.averageMoneyPerClick)}/clic`}
            />
            <StatRow 
              label="Revenus via Passif" 
              value={`${formatMoney(stats.moneyFromPassive)} (${computed.passiveIncomePercentage.toFixed(1)}%)`}
            />
            <StatRow 
              label="Revenus via Succès" 
              value={formatMoney(stats.moneyFromAchievements)}
            />
            
            <SectionTitle title="Réputation" color="#a855f7" />
            <StatRow 
              label="Réputation Totale Gagnée" 
              value={formatCompact(stats.totalReputationEarned, 0)}
            />
            <StatRow 
              label="Réputation Dépensée" 
              value={formatCompact(stats.totalReputationSpent, 0)} 
              color="#f87171"
            />
            <StatRow 
              label="Record Réputation" 
              value={formatCompact(stats.maxReputationReached, 0)} 
              color="#fcd34d"
            />
          </>
        );

      case 'performance':
        return (
          <>
            <SectionTitle title="Efficacité Économique" color="#4ade80" />
            <StatRow 
              label="Ratio Efficacité" 
              value={computed.efficiencyRatio === Infinity ? '∞' : computed.efficiencyRatio.toFixed(2)}
              subtitle="Argent gagné / Argent dépensé"
              color="#4ade80"
            />
            <StatRow 
              label="Argent par Seconde" 
              value={`${formatMoney(computed.moneyPerSecondAverage)}/sec`}
            />
            <StatRow 
              label="Meilleur Revenu Passif" 
              value={`${formatMoney(stats.bestPassiveIncomeReached)}/sec`} 
              color="#fcd34d"
            />
            
            <SectionTitle title="Performance Clics" color="#fbbf24" />
            <StatRow 
              label="Clics par Minute" 
              value={computed.clicksPerMinute.toFixed(1)}
            />
            <StatRow 
              label="Argent Moyen par Clic" 
              value={formatMoney(computed.averageMoneyPerClick)}
            />
            <StatRow 
              label="Taux de Critique" 
              value={`${computed.criticalHitRate.toFixed(1)}%`}
            />
          </>
        );

      case 'progression':
        return (
          <>
            <SectionTitle title="Businesses" color="#10b981" />
            <StatRow 
              label="Affaires Achetées" 
              value={stats.businessesBought}
            />
            <StatRow 
              label="Types Uniques Possédés" 
              value={stats.uniqueBusinessesOwned} 
              color="#4ade80"
            />
            <StatRow 
              label="Niveaux Totaux" 
              value={stats.totalBusinessLevels}
            />
            
            <SectionTitle title="Améliorations" color="#a855f7" />
            <StatRow 
              label="Boosts Totaux" 
              value={stats.upgradesPurchased}
            />
            <StatRow 
              label="Boosts de Clic" 
              value={stats.clickUpgradesPurchased}
            />
            <StatRow 
              label="Boosts de Business" 
              value={stats.businessUpgradesPurchased}
            />
            
            <SectionTitle title="Succès" color="#fbbf24" />
            <StatRow 
              label="Succès Débloqués" 
              value={stats.achievementsUnlocked}
            />
            <StatRow 
              label="Taux de Complétion" 
              value={`${computed.achievementCompletionRate.toFixed(1)}%`} 
              color="#4ade80"
            />
            
            <SectionTitle title="Milestones" color="#60a5fa" />
            {stats.firstBusinessPurchaseTime > 0 && (
              <StatRow 
                label="Premier Business" 
                value={new Date(stats.firstBusinessPurchaseTime).toLocaleDateString('fr-FR')}
              />
            )}
            {stats.firstUpgradePurchaseTime > 0 && (
              <StatRow 
                label="Premier Upgrade" 
                value={new Date(stats.firstUpgradePurchaseTime).toLocaleDateString('fr-FR')}
              />
            )}
            {stats.firstAchievementUnlockTime > 0 && (
              <StatRow 
                label="Premier Succès" 
                value={new Date(stats.firstAchievementUnlockTime).toLocaleDateString('fr-FR')}
              />
            )}
          </>
        );

      case 'engagement':
        return (
          <>
            <SectionTitle title="Fidélité" color="#f87171" />
            <StatRow 
              label="Jours Consécutifs" 
              value={`${stats.daysPlayedStreak} jour${stats.daysPlayedStreak > 1 ? 's' : ''}`} 
              color="#fbbf24"
            />
            <StatRow 
              label="Sessions Jouées" 
              value={stats.sessionsPlayed}
            />
            <StatRow 
              label="Dernière Connexion" 
              value={new Date(stats.lastLoginDate).toLocaleDateString('fr-FR')}
            />
            
            <SectionTitle title="Système" color="#9ca3af" />
            <StatRow 
              label="Resets Effectués" 
              value={stats.totalResets}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <CustomModal visible={visible} onDismiss={onClose}>
      <LinearGradient
        colors={['rgba(30, 27, 75, 0.95)', 'rgba(49, 46, 129, 0.95)']}
        style={styles.container}
      >
        {/* HEADER */}
        <Text style={styles.title}>📊 Statistiques</Text>

        {/* TABS */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={({ pressed }) => [
                  styles.tab,
                  isActive && styles.tabActive,
                  pressed && styles.tabPressed,
                  { borderColor: isActive ? tab.color : 'rgba(255,255,255,0.2)' }
                ]}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[
                  styles.tabLabel, 
                  isActive && styles.tabLabelActive,
                  isActive && { color: tab.color }
                ]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* CONTENT */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentInner}
        >
          {renderTabContent()}
        </ScrollView>

        {/* CLOSE BUTTON */}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed
          ]}
        >
          <Text style={styles.closeButtonText}>Fermer</Text>
        </Pressable>

      </LinearGradient>
    </CustomModal>
  );
};

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  
  // Tabs
  tabsContainer: {
    width: '100%',
    maxHeight: 60,
    marginBottom: 16,
  },
  tabsContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabPressed: {
    opacity: 0.7,
  },
  tabIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  tabLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
  },
  
  // Content
  content: {
    width: '100%',
    flex: 1,
  },
  contentInner: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
    opacity: 0.9,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  statLabel: {
    color: '#d1d5db',
    fontSize: 16,
    fontWeight: '500',
  },
  statSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Close Button
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closeButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
