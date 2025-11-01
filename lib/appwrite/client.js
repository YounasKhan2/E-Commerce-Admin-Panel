import { Client, Databases, Storage, Functions, Account, ID, Query } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Initialize Services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const account = new Account(client);

// Export Client for custom configurations
export { client, ID, Query };

// Database Configuration
export const DATABASE_ID = 'ecommerce_main';

// Collections
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  PRODUCT_VARIANTS: 'product_variants',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  CUSTOMERS: 'customers',
  ALERTS: 'alerts',
  SUPPORT_TICKETS: 'support_tickets',
  TICKET_MESSAGES: 'ticket_messages',
  CUSTOMER_SEGMENTS: 'customer_segments'
};

// Storage Buckets
export const BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  INVOICES: 'invoices',
  DOCUMENTS: 'documents'
};

// Serverless Functions
export const FUNCTIONS = {
  GENERATE_INVOICE: 'generateInvoice',
  PROCESS_ORDER: 'processOrder',
  CALCULATE_ANALYTICS: 'calculateAnalytics'
};
