// utils/formatNumber.ts
// Utilitaires de formatage de nombres - 100% natif JavaScript

// ==========================================
// CONFIGURATION GLOBALE
// ==========================================

const LOCALE = 'fr-FR';
const CURRENCY_SYMBOL = '€';

// Seuils pour notation compacte
const THOUSAND = 1_000;
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const TRILLION = 1_000_000_000_000;

// ==========================================
// FORMATAGE ARGENT
// ==========================================

/**
 * Formate un montant d'argent avec adaptation automatique
 * @param amount - Montant à formater
 * @param options - Options de formatage
 * @returns String formatée (ex: "1 500,50€" ou "1,5M€")
 */
export function formatMoney(
  amount: number,
  options: {
    compact?: boolean;       // Force le format compact (1.5M)
    forceDetailed?: boolean; // Force le format détaillé même pour grands nombres
    decimals?: number;       // Nombre de décimales (défaut: 2 pour détaillé, 1 pour compact)
    symbol?: string;         // Symbole de devise (défaut: "€")
  } = {}
): string {
  const {
    compact = false,
    forceDetailed = false,
    decimals,
    symbol = CURRENCY_SYMBOL,
  } = options;

  // Logique adaptative : compact au-delà de 1 million
  const shouldBeCompact = compact || (amount >= MILLION && !forceDetailed);

  if (shouldBeCompact) {
    // Format compact personnalisé : 1,5M€
    const dec = decimals ?? 1;
    return formatCompactNumber(amount, dec) + symbol;
  } else {
    // Format détaillé : 1 500,50€
    const dec = decimals ?? 2;
    return amount.toLocaleString(LOCALE, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    }) + symbol;
  }
}

// ==========================================
// FORMATAGE COMPACT (K, M, Md, T)
// ==========================================

/**
 * Formate un nombre en notation compacte (1,5M, 2,3Md, etc.)
 * @param value - Nombre à formater
 * @param decimals - Nombre de décimales (défaut: 1)
 * @returns String formatée
 */
