// api/blogs/blogsApi.js
import axiosInstance from '@utils/axios';
import config from '@config/config';

export const fetchBlogs = async ({ page = 1, limit = 10, searchQuery = '', category = '' }) => {
  try {
    let url = `${config.endpoints.blog}?page=${page}&limit=${limit}`;
    
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
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
  console.log('createBlog API called with:', typeof blogData);

  // Convert plain object to FormData here
  const formData = new FormData();
  Object.keys(blogData).forEach((key) => {
    if (blogData[key] !== null) {
      formData.append(key, blogData[key]);
    }
  });

  try {
    console.log('Sending POST request to:', `${config.endpoints.blog}`);
    const { data } = await axiosInstance.post(`${config.endpoints.blog}`, formData);
    console.log('Blog creation API response:', data);
    return data;
  } catch (error) {
    console.error('Blog creation API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create blog');
  }
};


export const updateBlog = async ({ id, ...blogData }) => {
  // console.log("🚀 ~ updateBlog ~ blogData:", typeof blogData);
  // for (let [key, value] of blogData.entries()) {
  //           console.log(`${key}:`, value);
  // }
  blogData.status = 'draft';
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

export const publishBlog = async (id) => {
  try {
    const { data } = await axiosInstance.patch(`${config.endpoints.blog}/${id}/publish`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to publish blog');
  }
};
