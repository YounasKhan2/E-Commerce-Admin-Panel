/**
 * CSV Export Utilities
 * Functions for generating and downloading CSV files
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column definitions {key, label}
 * @returns {string} CSV string
 */
export function convertToCSV(data, columns) {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headers = columns.map(col => col.label || col.key);
  const headerRow = headers.map(escapeCSVValue).join(',');

  // Create data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      const value = getNestedValue(row, col.key);
      const formattedValue = col.format ? col.format(value, row) : value;
      return escapeCSVValue(formattedValue);
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Get nested object value by dot notation key
 * @param {Object} obj - Object to get value from
 * @param {string} key - Dot notation key (e.g., 'customer.email')
 * @returns {*} Value at key path
 */
function getNestedValue(obj, key) {
  return key.split('.').reduce((value, k) => {
    return value && value[k] !== undefined ? value[k] : '';
  }, obj);
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 * @param {*} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Trigger browser download of CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Filename for download
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    // Create download link
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  }
}

/**
 * Export orders to CSV
 * @param {Array} orders - Array of order objects
 * @param {string} filename - Optional filename
 */
export function exportOrdersToCSV(orders, filename) {
  const columns = [
    { key: 'orderNumber', label: 'Order Number' },
    { key: '$createdAt', label: 'Order Date', format: (val) => new Date(val).toLocaleString() },
    { key: 'customer.firstName', label: 'Customer First Name' },
    { key: 'customer.lastName', label: 'Customer Last Name' },
    { key: 'customer.email', label: 'Customer Email' },
    { key: 'customer.phone', label: 'Customer Phone' },
    { key: 'status', label: 'Order Status' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'fulfillmentStatus', label: 'Fulfillment Status' },
    { key: 'subtotalAmount', label: 'Subtotal', format: (val) => val?.toFixed(2) || '0.00' },
    { key: 'taxAmount', label: 'Tax', format: (val) => val?.toFixed(2) || '0.00' },
    { key: 'shippingAmount', label: 'Shipping', format: (val) => val?.toFixed(2) || '0.00' },
    { key: 'discountAmount', label: 'Discount', format: (val) => val?.toFixed(2) || '0.00' },
    { key: 'totalAmount', label: 'Total Amount', format: (val) => val?.toFixed(2) || '0.00' },
    { key: 'shippingAddress', label: 'Shipping Address', format: formatAddress },
    { key: 'billingAddress', label: 'Billing Address', format: formatAddress },
    { key: 'trackingNumber', label: 'Tracking Number' },
    { key: 'shippingCarrier', label: 'Shipping Carrier' },
    { key: 'notes', label: 'Notes' },
  ];

  const csvContent = convertToCSV(orders, columns);
  const defaultFilename = filename || `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, defaultFilename);
}

/**
 * Format address object for CSV
 * @param {Object|string} address - Address object or JSON string
 * @returns {string} Formatted address string
 */
function formatAddress(address) {
  if (!address) return '';
  
  try {
    const addr = typeof address === 'string' ? JSON.parse(address) : address;
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.postalCode,
      addr.country
    ].filter(Boolean);
    
    return parts.join(', ');
  } catch (error) {
    return String(address);
  }
}
