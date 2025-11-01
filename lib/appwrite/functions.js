import { functions } from './client';

/**
 * Execute a serverless function
 * @param {string} functionId - Function ID
 * @param {string} body - Request body (JSON string or plain text)
 * @param {boolean} async - Execute asynchronously (default: false)
 * @param {string} path - Function path (default: '/')
 * @param {string} method - HTTP method (default: 'POST')
 * @param {Object} headers - Custom headers
 * @returns {Promise} - Function execution response
 */
export async function executeFunction(
  functionId,
  body = '',
  async = false,
  path = '/',
  method = 'POST',
  headers = {}
) {
  try {
    return await functions.createExecution(
      functionId,
      body,
      async,
      path,
      method,
      headers
    );
  } catch (error) {
    console.error('Error executing function:', error);
    throw error;
  }
}

/**
 * Generate invoice for an order
 * @param {Object} orderData - Order data including items, customer, amounts
 * @returns {Promise} - Invoice generation response with file URL
 */
export async function generateInvoice(orderData) {
  try {
    const body = JSON.stringify(orderData);
    return await executeFunction('generateInvoice', body);
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}

/**
 * Process order (send notifications, update inventory, etc.)
 * @param {Object} orderData - Order data
 * @returns {Promise} - Order processing response
 */
export async function processOrder(orderData) {
  try {
    const body = JSON.stringify(orderData);
    return await executeFunction('processOrder', body);
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

/**
 * Calculate analytics for a date range
 * @param {Object} params - Analytics parameters (startDate, endDate, metrics)
 * @returns {Promise} - Analytics calculation response
 */
export async function calculateAnalytics(params) {
  try {
    const body = JSON.stringify(params);
    return await executeFunction('calculateAnalytics', body);
  } catch (error) {
    console.error('Error calculating analytics:', error);
    throw error;
  }
}

/**
 * Get function execution details
 * @param {string} functionId - Function ID
 * @param {string} executionId - Execution ID
 * @returns {Promise} - Execution details
 */
export async function getExecution(functionId, executionId) {
  try {
    return await functions.getExecution(functionId, executionId);
  } catch (error) {
    console.error('Error getting execution details:', error);
    throw error;
  }
}

/**
 * List function executions
 * @param {string} functionId - Function ID
 * @param {Array} queries - Query filters
 * @returns {Promise} - List of executions
 */
export async function listExecutions(functionId, queries = []) {
  try {
    return await functions.listExecutions(functionId, queries);
  } catch (error) {
    console.error('Error listing executions:', error);
    throw error;
  }
}
