import useSWR from 'swr';
import { listDocuments, COLLECTIONS, Query } from '../appwrite/database';

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage change
 */
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Custom hook for fetching analytics metrics with date range
 * @param {Object} options - Hook options
 * @param {string} options.startDate - Start date (ISO string)
 * @param {string} options.endDate - End date (ISO string)
 * @param {boolean} options.includePrevious - Include previous period for comparison
 * @returns {Object} - SWR response with analytics data
 */
export function useAnalytics(options = {}) {
  const {
    startDate,
    endDate,
    includePrevious = true
  } = options;

  // Build query key for SWR caching
  const key = ['analytics', startDate, endDate, includePrevious];

  const fetcher = async () => {
    if (!startDate || !endDate) {
      return null;
    }

    // Fetch orders for current period
    const currentQueries = [
      Query.greaterThanEqual('$createdAt', startDate),
      Query.lessThanEqual('$createdAt', endDate),
      Query.limit(1000) // Fetch up to 1000 orders
    ];

    const currentOrders = await listDocuments(COLLECTIONS.ORDERS, currentQueries, 1, 1000);

    // Calculate current period metrics
    const currentMetrics = calculateMetrics(currentOrders.documents);

    let previousMetrics = null;
    let changes = null;

    // Fetch previous period if requested
    if (includePrevious) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = end - start;

      const previousStart = new Date(start.getTime() - duration);
      const previousEnd = new Date(start.getTime());

      const previousQueries = [
        Query.greaterThanEqual('$createdAt', previousStart.toISOString()),
        Query.lessThanEqual('$createdAt', previousEnd.toISOString()),
        Query.limit(1000)
      ];

      const previousOrders = await listDocuments(COLLECTIONS.ORDERS, previousQueries, 1, 1000);
      previousMetrics = calculateMetrics(previousOrders.documents);

      // Calculate changes
      changes = {
        revenue: calculatePercentageChange(currentMetrics.revenue, previousMetrics.revenue),
        orderCount: calculatePercentageChange(currentMetrics.orderCount, previousMetrics.orderCount),
        averageOrderValue: calculatePercentageChange(currentMetrics.averageOrderValue, previousMetrics.averageOrderValue)
      };
    }

    return {
      current: currentMetrics,
      previous: previousMetrics,
      changes
    };
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000
  });

  return {
    analytics: data,
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Calculate metrics from orders
 * @param {Array} orders - Array of order documents
 * @returns {Object} - Calculated metrics
 */
function calculateMetrics(orders) {
  const paidOrders = orders.filter(order => order.paymentStatus === 'paid');
  
  const revenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const orderCount = orders.length;
  const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

  // Calculate status distribution
  const statusDistribution = orders.reduce((acc, order) => {
    const status = order.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Calculate payment status distribution
  const paymentStatusDistribution = orders.reduce((acc, order) => {
    const status = order.paymentStatus || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return {
    revenue,
    orderCount,
    averageOrderValue,
    statusDistribution,
    paymentStatusDistribution
  };
}

/**
 * Custom hook for fetching revenue trend data
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @param {string} groupBy - Group by 'day' or 'month'
 * @returns {Object} - SWR response with revenue trend data
 */
export function useRevenueTrend(startDate, endDate, groupBy = 'day') {
  const key = ['revenue-trend', startDate, endDate, groupBy];

  const fetcher = async () => {
    if (!startDate || !endDate) return [];

    const queries = [
      Query.greaterThanEqual('$createdAt', startDate),
      Query.lessThanEqual('$createdAt', endDate),
      Query.equal('paymentStatus', 'paid'),
      Query.limit(1000)
    ];

    const response = await listDocuments(COLLECTIONS.ORDERS, queries, 1, 1000);

    // Group orders by date
    const grouped = response.documents.reduce((acc, order) => {
      const date = new Date(order.$createdAt);
      let key;

      if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.toISOString().split('T')[0];
      }

      if (!acc[key]) {
        acc[key] = { date: key, revenue: 0, orders: 0 };
      }

      acc[key].revenue += order.totalAmount || 0;
      acc[key].orders += 1;

      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    trend: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching product performance data
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @param {string} categoryId - Optional category filter
 * @returns {Object} - SWR response with product performance data
 */
export function useProductPerformance(startDate, endDate, categoryId = '') {
  const key = ['product-performance', startDate, endDate, categoryId];

  const fetcher = async () => {
    if (!startDate || !endDate) return [];

    // Fetch order items for the date range
    const queries = [
      Query.greaterThanEqual('$createdAt', startDate),
      Query.lessThanEqual('$createdAt', endDate),
      Query.limit(1000)
    ];

    const response = await listDocuments(COLLECTIONS.ORDER_ITEMS, queries, 1, 1000);

    // Group by product and calculate metrics
    const productMetrics = response.documents.reduce((acc, item) => {
      const productId = item.productId;

      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName: item.productName || 'Unknown',
          unitsSold: 0,
          revenue: 0
        };
      }

      acc[productId].unitsSold += item.quantity || 0;
      acc[productId].revenue += (item.price || 0) * (item.quantity || 0);

      return acc;
    }, {});

    // Convert to array and sort by revenue
    return Object.values(productMetrics).sort((a, b) => b.revenue - a.revenue);
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    products: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching sales by category
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @returns {Object} - SWR response with category sales data
 */
export function useSalesByCategory(startDate, endDate) {
  const key = ['sales-by-category', startDate, endDate];

  const fetcher = async () => {
    if (!startDate || !endDate) return [];

    // Fetch order items for the date range
    const queries = [
      Query.greaterThanEqual('$createdAt', startDate),
      Query.lessThanEqual('$createdAt', endDate),
      Query.limit(1000)
    ];

    const response = await listDocuments(COLLECTIONS.ORDER_ITEMS, queries, 1, 1000);

    // Group by category
    const categoryMetrics = response.documents.reduce((acc, item) => {
      const category = item.categoryName || 'Uncategorized';

      if (!acc[category]) {
        acc[category] = {
          category,
          revenue: 0,
          units: 0
        };
      }

      acc[category].revenue += (item.price || 0) * (item.quantity || 0);
      acc[category].units += item.quantity || 0;

      return acc;
    }, {});

    // Convert to array and sort by revenue
    return Object.values(categoryMetrics).sort((a, b) => b.revenue - a.revenue);
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    categories: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}
