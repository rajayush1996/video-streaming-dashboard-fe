import axiosInstance from '@utils/axios';
import config from '@config/config';

export const createCategory = async (data) => {
  const response = await axiosInstance.post(config.endpoints.categories, data);
  return response.data;
};

export const getCategories = async ({ page = 1, limit = 10, sortBy = 'createdAt:desc' } = {}) => {
  const response = await axiosInstance.get(config.endpoints.categories, {
    params: { page, limit, sortBy }
  });
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axiosInstance.get(`${config.endpoints.categories}/${id}`);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axiosInstance.put(`${config.endpoints.categories}/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`${config.endpoints.categories}/${id}`);
  return response.data;
};

export const getCategoriesByType = async (type) => {
  const response = await axiosInstance.get(`${config.endpoints.categoryType}/${type}`);
  return response.data;
}; 