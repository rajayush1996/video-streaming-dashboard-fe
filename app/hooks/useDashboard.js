import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as dashboardApi from '@apis/dashboard/dashboardApi';

// Fetch all dashboard data at once
export const useDashboardData = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', { limit }],
    queryFn: async () => {
      try {
        const response = await dashboardApi.fetchDashboardData(limit);
        return response;
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on any server errors (500, 502, 503, etc)
      if (error?.response?.status >= 500) {
        return false;
      }
      // Don't retry on auth errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Only retry once for other errors
      return failureCount < 1;
    },
    onError: (error) => {
      // Only show toast for non-auth errors
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        toast.error(error.message || 'Failed to fetch dashboard data');
      }
    }
  });
};

// Fetch only dashboard metrics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.fetchDashboardMetrics();
        return response;
      } catch (error) {
        console.error('Dashboard metrics fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 500) {
        return false;
      }
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 1;
    },
    onError: (error) => {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        toast.error(error.message || 'Failed to fetch dashboard metrics');
      }
    }
  });
};

// Fetch only recent activities
export const useRecentActivities = (limit = 10) => {
  return useQuery({
    queryKey: ['recentActivities', { limit }],
    queryFn: async () => {
      try {
        const response = await dashboardApi.fetchRecentActivities(limit);
        return response;
      } catch (error) {
        console.error('Recent activities fetch error:', error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (activities change more frequently)
    refetchOnWindowFocus: true,
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch recent activities');
    }
  });
};

// Fetch only system status
export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['systemStatus'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.fetchSystemStatus();
        return response;
      } catch (error) {
        console.error('System status fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 500) {
        return false;
      }
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 1;
    },
    onError: (error) => {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        toast.error(error.message || 'Failed to fetch system status');
      }
    }
  });
};

// Increment video view count
export const useIncrementVideoView = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dashboardApi.incrementVideoView,
    onSuccess: () => {
      // Invalidate dashboard metrics to update view count
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
    onError: (err) => {
      console.error('Failed to increment view count:', err);
      // We don't show a toast error here to not disrupt user experience
    }
  });
}; 