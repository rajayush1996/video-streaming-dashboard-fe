'use client';
import config from '@config/config';
import axiosInstance from '@utils/axios';

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(config.endpoints.login, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(config.endpoints.logout);
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post(config.endpoints.signUp, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const resendVerification = async (email) => {
  const res = await axiosInstance.post(config.endpoints.resendEmail, { email });
  return res.data;
};

export const verifyEmail = async (token) => {
  try {
    const response = await axiosInstance.post(config.endpoints.verifyEmail, { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Email verification failed' };
  }
};