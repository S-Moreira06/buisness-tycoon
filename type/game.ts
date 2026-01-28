export interface Stock {
  quantity: number;
  buyPrice: number;
}

export interface Business {
  level: number;
  income: number;
  owned: boolean;
}

export interface GameState {
  money: number;
  reputation: number;
  totalPassiveIncome: number;
  ownedStocks: Record<string, Stock>;
  businesses: Record<string, Business>;
}
