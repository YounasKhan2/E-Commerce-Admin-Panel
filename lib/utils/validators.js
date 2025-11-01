/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Valid if 10 or 11 digits (US format)
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {boolean} - True if valid SKU format
 */
export function isValidSKU(sku) {
  if (!sku) return false;
  
  // SKU should be alphanumeric with optional hyphens and underscores
  // Length between 3 and 50 characters
  const skuRegex = /^[A-Za-z0-9_-]{3,50}$/;
  return skuRegex.test(sku);
}

/**
 * Validate price format
 * @param {number|string} price - Price to validate
 * @returns {boolean} - True if valid price
 */
export function isValidPrice(price) {
  if (price === null || price === undefined || price === '') return false;
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Price must be a positive number
  return !isNaN(numPrice) && numPrice >= 0;
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
export function isValidURL(url) {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} - True if value is not empty
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if meets minimum length
 */
export function hasMinLength(value, minLength) {
  if (!value) return false;
  return value.length >= minLength;
}

/**
 * Validate maximum length
 * @param {string} value - String to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} - True if within maximum length
 */
export function hasMaxLength(value, maxLength) {
  if (!value) return true;
  return value.length <= maxLength;
}

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} - True if within range
 */
export function isInRange(value, min, max) {
  if (value === null || value === undefined) return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

/**
 * Validate positive integer
 * @param {number|string} value - Value to validate
 * @returns {boolean} - True if positive integer
 */
export function isPositiveInteger(value) {
  if (value === null || value === undefined || value === '') return false;
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num) && num > 0;
}

/**
 * Validate non-negative integer (including zero)
 * @param {number|string} value - Value to validate
 * @returns {boolean} - True if non-negative integer
 */
export function isNonNegativeInteger(value) {
  if (value === null || value === undefined || value === '') return false;
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num) && num >= 0;
}

/**
 * Validate date format (ISO 8601)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid date
 */
export function isValidDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate barcode format
 * @param {string} barcode - Barcode to validate
 * @returns {boolean} - True if valid barcode format
 */
export function isValidBarcode(barcode) {
  if (!barcode) return false;
  
  // Barcode should be numeric, typically 8, 12, or 13 digits (EAN-8, UPC-A, EAN-13)
  const barcodeRegex = /^\d{8}$|^\d{12}$|^\d{13}$/;
  return barcodeRegex.test(barcode);
}

/**
 * Get validation error message
 * @param {string} field - Field name
 * @param {string} rule - Validation rule that failed
 * @param {any} params - Additional parameters for the error message
 * @returns {string} - Error message
 */
export function getValidationError(field, rule, params = {}) {
  const messages = {
    required: `${field} is required`,
    email: `${field} must be a valid email address`,
    phone: `${field} must be a valid phone number`,
    sku: `${field} must be 3-50 alphanumeric characters`,
    price: `${field} must be a valid positive number`,
    url: `${field} must be a valid URL`,
    minLength: `${field} must be at least ${params.min} characters`,
    maxLength: `${field} must be no more than ${params.max} characters`,
    range: `${field} must be between ${params.min} and ${params.max}`,
    positiveInteger: `${field} must be a positive integer`,
    nonNegativeInteger: `${field} must be a non-negative integer`,
    date: `${field} must be a valid date`,
    barcode: `${field} must be a valid barcode (8, 12, or 13 digits)`,
  };
  
  return messages[rule] || `${field} is invalid`;
}
