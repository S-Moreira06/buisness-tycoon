// types/unlockConditions.ts

export type UnlockConditionType =
  | 'business_quantity'    // Quantité d'un business spécifique
  | 'business_level'       // Niveau d'un business
  | 'upgrades_purchased'   // Nombre total d'upgrades achetés
  | 'passive_income'       // Revenu passif supérieur à X
  | 'player_level'         // Niveau du joueur
  | 'total_clicks'         // Nombre de clics total
  | 'combo_reached';       // Combo atteint au moins X

export interface UnlockCondition {
  type: UnlockConditionType;
  businessId?: string;     // Pour business_quantity et business_level
  value: number;           // Valeur cible
  label?: string;          // Label personnalisé (optionnel)
}

export interface UnlockCheckResult {
  isUnlocked: boolean;
  progress: number;        // 0-1 (pour afficher une barre)
  missingConditions: {
    label: string;
    current: number;
    required: number;
    progress: number;      // 0-1
  }[];
}
