// hooks/useBlogs.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as blogsApi from '@apis/blogs/blogsApi';
import axios from '@utils/axios';

export const useBlogs = (options = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/v1/blogs');
      setBlogs(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      const response = await axios.post('/api/v1/blogs', blogData);
      setBlogs([...blogs, response.data]);
      toast.success('Blog created successfully!');
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create blog');
      throw err;
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const response = await axios.put(`/api/v1/blogs/${id}`, blogData);
      setBlogs(blogs.map(blog => blog.id === id ? response.data : blog));
      toast.success('Blog updated successfully!');
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update blog');
      throw err;
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`/api/v1/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete blog');
      throw err;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    isLoading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    refetch: fetchBlogs,
  };
};

export const useBlog = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsApi.fetchBlogById(id),
    enabled: !!id
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogsApi.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create blog');
    }
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogsApi.updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update blog');
    }
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogsApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog');
    }
  });
};

export const useRestoreBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogsApi.restoreBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog restored successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore blog');
    }
  });
};
