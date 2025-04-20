// api/dashboard/dashboardApi.js
import axiosInstance from '@utils/axios';
import config from '@config/config';

// Get all dashboard data in a single call
export const fetchDashboardData = async (limit = 10) => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.dashboard}?limit=${limit}`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

// Get only dashboard metrics
export const fetchDashboardMetrics = async () => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.dashboard}/metrics`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard metrics');
  }
};

// Get only recent activities
export const fetchRecentActivities = async (limit = 10) => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.dashboard}/activities?limit=${limit}`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent activities');
  }
};

// Get only system status
export const fetchSystemStatus = async () => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.dashboard}/status`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch system status');
  }
};

// Increment video view count
export const incrementVideoView = async (id) => {
  try {
    const { data } = await axiosInstance.put(`${config.endpoints.mediaMetadata}/${id}/view`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to increment view count');
  }
}; 