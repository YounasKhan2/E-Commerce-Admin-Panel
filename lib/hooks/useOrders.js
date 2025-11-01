import useSWR from 'swr';
import { listDocuments, getDocument, COLLECTIONS, Query } from '../appwrite/database';

/**
 * Custom hook for fetching orders with SWR caching
 * @param {Object} options - Hook options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.search - Search term for order number/customer email
 * @param {string} options.status - Filter by order status
 * @param {string} options.paymentStatus - Filter by payment status
 * @param {string} options.startDate - Filter by start date (ISO string)
 * @param {string} options.endDate - Filter by end date (ISO string)
 * @param {string} options.customerId - Filter by customer ID
 * @returns {Object} - SWR response with orders data
 */
export function useOrders(options = {}) {
  const {
    page = 1,
    pageSize = 25,
    search = '',
    status = '',
    paymentStatus = '',
    startDate = '',
    endDate = '',
    customerId = ''
  } = options;

  // Build query key for SWR caching
  const key = ['orders', page, pageSize, search, status, paymentStatus, startDate, endDate, customerId];

  const fetcher = async () => {
    const queries = [];

    // Add search filter
    if (search) {
      queries.push(Query.or([
        Query.search('orderNumber', search),
        Query.search('customerEmail', search)
      ]));
    }

    // Add status filter
    if (status) {
      queries.push(Query.equal('status', status));
    }

    // Add payment status filter
    if (paymentStatus) {
      queries.push(Query.equal('paymentStatus', paymentStatus));
    }

    // Add date range filters
    if (startDate) {
      queries.push(Query.greaterThanEqual('$createdAt', startDate));
    }
    if (endDate) {
      queries.push(Query.lessThanEqual('$createdAt', endDate));
    }

    // Add customer filter
    if (customerId) {
      queries.push(Query.equal('customerId', customerId));
    }

    // Add ordering (most recent first)
    queries.push(Query.orderDesc('$createdAt'));

    const response = await listDocuments(COLLECTIONS.ORDERS, queries, page, pageSize);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000
  });

  return {
    orders: data?.documents || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    error,
    mutate,
    hasMore: data ? (page * pageSize) < data.total : false
  };
}

/**
 * Custom hook for fetching a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Object} - SWR response with order data
 */
export function useOrder(orderId) {
  const key = orderId ? ['order', orderId] : null;

  const fetcher = async () => {
    if (!orderId) return null;
    return await getDocument(COLLECTIONS.ORDERS, orderId);
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    order: data,
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching order items for a specific order
 * @param {string} orderId - Order ID
 * @returns {Object} - SWR response with order items data
 */
export function useOrderItems(orderId) {
  const key = orderId ? ['order-items', orderId] : null;

  const fetcher = async () => {
    if (!orderId) return [];
    const response = await listDocuments(
      COLLECTIONS.ORDER_ITEMS,
      [Query.equal('orderId', orderId)],
      1,
      100
    );
    return response.documents;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    items: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching recent orders
 * @param {number} limit - Number of recent orders to fetch
 * @returns {Object} - SWR response with recent orders
 */
export function useRecentOrders(limit = 10) {
  const key = ['orders', 'recent', limit];

  const fetcher = async () => {
    const response = await listDocuments(
      COLLECTIONS.ORDERS,
      [Query.orderDesc('$createdAt'), Query.limit(limit)],
      1,
      limit
    );
    return response.documents;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  return {
    orders: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}