function formatCompactNumber(value: number, decimals = 1): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= TRILLION) {
    return sign + (value / TRILLION).toLocaleString(LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + 'T';
  }
  
  if (absValue >= BILLION) {
    return sign + (value / BILLION).toLocaleString(LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + 'Md';
  }
  
  if (absValue >= MILLION) {
    return sign + (value / MILLION).toLocaleString(LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + 'M';
  }
  
  if (absValue >= THOUSAND) {
    return sign + (value / THOUSAND).toLocaleString(LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + 'k';
  }

  // Moins de 1000 : format normal
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ==========================================
// FORMATAGE XP
// ==========================================

/**
 * Formate l'expérience (entier avec séparateurs)
 * @param xp - Points d'expérience
 * @returns String formatée (ex: "125 890")
 */
export function formatXP(xp: number): string {
  return Math.floor(xp).toLocaleString(LOCALE);
}

// ==========================================
// FORMATAGE RÉPUTATION
// ==========================================

/**
 * Formate la réputation (entier, arrondissement automatique, compact si >1000)
 * @param reputation - Points de réputation
 * @returns String formatée (ex: "42", "1k", "2M")
 */
export function formatReputation(reputation: number): string {
  const rounded = Math.round(reputation);
  
  // Si >= 1000, utiliser format compact sans décimale
  if (rounded >= THOUSAND) {
    return formatCompactNumber(rounded, 0);
  }
  
  // Sinon, format normal
  return rounded.toLocaleString(LOCALE);
}


// ==========================================
// FORMATAGE POURCENTAGE
// ==========================================

/**
 * Formate un nombre en pourcentage
 * @param value - Valeur décimale (ex: 0.15 = 15%)
 * @param decimals - Nombre de décimales (défaut: 1)
 * @returns String formatée (ex: "15,0%")
 */
export function formatPercent(value: number, decimals = 1): string {
  return (value * 100).toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + '%';
}

// ==========================================
// FORMATAGE MULTIPLICATEUR
// ==========================================

/**
 * Formate un multiplicateur (ex: x2.5)
 * @param value - Valeur du multiplicateur
 * @param decimals - Nombre de décimales (défaut: 1)
 * @returns String formatée (ex: "×2,5")
 */
export function formatMultiplier(value: number, decimals = 1): string {
  return '×' + value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ==========================================
// FORMATAGE NOMBRE GÉNÉRIQUE
// ==========================================

/**
 * Formate un nombre avec séparateurs de milliers
 * @param value - Nombre à formater
 * @param decimals - Nombre de décimales (défaut: 0)
 * @returns String formatée
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ==========================================
// FORMATAGE TEMPS
// ==========================================

/**
 * Formate un temps en secondes vers format lisible
 * @param seconds - Temps en secondes
 * @param format - Format de sortie ('short', 'long', 'hms')
 * @returns String formatée
 */
export function formatTime(
  seconds: number,
  format: 'short' | 'long' | 'hms' = 'short'
): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  switch (format) {
    case 'hms':
      // Format HH:MM:SS
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    case 'long':
      // Format "2 heures 1 minute 5 secondes"
      const parts = [];
      if (hours > 0) parts.push(`${hours} ${hours > 1 ? 'heures' : 'heure'}`);
      if (minutes > 0) parts.push(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
      if (secs > 0 || parts.length === 0) parts.push(`${secs} ${secs > 1 ? 'secondes' : 'seconde'}`);
      return parts.join(' ');
    
    case 'short':
    default:
      // Format "2h 1m" ou "45s"
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      }
      return `${secs}s`;
  }
}

// ==========================================
// FORMATAGE ORDINAL (Leaderboard)
// ==========================================

/**
 * Formate un rang en position ordinale (1er, 2ème, 3ème...)
 * @param rank - Position (1, 2, 3...)
 * @returns String formatée (ex: "1er", "2ème")
 */
export function formatRank(rank: number): string {
  if (rank === 1) return '1er';
  return `${rank}ème`;
}

// ==========================================
// FORMATAGE COMPACT FORCÉ
// ==========================================

/**
 * Force le format compact même pour petits nombres
 * Utile pour économiser l'espace dans l'UI
 * @param value - Nombre à formater
 * @param decimals - Nombre de décimales (défaut: 1)
 * @returns String formatée (ex: "1,5k")
 */
export function formatCompact(value: number, decimals = 1): string {
  return formatCompactNumber(value, decimals);
}

// ==========================================
// FORMATAGE REVENU PAR SECONDE
// ==========================================

/**
 * Formate un revenu passif avec l'unité /s
 * @param amount - Montant par seconde
 * @param compact - Utiliser format compact
 * @returns String formatée (ex: "1,5k€/s")
 */
export function formatIncomePerSecond(amount: number, compact = true): string {
  const formatted = formatMoney(amount, { compact, decimals: compact ? 1 : 2 });
  return formatted + '/s';
}

// ==========================================
// FORMATAGE PRIX (pour UI compacte)
// ==========================================

/**
 * Formate un prix de manière ultra-compacte pour les boutons
 * @param price - Prix à formater
 * @returns String formatée (ex: "150k€", "2,5M€")
 */
export function formatPrice(price: number): string {
  if (price >= THOUSAND) {
    return formatMoney(price, { compact: true, decimals: 1 });
  }
  return formatMoney(price, { forceDetailed: true, decimals: 0 });
}

// ==========================================
// FORMATAGE DURÉE (millisecondes)
// ==========================================

/**
 * Formate une durée en millisecondes
 * @param ms - Durée en millisecondes
 * @returns String formatée (ex: "2,5s" ou "150ms")
 */
export function formatDuration(ms: number): string {
  if (ms >= 1000) {
    return (ms / 1000).toLocaleString(LOCALE, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + 's';
  }
  return Math.round(ms) + 'ms';
}

// ==========================================
// FORMATAGE DIFFÉRENCE (+/-)
// ==========================================

/**
 * Formate une différence avec signe explicite
 * @param value - Valeur de la différence
 * @param decimals - Nombre de décimales (défaut: 0)
 * @returns String formatée (ex: "+150", "-42")
 */
export function formatDifference(value: number, decimals = 0): string {
  const formatted = value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return value > 0 ? `+${formatted}` : formatted;
}
