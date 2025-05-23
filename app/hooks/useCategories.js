import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@utils/axios';
import config from '@config/config';

const endpoints = config.endpoints;

// Fetch categories by type (tree format)
export const useCategoryTreeByType = (type) => {
  return useQuery({
    queryKey: ['categories', type, 'tree'],
    queryFn: async () => {
      const { data } = await axios.get(`${endpoints.categoryType}/${type}/tree`);
      return data;
    },
    enabled: !!type,
  });
};

// Fetch all categories (flat list with filters)
export const useAllCategories = (params = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.categories, { params });
      return data;
    },
  });
};


/**
 * Custom hook to fetch categories by type (e.g., video, blog, reel)
 * @param {string} type - The type of category to fetch
 */
export const useCategoriesByType = (type) => {
    return useQuery({
      queryKey: ['categories', type],
      queryFn: async () => {
        const response = await axios.get(`${endpoints.categoryType}/${type}`);
        return response.data?.data || [];
      },
      enabled: !!type, // only fetch when type is provided
      refetchOnMount: 'always'
    });
  };

// Fetch category by ID
export const useCategoryById = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await axios.get(`${endpoints.categories}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(endpoints.categories, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.put(`${endpoints.categories}/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${endpoints.categories}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });
};

// Toggle status
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.patch(`${endpoints.categories}/${id}/toggle-status`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });
};
