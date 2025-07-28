import axiosInstance from '@utils/axios';
import config from '@config/config';

export const fetchNotifications = async () => {
  try {
    const { data } = await axiosInstance.get(config.endpoints.notifications);
    return data.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};