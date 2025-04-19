// api/blogs/blogsApi.js
import axiosInstance from '@utils/axios';
import config from '@config/config';

export const fetchBlogs = async ({ skip = 0, limit = 10, searchQuery = '' }) => {
  try {
    let url = `${config.endpoints.blog}?skip=${skip}&limit=${limit}`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
  }
};

export const fetchBlogById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.blog}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blog');
  }
};

export const createBlog = async (blogData) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.blog}`, blogData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create blog');
  }
};

export const updateBlog = async ({ id, ...blogData }) => {
  try {
    const { data } = await axiosInstance.put(`${config.endpoints.blog}/${id}`, blogData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update blog');
  }
};

export const deleteBlog = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`${config.endpoints.blog}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete blog');
  }
};

export const restoreBlog = async (id) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.blog}/${id}/restore`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to restore blog');
  }
};
