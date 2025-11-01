/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '-';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(dateString));
}

/**
 * Format a date with time
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date and time string
 */
export function formatDateTime(dateString) {
  if (!dateString) return '-';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

/**
 * Format a number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(number) {
  if (number === null || number === undefined) return '-';
  
  return new Intl.NumberFormat('en-US').format(number);
}
