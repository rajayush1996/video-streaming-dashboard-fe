import axios from 'axios';
import { API_ENDPOINTS } from '@config/api';
import config from '@config/config';

/**
 * Upload video chunk
 * @param {File} chunk - The video chunk
 * @param {string} fileName - Name of the file
 * @param {number} chunkIndex - Current chunk index
 * @param {number} totalChunks - Total number of chunks
 * @returns {Promise<Object>} Response with upload status
 */
export const uploadVideoChunk = async (chunk, fileName, chunkIndex, totalChunks) => {
  try {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('chunk', chunk);
    formData.append('isThumbnail', 'false');

    const response = await axios.post(config.endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload video chunk');
  }
};

/**
 * Upload thumbnail image
 * @param {File} thumbnail - The thumbnail image
 * @param {string} fileName - Name for the thumbnail file
 * @returns {Promise<Object>} Response with thumbnail details
 */
export const uploadThumbnail = async (thumbnail, fileName) => {
  try {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('isThumbnail', 'true');
    formData.append('thumbnail', thumbnail);

    const response = await axios.post(config.endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload thumbnail');
  }
};

/**
 * Check upload progress for a file
 * @param {string} fileName - Filename to check
 * @returns {Promise<Object>} List of uploaded chunks
 */
export const checkUploadProgress = async (fileName) => {
  try {
    const response = await axios.get(config.endpoints.uploadProgress, {
      params: { fileName },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check upload progress');
  }
};

/**
 * Save video metadata after upload
 * @param {Object} metadata - Video metadata
 * @returns {Promise<Object>} Response with saved metadata
 */
export const saveVideoMetadata = async (metadata) => {
  try {
    const response = await axios.post(config.endpoints.metadata, metadata);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save video metadata');
  }
};

/**
 * Get all videos with pagination and filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search query
 * @param {string} options.category - Category filter
 * @returns {Promise<Object>} Videos list with pagination data
 */
export const fetchVideos = async ({ page = 1, limit = 12, search = '', category = '' }) => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;
    
    const response = await axios.post(config.endpoints.mediaMetadata, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch videos');
  }
};

/**
 * Get a single video by ID
 * @param {string} id - Video ID
 * @returns {Promise<Object>} Video details
 */
export const fetchVideoById = async (id) => {
  try {
    const response = await axios.get(`${config.endpoints.mediaMetadata}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch video');
  }
};

/**
 * Delete a video
 * @param {string} id - Video ID
 * @returns {Promise<Object>} Response with delete status
 */
export const deleteVideo = async (id) => {
  try {
    const response = await axios.delete(`${config.endpoints.mediaMetadata}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete video');
  }
};

/**
 * Update video metadata
 * @param {Object} data - Updated video data
 * @param {string} data.id - Video ID
 * @returns {Promise<Object>} Response with updated video
 */
export const updateVideo = async ({ id, ...data }) => {
  try {
    const response = await axios.put(`${config.endpoints.mediaMetadata}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update video');
  }
}; 