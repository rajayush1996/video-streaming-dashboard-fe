// hooks/useBlogs.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@utils/axios';

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/blogs');
      return data;
    }
  });
};
