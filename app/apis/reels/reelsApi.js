// api/reels/reelsApi.js
import axiosInstance from '@utils/axios';
import config from '@config/config';

// Fetch reels with pagination, search and filters
export const fetchReels = async ({ page = 1, limit = 10, search = '', category = '' }) => {
  try {
    let url = `${config.endpoints.reels}?page=${page}&limit=${limit}`;
    
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reels');
  }
};

// Fetch a single reel by ID
export const fetchReelById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.reels}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reel');
  }
};

// Upload a new reel
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

// Update reel metadata
export const updateReel = async ({ id, ...reelData }) => {
  try {
    const { data } = await axiosInstance.put(`${config.endpoints.reels}/${id}`, reelData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update reel');
  }
};

// Delete a reel
export const deleteReel = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`${config.endpoints.reels}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete reel');
  }
};

// Like a reel
export const likeReel = async (id) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.reels}/${id}/like`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like reel');
  }
};

// Unlike a reel
export const unlikeReel = async (id) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.reels}/${id}/unlike`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unlike reel');
  }
};

// Comment on a reel
export const commentOnReel = async ({ id, comment }) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.reels}/${id}/comment`, { comment });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to comment on reel');
  }
}; 