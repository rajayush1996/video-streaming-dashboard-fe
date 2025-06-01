import { useQuery } from '@tanstack/react-query';
import axios from '@utils/axios';
import config from '@config/config';

export const useMediaMetadata = (options = {}) => {
  const {
    page = 1,
    limit = 10,
    category,
    searchQuery,
    type,
    ...restOptions
  } = options;

  return useQuery({
    queryKey: ['mediaMetadata', page, limit, category, searchQuery],
    queryFn: async () => {
      let url = `${config.endpoints.mediaMetadata}?page=${page}&limit=${limit}&type=${type}`;
      
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    },
    keepPreviousData: true,
    ...restOptions
  });
}; 