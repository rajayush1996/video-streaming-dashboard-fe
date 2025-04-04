// api/blogs/blogsApi.js
import axiosInstance from '@/utils/axiosInstance';

export const fetchBlogs = async () => {
  try {
    const response = await axiosInstance.get('/blogs');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
  }
};
