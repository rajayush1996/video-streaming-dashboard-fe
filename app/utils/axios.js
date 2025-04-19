import axios from 'axios';
import { getStoredTokens, setTokens, clearTokens } from '@/hooks/useAuth';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
console.log("🚀 ~ baseURL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip auth header for login and signup
    if (config.url?.includes('/auth/sign-in') || config.url?.includes('/auth/sign-up')) {
      return config;
    }

    const { accessToken } = getStoredTokens();
    console.log("🚀 ~ accessToken:", accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh token logic for auth endpoints
    if (
      originalRequest.url?.includes('/auth/sign-in') ||
      originalRequest.url?.includes('/auth/sign-up') ||
      originalRequest.url?.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // If the error status is 401 and there's no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = getStoredTokens();
        if (!refreshToken) {
          clearTokens();
          if (window.location.pathname !== '/signin') {
            window.location.href = '/signin';
          }
          return Promise.reject(error);
        }

        // Make a request to refresh the token
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        if (!response.data?.data?.token) {
          throw new Error('Invalid refresh token response');
        }

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.token;

        // Update the tokens in localStorage
        setTokens(accessToken, newRefreshToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearTokens();
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 