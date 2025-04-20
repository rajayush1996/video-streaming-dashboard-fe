// api/users/usersApi.js
import axiosInstance from '@utils/axios';
import config from '@config/config';

// Fetch users with pagination, search and filters
export const fetchUsers = async ({ page = 1, limit = 10, search = '', status = '', subscription = '' }) => {
  try {
    let url = `${config.endpoints.users}?page=${page}&limit=${limit}`;
    
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    if (subscription) url += `&subscription=${encodeURIComponent(subscription)}`;
    
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Admin: Fetch users with pagination, search and role filtering
export const fetchAdminUsers = async ({ page = 1, limit = 10, search = '', role = '', isActive, includeDeleted = false }) => {
  try {
    let url = `${config.endpoints.adminUsers}?page=${page}&limit=${limit}`;
    
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (role) url += `&role=${encodeURIComponent(role)}`;
    if (isActive !== undefined) url += `&isActive=${isActive}`;
    if (includeDeleted) url += `&includeDeleted=true`;
    
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Fetch a single user by ID
export const fetchUserById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.users}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};

// Admin: Fetch a single user by ID
export const fetchAdminUserById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`${config.endpoints.adminUsers}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};

// Update user (status, subscription, etc.)
export const updateUser = async ({ id, ...userData }) => {
  try {
    const { data } = await axiosInstance.put(`${config.endpoints.users}/${id}`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

// Admin: Update user (role, etc.)
export const updateAdminUser = async ({ id, ...userData }) => {
  try {
    const { data } = await axiosInstance.put(`${config.endpoints.adminUsers}/${id}`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

// Suspend user
export const suspendUser = async (id) => {
  try {
    const { data } = await axiosInstance.patch(`${config.endpoints.users}/${id}/suspend`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to suspend user');
  }
};

// Activate user
export const activateUser = async (id) => {
  try {
    const { data } = await axiosInstance.patch(`${config.endpoints.users}/${id}/activate`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to activate user');
  }
};

// Admin: Change user status
export const changeUserStatus = async (id, status) => {
  try {
    const { data } = await axiosInstance.patch(`${config.endpoints.adminUsers}/${id}/status`, { status });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change user status');
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`${config.endpoints.users}/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Admin: Delete user (soft delete)
export const deleteAdminUser = async (id) => {
  try {
    // Using PATCH since this is a soft delete (partial update) operation
    const { data } = await axiosInstance.patch(`${config.endpoints.adminUsers}/${id}/soft-delete`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Invite new user
export const inviteUser = async (userData) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.users}/invite`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send invitation');
  }
};

// Admin: Create new user
export const createAdminUser = async (userData) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.adminUsers}`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

// Resend invitation
export const resendInvitation = async (email) => {
  try {
    const { data } = await axiosInstance.post(`${config.endpoints.users}/resend-invite`, { email });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend invitation');
  }
}; 