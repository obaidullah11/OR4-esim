import { clsx } from 'clsx'

/**
 * Utility function to merge class names
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return clsx(inputs)
}
