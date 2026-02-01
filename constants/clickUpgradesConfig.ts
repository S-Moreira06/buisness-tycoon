import { TierType } from './tierConfig';

export interface ClickUpgradeConfig {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  effectType: 'base_money' | 'crit_chance' | 'crit_multiplier';
  effectValue: number;
  tier: TierType;
}

export const CLICK_UPGRADES_CONFIG: Record<string, ClickUpgradeConfig> = {
  // TIER BRONZE
  better_mouse: {
    id: 'better_mouse',
    name: '🖱️ Souris Ergonomique',
    description: 'Une meilleure prise en main pour cliquer plus fort.',
    reputationCost: 50,
    effectType: 'base_money',
    effectValue: 1, // +1€ par clic
    tier: 'bronze',
  },
  lucky_charm: {
    id: 'lucky_charm',
    name: '🍀 Trèfle à 4 feuilles',
    description: 'Augmente légèrement vos chances de coup critique.',
    reputationCost: 100,
    effectType: 'crit_chance',
    effectValue: 0.05, // +5% chance
    tier: 'bronze',
  },
  // TIER SILVER
  mechanical_switch: {
    id: 'mechanical_switch',
    name: '⚙️ Switches Mécaniques',
    description: 'Le clic satisfaisant qui rapporte gros.',
    reputationCost: 250,
    effectType: 'base_money',
    effectValue: 5,
    tier: 'silver',
  },
};