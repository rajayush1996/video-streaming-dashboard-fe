import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@apis/auth/authApi';
import { isAuthenticated } from '@/hooks/useAuth';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await getUserProfile();
      return response.data;
    },
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
    onError: (error) => {
      console.error('Failed to fetch user profile:', error);
    }
  });
}; 