import { useQuery } from '@tanstack/react-query';
import axios from '@utils/axios';
import config from '@config/config';

export const useMediaMetadata = (options = {}) => {
  const {
    skip = 0,
    limit = 10,
    category,
    searchQuery,
    ...restOptions
  } = options;

  return useQuery({
    queryKey: ['mediaMetadata', skip, limit, category, searchQuery],
    queryFn: async () => {
      let url = `${config.endpoints.mediaMetadata}?skip=${skip}&limit=${limit}`;
      
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    },
    ...restOptions
  });
}; 