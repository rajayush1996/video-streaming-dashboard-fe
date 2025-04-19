import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@utils/axios';
import config from '@config/config';
import { toast } from 'react-toastify';

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.patch(
        `${config.endpoints.mediaMetadata}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaMetadata']);
      toast.success('Video updated successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update video', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${config.endpoints.mediaMetadata}/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaMetadata']);
      toast.success('Video deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete video', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
};

export const useRestoreVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(
        `${config.endpoints.mediaMetadata}/${id}/restore`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaMetadata']);
      toast.success('Video restored successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore video', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
}; 