import axiosInstance from '@utils/axios';
import config from '@config/config';

export const fetchPendingItems = async () => {
  const { data } = await axiosInstance.get(`${config.endpoints.moderation}?status=pending`);
  return data.data || data;
};

export const updateModerationStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`${config.endpoints.moderation}/${id}/status`, { status });
  return data.data || data;
};