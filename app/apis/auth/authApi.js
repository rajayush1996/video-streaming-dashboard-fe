'use client';
import config from '@config/config';
import axiosInstance from '@utils/axios';

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(config.endpoints.login, credentials);
    if (!response.data?.data?.accessToken) {

      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(config.endpoints.logout);
  } catch (error) {
    // Don't throw error on logout, just clear tokens
    console.error('Logout error:', error);
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post(config.endpoints.signUp, userData);
    if (!response.data?.data?.token) {
      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const resendVerification = async (email) => {
  try {
    const res = await axiosInstance.post(config.endpoints.resendEmail, { email });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend verification email' };
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await axiosInstance.post(config.endpoints.verifyEmail, { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Email verification failed' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(config.endpoints.userProfile);
    if (!response.data?.data) {
      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};