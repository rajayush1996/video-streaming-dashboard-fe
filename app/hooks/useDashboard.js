import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as dashboardApi from '@apis/dashboard/dashboardApi';

// Fetch all dashboard data at once
export const useDashboardData = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', { limit }],
    queryFn: () => dashboardApi.fetchDashboardData(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch dashboard data');
    }
  });
};

// Fetch only dashboard metrics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: dashboardApi.fetchDashboardMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch dashboard metrics');
    }
  });
};

// Fetch only recent activities
export const useRecentActivities = (limit = 10) => {
  return useQuery({
    queryKey: ['recentActivities', { limit }],
    queryFn: () => dashboardApi.fetchRecentActivities(limit),
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
    queryFn: dashboardApi.fetchSystemStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch system status');
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