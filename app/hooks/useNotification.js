import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as notificationsApi from '@apis/notifications/notificationsApi';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.fetchNotifications,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch notifications');
    }
  });
};