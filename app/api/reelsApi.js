import axiosInstance from '@utils/axios';
import config from '@config/config';

// Get all reels with pagination, search and category filtering
export const fetchReels = async (paramsPayload) => {
  try {
    const params = {
      page: paramsPayload?.page,       // ✅ flat keys
      limit: paramsPayload?.limit,
    };

    if (paramsPayload?.search) params.search = paramsPayload.search;
    if (paramsPayload?.category) params.category = paramsPayload.category;


    const response = await axiosInstance.get(config.endpoints.reels, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reels');
  }
};


// Get a single reel by ID
export const fetchReelById = async (id) => {
  try {
    const response = await axiosInstance.get(`${config.endpoints.reels}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reel');
  }
};

// Create a new reel with direct upload
export const createReel = async (formData, options = {}) => {
  try {
    const response = await axiosInstance.post(config.endpoints.reelsUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onUploadProgress,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create reel');
  }
};

// Update an existing reel
export const updateReel = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`${config.endpoints.reels}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update reel');
  }
};

// Delete a reel (soft delete)
export const deleteReel = async (id) => {
  try {
    const response = await axiosInstance.delete(`${config.endpoints.reels}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete reel');
  }
};

// Restore a deleted reel
export const restoreReel = async (id) => {
  try {
    const response = await axiosInstance.post(`${config.endpoints.reels}/${id}/restore`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to restore reel');
  }
};

// Track reel view (analytics)
export const trackReelView = async (id) => {
  try {
    const response = await axiosInstance.post(`${config.endpoints.reels}/${id}/view`);
    return response.data;
  } catch (error) {
    // Silent fail for view tracking
    console.error('Failed to track reel view:', error);
  }
}; 