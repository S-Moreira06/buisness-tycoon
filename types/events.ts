// types/events.ts
export type GameEvent =
    | { type: 'UPGRADE_PURCHASED'; upgradeId: string; upgradeType: 'business' | 'click'; tier: string }
    | { type: 'CLICK_UPGRADE_PURCHASED'; upgradeId: string; tier: string }
    | { type: 'BUSINESS_PURCHASED'; businessId: string; quantity: number }
    | { type: 'PLAYER_LEVEL_UP'; newLevel: number }

