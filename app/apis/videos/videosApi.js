// api/videos/videosApi.js
import axiosInstance from '@utils/axios';
import config from '@config/config';

/**
 * Upload a video chunk
 * @param {File} chunk - The video chunk file
 * @param {string} fileName - The final filename
 * @param {number} chunkIndex - Current chunk index (starts at 0)
 * @param {number} totalChunks - Total number of chunks
 * @returns {Promise<Object>} - Response with file details
 */
export const uploadVideoChunk = async (chunk, fileName, chunkIndex, totalChunks) => {
  try {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('chunk', chunk);
    formData.append('isThumbnail', 'false');

    const { data } = await axiosInstance.post(config.endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload video chunk');
  }
};

/**
 * Upload a thumbnail for a video
 * @param {File} thumbnail - The thumbnail image file
 * @param {string} fileName - The filename for the thumbnail
 * @returns {Promise<Object>} - Response with thumbnail details
 */
export const uploadThumbnail = async (thumbnail, fileName) => {
  try {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('isThumbnail', 'true');
    formData.append('thumbnail', thumbnail);

    const { data } = await axiosInstance.post(config.endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload thumbnail');
  }
};

/**
 * Check upload progress for a file
 * @param {string} fileName - The filename to check progress for
 * @returns {Promise<Object>} - Response with uploaded chunks
 */
export const checkUploadProgress = async (fileName) => {
  try {
    const { data } = await axiosInstance.get(config.endpoints.uploadProgress, {
      params: { fileName },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check upload progress');
  }
};

/**
 * Save video metadata after upload
 * @param {Object} metadata - Video metadata
 * @param {string} metadata.title - Video title
 * @param {string} metadata.description - Video description
 * @param {string} metadata.category - Video category
 * @param {string} metadata.mediaFileId - ID of the uploaded video file
 * @param {string} metadata.thumbnailId - ID of the uploaded thumbnail
 * @returns {Promise<Object>} - Response with saved metadata
 */
export const saveVideoMetadata = async (metadata) => {
  try {
    const { data } = await axiosInstance.post(config.endpoints.metadata, metadata);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save video metadata');
  }
};

/**
 * Upload a complete reel (video + thumbnail)
 * @param {FormData} formData - Form data containing video and thumbnail
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise<Object>} - Response with upload details
 */
export const uploadReel = async (formData, onUploadProgress) => {
  try {
    const { data } = await axiosInstance.post(config.endpoints.reelsUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload reel');
  }
}; 