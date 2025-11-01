/**
 * Application-wide constants
 */

// Order Statuses
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'info' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'danger' },
  { value: 'refunded', label: 'Refunded', color: 'neutral' },
];

// Payment Statuses
export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'danger' },
  { value: 'refunded', label: 'Refunded', color: 'neutral' },
];

// Fulfillment Statuses
export const FULFILLMENT_STATUSES = [
  { value: 'unfulfilled', label: 'Unfulfilled', color: 'warning' },
  { value: 'partial', label: 'Partial', color: 'info' },
  { value: 'fulfilled', label: 'Fulfilled', color: 'success' },
];

// Support Ticket Priorities
export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'neutral' },
  { value: 'medium', label: 'Medium', color: 'info' },
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'urgent', label: 'Urgent', color: 'danger' },
];

// Support Ticket Statuses
export const TICKET_STATUSES = [
  { value: 'open', label: 'Open', color: 'warning' },
  { value: 'in_progress', label: 'In Progress', color: 'info' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'neutral' },
];

// Alert Severities
export const ALERT_SEVERITIES = [
  { value: 'low', label: 'Low', color: 'info' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'danger' },
  { value: 'critical', label: 'Critical', color: 'danger' },
];

// Alert Types
export const ALERT_TYPES = [
  { value: 'inventory', label: 'Inventory' },
  { value: 'order', label: 'Order' },
  { value: 'system', label: 'System' },
  { value: 'customer', label: 'Customer' },
];

// Customer Segments
export const CUSTOMER_SEGMENTS = [
  { value: 'vip', label: 'VIP' },
  { value: 'regular', label: 'Regular' },
  { value: 'new', label: 'New' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'inactive', label: 'Inactive' },
];

// Date Range Presets
export const DATE_RANGE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Product
export const DEFAULT_LOW_STOCK_THRESHOLD = 10;
export const PRODUCT_VARIANT_TYPES = [
  { value: 'size', label: 'Size' },
  { value: 'color', label: 'Color' },
  { value: 'material', label: 'Material' },
  { value: 'style', label: 'Style' },
];

// Shipping Carriers
export const SHIPPING_CARRIERS = [
  { value: 'usps', label: 'USPS' },
  { value: 'ups', label: 'UPS' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'dhl', label: 'DHL' },
  { value: 'other', label: 'Other' },
];

// Currency
export const DEFAULT_CURRENCY = 'USD';
export const SUPPORTED_CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
];

/**
 * Get status label by value
 * @param {Array} statuses - Array of status objects
 * @param {string} value - Status value
 * @returns {string} - Status label
 */
export function getStatusLabel(statuses, value) {
  const status = statuses.find(s => s.value === value);
  return status ? status.label : value;
}

/**
 * Get status color by value
 * @param {Array} statuses - Array of status objects
 * @param {string} value - Status value
 * @returns {string} - Status color
 */
export function getStatusColor(statuses, value) {
  const status = statuses.find(s => s.value === value);
  return status ? status.color : 'neutral';
}
