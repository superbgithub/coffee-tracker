// ============================================
// UTILITY LAYER - Helper Functions
// ============================================

import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format ISO date string to readable format
 */
export const formatDateTime = (isoString: string): string => {
  return format(new Date(isoString), 'MMM dd, yyyy HH:mm');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (isoString: string): string => {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true });
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Get size emoji
 */
export const getSizeEmoji = (size: string): string => {
  const sizeMap: Record<string, string> = {
    'Small': '☕',
    'Medium': '🍵',
    'Large': '🥤'
  };
  return sizeMap[size] || '☕';
};

/**
 * Get caffeine level color
 */
export const getCaffeineColor = (caffeineMg: number): string => {
  if (caffeineMg < 50) return '#4ade80'; // green
  if (caffeineMg < 100) return '#facc15'; // yellow
  if (caffeineMg < 150) return '#fb923c'; // orange
  return '#ef4444'; // red
};
