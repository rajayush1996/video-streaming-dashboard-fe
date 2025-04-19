'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await axios.get('/blogs');
      return data;
    },
  });
}

export function useBlog(id) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const { data } = await axios.get(`/blogs/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully');
      router.push('/blogs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create blog');
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const { data } = await axios.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully');
      router.push('/blogs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update blog');
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/blogs/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    },
  });
} 