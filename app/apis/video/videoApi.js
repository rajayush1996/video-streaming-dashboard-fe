import axiosInstance from '@utils/axios';
import config from '@config/config';

export const createVideo = async (data) => {
  const response = await axiosInstance.post(config.endpoints.videos, data);
  return response.data;
};

export const getVideos = async ({ page = 1, limit = 10, sortBy = 'createdAt:desc', categoryId, featured } = {}) => {
  const response = await axiosInstance.get(config.endpoints.videos, {
    params: { page, limit, sortBy, categoryId, featured }
  });
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await axiosInstance.get(`${config.endpoints.videos}/${id}`);
  return response.data;
};

export const updateVideo = async (id, data) => {
  const response = await axiosInstance.put(`${config.endpoints.videos}/${id}`, data);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await axiosInstance.delete(`${config.endpoints.videos}/${id}`);
  return response.data;
};

export const uploadVideo = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(config.endpoints.upload, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress?.(percentCompleted);
    },
  });
  return response.data;
}; 