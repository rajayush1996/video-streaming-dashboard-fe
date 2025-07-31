
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as moderationApi from '@apis/moderation/moderationApi';

export const usePendingModeration = () => {
  return useQuery({
    queryKey: ['pendingModeration'],
    queryFn: moderationApi.fetchPendingItems,
    retry: false,
  });
};

export const useModerationAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moderationApi.updateModerationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingModeration'] });
      toast.success('Status updated');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status');
    },
  });
};