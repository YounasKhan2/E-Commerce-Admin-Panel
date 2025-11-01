import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from './client';

// Re-export for convenience
export { DATABASE_ID, COLLECTIONS, Query };

/**
 * List documents with pagination and filters
 * @param {string} collectionId - Collection ID
 * @param {Array} queries - Array of Query objects for filtering
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - Appwrite documents list response
 */
export async function listDocuments(collectionId, queries = [], page = 1, pageSize = 25) {
  try {
    const offset = (page - 1) * pageSize;
    const allQueries = [
      Query.limit(pageSize),
      Query.offset(offset),
      ...queries
    ];
    
    return await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      allQueries
    );
  } catch (error) {
    console.error('Error listing documents:', error);
    throw error;
  }
}

/**
 * Get a single document by ID
 * @param {string} collectionId - Collection ID
 * @param {string} documentId - Document ID
 * @returns {Promise} - Appwrite document
 */
export async function getDocument(collectionId, documentId) {
  try {
    return await databases.getDocument(DATABASE_ID, collectionId, documentId);
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

/**
 * Create a new document
 * @param {string} collectionId - Collection ID
 * @param {Object} data - Document data
 * @param {string} documentId - Optional document ID (auto-generated if not provided)
 * @returns {Promise} - Created document
 */
export async function createDocument(collectionId, data, documentId = ID.unique()) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data
    );
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

/**
 * Update an existing document
 * @param {string} collectionId - Collection ID
 * @param {string} documentId - Document ID
 * @param {Object} data - Updated data (partial update supported)
 * @returns {Promise} - Updated document
 */
export async function updateDocument(collectionId, documentId, data) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data
    );
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

/**
 * Delete a document
 * @param {string} collectionId - Collection ID
 * @param {string} documentId - Document ID
 * @returns {Promise} - Deletion confirmation
 */
export async function deleteDocument(collectionId, documentId) {
  try {
    return await databases.deleteDocument(
      DATABASE_ID,
      collectionId,
      documentId
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Count documents matching queries
 * @param {string} collectionId - Collection ID
 * @param {Array} queries - Array of Query objects for filtering
 * @returns {Promise<number>} - Total count
 */
export async function countDocuments(collectionId, queries = []) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      [Query.limit(1), ...queries]
    );
    return response.total;
  } catch (error) {
    console.error('Error counting documents:', error);
    throw error;
  }
}
