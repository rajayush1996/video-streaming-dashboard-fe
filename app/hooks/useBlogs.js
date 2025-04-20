// hooks/useBlogs.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as blogsApi from '@apis/blogs/blogsApi';

export const useBlogs = ({ page = 1, limit = 10, searchQuery = '', category = '' }) => {
  return useQuery({
    queryKey: ['blogs', { page, limit, searchQuery, category }],
    queryFn: () =>
      blogsApi.fetchBlogs({ page, limit, searchQuery, category }),
    keepPreviousData: true,
    retry: false,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch blogs');
    }
  });
};

// 🔍 Single blog by ID
export const useBlog = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsApi.fetchBlogById(id),
    enabled: !!id,
    retry: false,
    onError: (err) => {
      toast.error(err.message || 'Failed to load blog');
    }
  });
};

// ➕ Create blog
export const useCreateBlog = () => {
  console.log('useCreateBlog hook called');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData) => {
      console.log('useCreateBlog hook called with:', 
        blogData instanceof FormData ? 'FormData object' : typeof blogData);
      try {
        const result = await blogsApi.createBlog(blogData);
        console.log('Blog created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error in useCreateBlog:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation onSuccess callback:', data);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully!');
    },
    onError: (err) => {
      console.error('Mutation onError callback:', err);
      toast.error(err.message || 'Failed to create blog');
    }
  });
};

// ✏️ Update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update blog');
    }
  });
};

// ❌ Delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete blog');
    }
  });
};

// ♻️ Restore blog
export const useRestoreBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.restoreBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog restored successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to restore blog');
    }
  });
};

// 📢 Publish blog
export const usePublishBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.publishBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog published successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to publish blog');
    }
  });
};
