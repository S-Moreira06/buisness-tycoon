export interface BusinessConfig {
  id: string;
  name: string;
  emoji: string;
  baseIncome: number; // Revenu par seconde (avant upgrades)
  baseCost: number; // Prix du premier achat
  costMultiplier: number; // Multiplicateur de coût à chaque achat
  unlockLevel?: number; 
}

export interface BusinessCardProps {
  businessId: string;
  name: string;
  baseIncome?: number;
  buyPrice: number;
  baseCost?: number,
  locked?: boolean;
}