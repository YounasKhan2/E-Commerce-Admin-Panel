import { storage, BUCKETS, ID } from './client';

// Re-export for convenience
export { BUCKETS };

/**
 * Upload a file to storage
 * @param {string} bucketId - Storage bucket ID
 * @param {File} file - File object to upload
 * @param {string} fileId - Optional file ID (auto-generated if not provided)
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise} - Uploaded file object
 */
export async function uploadFile(bucketId, file, fileId = ID.unique(), onProgress = null) {
  try {
    return await storage.createFile(
      bucketId,
      fileId,
      file,
      undefined, // permissions (use bucket defaults)
      onProgress
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Get file preview URL (for images)
 * @param {string} bucketId - Storage bucket ID
 * @param {string} fileId - File ID
 * @param {number} width - Preview width (default: 400)
 * @param {number} height - Preview height (default: 400)
 * @param {string} gravity - Crop gravity (default: 'center')
 * @param {number} quality - Image quality 0-100 (default: 100)
 * @returns {string} - Preview URL
 */
export function getFilePreview(
  bucketId,
  fileId,
  width = 400,
  height = 400,
  gravity = 'center',
  quality = 100
) {
  try {
    return storage.getFilePreview(
      bucketId,
      fileId,
      width,
      height,
      gravity,
      quality
    );
  } catch (error) {
    console.error('Error getting file preview:', error);
    throw error;
  }
}

/**
 * Get file download URL
 * @param {string} bucketId - Storage bucket ID
 * @param {string} fileId - File ID
 * @returns {string} - Download URL
 */
export function getFileDownload(bucketId, fileId) {
  try {
    return storage.getFileDownload(bucketId, fileId);
  } catch (error) {
    console.error('Error getting file download URL:', error);
    throw error;
  }
}

/**
 * Get file view URL (inline display)
 * @param {string} bucketId - Storage bucket ID
 * @param {string} fileId - File ID
 * @returns {string} - View URL
 */
export function getFileView(bucketId, fileId) {
  try {
    return storage.getFileView(bucketId, fileId);
  } catch (error) {
    console.error('Error getting file view URL:', error);
    throw error;
  }
}

/**
 * Delete a file from storage
 * @param {string} bucketId - Storage bucket ID
 * @param {string} fileId - File ID
 * @returns {Promise} - Deletion confirmation
 */
export async function deleteFile(bucketId, fileId) {
  try {
    return await storage.deleteFile(bucketId, fileId);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get file metadata
 * @param {string} bucketId - Storage bucket ID
 * @param {string} fileId - File ID
 * @returns {Promise} - File object with metadata
 */
export async function getFile(bucketId, fileId) {
  try {
    return await storage.getFile(bucketId, fileId);
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
}

/**
 * List files in a bucket
 * @param {string} bucketId - Storage bucket ID
 * @param {Array} queries - Array of Query objects for filtering
 * @returns {Promise} - List of files
 */
export async function listFiles(bucketId, queries = []) {
  try {
    return await storage.listFiles(bucketId, queries);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
