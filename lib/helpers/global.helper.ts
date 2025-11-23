/**
 * Global Helper Functions
 * Centralized utility functions for the Uniswap Analytics Platform
 */

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format number as USD currency
 * @example formatCurrency(1234.56) => "$1,234.56"
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number as compact notation (K, M, B, T)
 * @example abbreviateNumber(1234567) => "1.23M"
 */
export function abbreviateNumber(value: number, decimals: number = 2): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(decimals)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(decimals)}K`;
  return value.toFixed(decimals);
}

/**
 * Format number as compact currency
 * @example formatCompactCurrency(1234567) => "$1.23M"
 */
export function formatCompactCurrency(value: number, decimals: number = 2): string {
  return `$${abbreviateNumber(value, decimals)}`;
}

/**
 * Format number as percentage
 * @example formatPercentage(0.1234) => "12.34%"
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format number with thousands separator
 * @example formatNumber(1234567.89) => "1,234,567.89"
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format token amount with proper decimals
 * @example formatTokenAmount(1234.56789, 4) => "1,234.5679"
 */
export function formatTokenAmount(value: number, decimals: number = 6): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value);
}

// ============================================
// ADDRESS & HASH FORMATTING
// ============================================

/**
 * Truncate Ethereum address
 * @example truncateAddress("0x1234...5678", 4) => "0x1234...5678"
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Truncate transaction hash
 * @example truncateHash("0xabcd...efgh", 6) => "0xabcd...efgh"
 */
export function truncateHash(hash: string, chars: number = 6): string {
  return truncateAddress(hash, chars);
}

/**
 * Check if string is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

// ============================================
// DATE & TIME FORMATTING
// ============================================

/**
 * Format date to readable string
 * @example formatDate(new Date()) => "Jan 1, 2024"
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Format date and time
 * @example formatDateTime(new Date()) => "Jan 1, 2024, 12:00 PM"
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format Unix timestamp to date
 */
export function formatUnixTimestamp(timestamp: number): string {
  return formatDate(new Date(timestamp * 1000));
}

// ============================================
// PERCENTAGE & CHANGE CALCULATIONS
// ============================================

/**
 * Calculate percentage change
 * @example calculatePercentageChange(100, 150) => 50
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format percentage change with sign
 * @example formatPercentageChange(12.34) => "+12.34%"
 */
export function formatPercentageChange(change: number, decimals: number = 2): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}%`;
}

/**
 * Get trend direction from percentage change
 * @returns 'up' | 'down' | 'neutral'
 */
export function getTrendDirection(change: number, threshold: number = 0.01): 'up' | 'down' | 'neutral' {
  if (change > threshold) return 'up';
  if (change < -threshold) return 'down';
  return 'neutral';
}

// ============================================
// DATA TRANSFORMATIONS
// ============================================

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: bigint | string): number {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  return Number(weiValue) / 1e18;
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether: number): bigint {
  return BigInt(Math.floor(ether * 1e18));
}

/**
 * Safe division (returns 0 if divisor is 0)
 */
export function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ============================================
// SORTING & FILTERING HELPERS
// ============================================

/**
 * Sort array by numeric property
 */
export function sortByNumeric<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = Number(a[key]);
    const bValue = Number(b[key]);
    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

/**
 * Filter array by search term
 */
export function filterBySearch<T>(array: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  const term = searchTerm.toLowerCase();
  return array.filter((item) => keys.some((key) => String(item[key]).toLowerCase().includes(term)));
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: unknown): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// COLOR HELPERS
// ============================================

/**
 * Get color class based on value (for gains/losses)
 */
export function getValueColorClass(value: number): string {
  if (value > 0) return 'text-green-600 dark:text-green-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
}

/**
 * Get background color class based on value
 */
export function getValueBgClass(value: number): string {
  if (value > 0) return 'bg-green-50 dark:bg-green-950';
  if (value < 0) return 'bg-red-50 dark:bg-red-950';
  return 'bg-gray-50 dark:bg-gray-950';
}

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

/**
 * Debounce function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================
// ARRAY HELPERS
// ============================================

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Get unique values from array
 */
export function getUniqueValues<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

// ============================================
// NETWORK & TOKEN HELPERS
// ============================================

/**
 * Get token ticker by address across all network configs
 */
export function getTokenTicker(address: string, chainId: number): string {
  // Import networksConfigs dynamically to avoid circular dependencies
  const { networksConfigs } = require('@/lib/constants/network.constant');
  const normalizedAddress = normalizeAddress(address);

  // Find the network config for this chainId
  for (const config of Object.values(networksConfigs)) {
    if ((config as any).chainId === chainId) {
      const token = (config as any).blueChipTokens.find(
        (t: any) => t.address === normalizedAddress
      );
      if (token) {
        return token.ticker;
      }
    }
  }

  // Return truncated address if not found
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get network name by chainId
 */
export function getNetworkName(chainId: number): string {
  // Import networksConfigs dynamically to avoid circular dependencies
  const { networksConfigs } = require('@/lib/constants/network.constant');

  for (const config of Object.values(networksConfigs)) {
    if ((config as any).chainId === chainId) {
      return (config as any).name;
    }
  }
  return `Chain ${chainId}`;
}

/**
 * Format pool name from currency addresses
 */
export function formatPoolName(currency0: string, currency1: string, chainId: number): string {
  const token0 = getTokenTicker(currency0, chainId);
  const token1 = getTokenTicker(currency1, chainId);
  return `${token0}/${token1}`;
}

/**
 * Format fee tier to percentage string
 */
export function formatFeeTier(fee: number): string {
  return `${(fee / 10000).toFixed(2)}%`;
}
