import { createDocument } from '../appwrite/database';
import { COLLECTIONS } from '../appwrite/client';

/**
 * Check if product inventory is below low stock threshold
 * @param {Object} product - Product object with inventory and lowStockThreshold
 * @returns {boolean} - True if inventory is low
 */
export function isLowStock(product) {
  if (!product || typeof product.inventory !== 'number') {
    return false;
  }
  
  const threshold = product.lowStockThreshold || 10; // Default threshold of 10
  return product.inventory < threshold;
}

/**
 * Calculate alert severity based on remaining stock percentage
 * @param {number} inventory - Current inventory count
 * @param {number} threshold - Low stock threshold
 * @returns {string} - Severity level: 'critical', 'high', 'medium', 'low'
 */
export function calculateAlertSeverity(inventory, threshold) {
  if (inventory <= 0) {
    return 'critical'; // Out of stock
  }
  
  const percentage = (inventory / threshold) * 100;
  
  if (percentage <= 25) {
    return 'critical'; // 25% or less of threshold
  } else if (percentage <= 50) {
    return 'high'; // 26-50% of threshold
  } else if (percentage <= 75) {
    return 'medium'; // 51-75% of threshold
  } else {
    return 'low'; // 76-99% of threshold
  }
}

/**
 * Create an inventory alert for a product
 * @param {Object} product - Product object
 * @returns {Promise<Object>} - Created alert document
 */
export async function createInventoryAlert(product) {
  if (!product || !product.$id) {
    throw new Error('Invalid product object');
  }
  
  const threshold = product.lowStockThreshold || 10;
  const severity = calculateAlertSeverity(product.inventory, threshold);
  
  const alertData = {
    type: 'inventory',
    severity: severity,
    productId: product.$id,
    productName: product.name,
    currentInventory: product.inventory,
    threshold: threshold,
    message: `Low stock alert: ${product.name} has ${product.inventory} units remaining (threshold: ${threshold})`,
    isRead: false
  };
  
  try {
    const alert = await createDocument(COLLECTIONS.ALERTS, alertData);
    return alert;
  } catch (error) {
    console.error('Error creating inventory alert:', error);
    throw error;
  }
}

/**
 * Check product inventory and create alert if needed
 * @param {Object} product - Product object
 * @returns {Promise<Object|null>} - Created alert or null if no alert needed
 */
export async function checkAndCreateInventoryAlert(product) {
  if (!isLowStock(product)) {
    return null;
  }
  
  try {
    const alert = await createInventoryAlert(product);
    return alert;
  } catch (error) {
    console.error('Error checking and creating inventory alert:', error);
    throw error;
  }
}
