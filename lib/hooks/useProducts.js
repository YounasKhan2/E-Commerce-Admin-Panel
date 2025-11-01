import useSWR from 'swr';
import { listDocuments, getDocument, COLLECTIONS, Query } from '../appwrite/database';

/**
 * Custom hook for fetching products with SWR caching
 * @param {Object} options - Hook options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.search - Search term for name/SKU
 * @param {string} options.categoryId - Filter by category ID
 * @param {boolean} options.lowStockOnly - Filter for low stock products
 * @returns {Object} - SWR response with products data
 */
export function useProducts(options = {}) {
  const {
    page = 1,
    pageSize = 25,
    search = '',
    categoryId = '',
    lowStockOnly = false
  } = options;

  // Build query key for SWR caching
  const key = ['products', page, pageSize, search, categoryId, lowStockOnly];

  const fetcher = async () => {
    const queries = [];

    // Add search filter
    if (search) {
      queries.push(Query.or([
        Query.search('name', search),
        Query.search('sku', search)
      ]));
    }

    // Add category filter
    if (categoryId) {
      queries.push(Query.equal('categoryId', categoryId));
    }

    // Add low stock filter
    if (lowStockOnly) {
      queries.push(Query.lessThan('inventory', Query.select(['lowStockThreshold'])));
    }

    // Add ordering
    queries.push(Query.orderDesc('$createdAt'));

    const response = await listDocuments(COLLECTIONS.PRODUCTS, queries, page, pageSize);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000
  });

  return {
    products: data?.documents || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    error,
    mutate,
    hasMore: data ? (page * pageSize) < data.total : false
  };
}

/**
 * Custom hook for fetching a single product by ID
 * @param {string} productId - Product ID
 * @returns {Object} - SWR response with product data
 */
export function useProduct(productId) {
  const key = productId ? ['product', productId] : null;

  const fetcher = async () => {
    if (!productId) return null;
    return await getDocument(COLLECTIONS.PRODUCTS, productId);
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false
  });

  return {
    product: data,
    isLoading,
    isError: error,
    error,
    mutate
  };
}

/**
 * Custom hook for fetching low stock products
 * @returns {Object} - SWR response with low stock products
 */
export function useLowStockProducts() {
  const key = ['products', 'low-stock'];

  const fetcher = async () => {
    // Fetch all products and filter client-side for low stock
    // Note: Appwrite doesn't support comparing two fields directly in queries
    const response = await listDocuments(
      COLLECTIONS.PRODUCTS,
      [Query.orderAsc('inventory'), Query.limit(100)],
      1,
      100
    );

    // Filter products where inventory < lowStockThreshold
    const lowStockProducts = response.documents.filter(
      product => product.inventory < (product.lowStockThreshold || 10)
    );

    return lowStockProducts;
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000 // Refresh every minute
  });

  return {
    products: data || [],
    isLoading,
    isError: error,
    error,
    mutate
  };
}
