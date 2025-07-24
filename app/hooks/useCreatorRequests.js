import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@utils/axios';
import config from '@config/config';

const endpoints = config.endpoints;

/**
 * Fetches all pending creator requests.
 * Returns { data, isLoading, isError } from React Query.
 */
export function useFetchCreatorRequests() {
  return useQuery({
    queryKey: ['creatorRequests', { status: 'pending' }],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${endpoints.creator}?status=pending`
      );
      return response.data.data.results;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Approve or reject a creator request by ID.
 * Returns { mutate, isPending, error } and invalidates cache on success.
 */
export function useHandleCreatorRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, rejectionReason }) => {
      console.log("🚀 ~ :34 ~ useHandleCreatorRequest ~ status:", status)
      console.log("🚀 ~ :34 ~ useHandleCreatorRequest ~ id:", id)
      await axiosInstance.patch(
        `${endpoints.adminCreator}/${id}/status`, { status, rejectionReason }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorRequests'] });
    },
  });
}
