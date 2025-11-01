import useSWR from 'swr';
import { listDocuments, getDocument, COLLECTIONS, Query } from '../appwrite/database';

/**
 * Custom hook for fetching customers with SWR caching
 * @param {Object} options - Hook options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.search - Search term for name/email
 * @param {string} options.segment - Filter by customer segment
 * @returns {Object} - SWR response with customers data
 */
export function useCustomers(options = {}) {
  const {
    page = 1,
    pageSize = 25,
    search = '',
    segment = ''
  } = options;

  // Build query key for SWR caching
  const key = ['customers', page, pageSize, search, segment];

  const fetcher = async () => {
    const queries = [];

    // Add search filter
    if (search) {
      queries.push(Query.or([
        Query.search('firstName', search),
        Query.search('lastName', search),
        Query.search('email', search)
      ]));
    }

    // Add segment filter
    if (segment) {
      queries.push(Query.equal('segment', segment));
    }

    // Add ordering (most recent first)
    queries.push(Query.orderDesc('$createdAt'));

    const response = await listDocuments(COLLECTIONS.CUSTOMERS, queries, page, pageSize);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000
  });

  return {
    customers: data?.documents || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    error,
    mutate,
    hasMore: data ? (page * pageSize) < data.total : false
  };
}

/**
 * Custom hook for fetching a single customer by ID
 * @param {string} customerId - Customer ID
 * @returns {Object} - SWR response with customer data
 */
export function useCustomer(customerId) {
  const key = customerId ? ['customer', customerId] : null;

  const fetcher = async () => {
    if (!customerId) return null;
    return await getDocument(COLLECTIONS.CUSTOMERS, customerId);
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    customer: data,
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching customer orders
 * @param {string} customerId - Customer ID
 * @param {number} limit - Maximum number of orders to fetch
 * @returns {Object} - SWR response with customer orders
 */
export function useCustomerOrders(customerId, limit = 50) {
  const key = customerId ? ['customer-orders', customerId, limit] : null;

  const fetcher = async () => {
    if (!customerId) return [];
    const response = await listDocuments(
      COLLECTIONS.ORDERS,
      [
        Query.equal('customerId', customerId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ],
      1,
      limit
    );
    return response.documents;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    orders: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching customer segments
 * @returns {Object} - SWR response with segments data
 */
export function useCustomerSegments() {
  const key = ['customer-segments'];

  const fetcher = async () => {
    const response = await listDocuments(
      COLLECTIONS.CUSTOMER_SEGMENTS,
      [Query.orderAsc('name')],
      1,
      100
    );
    return response.documents;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    segments: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching customers in a specific segment
 * @param {string} segmentId - Segment ID or name
 * @param {number} page - Page number
 * @param {number} pageSize - Number of items per page
 * @returns {Object} - SWR response with customers in segment
 */
export function useCustomersBySegment(segmentId, page = 1, pageSize = 25) {
  const key = segmentId ? ['customers-by-segment', segmentId, page, pageSize] : null;

  const fetcher = async () => {
    if (!segmentId) return { documents: [], total: 0 };
    const response = await listDocuments(
      COLLECTIONS.CUSTOMERS,
      [
        Query.equal('segment', segmentId),
        Query.orderDesc('$createdAt')
      ],
      page,
      pageSize
    );
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    customers: data?.documents || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    error,
    mutate,
    hasMore: data ? (page * pageSize) < data.total : false
  };
}
