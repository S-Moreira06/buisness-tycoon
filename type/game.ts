export interface Stock {
  quantity: number;
  buyPrice: number;
}

export interface Business {
  level: number;
  income: number;
  owned: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  reputationCost: number;
  multiplier: number;  // ex: 1.2 = +20%
  affectedBusinesses: string[];  // IDs des businesses concernées
  purchased: boolean;  // Si déjà acheté
}

export interface GameState {
  money: number;
  reputation: number;
  totalPassiveIncome: number;
  ownedStocks: Record<string, Stock>;
  businesses: Record<string, Business>;
  upgrades: Record<string, Upgrade>;
}
