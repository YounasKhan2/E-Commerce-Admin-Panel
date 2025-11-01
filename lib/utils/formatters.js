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
 * @param {number} decimals - Number of decimal places (optional)
 * @returns {string} - Formatted number string
 */
export function formatNumber(number, decimals) {
  if (number === null || number === undefined) return '-';
  
  const options = decimals !== undefined ? {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  } : {};
  
  return new Intl.NumberFormat('en-US', options).format(number);
}

/**
 * Format a percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '-';
  
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format a relative date (e.g., "2 days ago", "in 3 hours")
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative date string
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
}

/**
 * Format a phone number
 * @param {string} phone - Phone number string
 * @returns {string} - Formatted phone number
 */
export function formatPhone(phone) {
  if (!phone) return '-';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for 10-digit US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for 11-digit numbers
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if format doesn't match
  return phone;
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
}
