// utils/axiosInstance.js
import axios from 'axios';
import config from '@config/config';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
});

// Refresh token support
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (req) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Only set auth header if token exists and it's not an auth route
    if (
      token &&
      !req.url.includes('/login') &&
      !req.url.includes('/signup') &&
      !req.url.includes('/refresh-token')
    ) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }

    // Conditionally set content type (skip for FormData)
    if (!(req.data instanceof FormData)) {
      req.headers['Content-Type'] = 'application/json';
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use( 
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        window.location.href = '/signin';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use the refresh token endpoint from config or fallback to a default
        const refreshEndpoint = config.endpoints.refreshToken || '/api/v1/auth/refresh-token';
        
        // Use POST method for refresh token request
        const res = await axios.post(`${config.apiBaseUrl}${refreshEndpoint}`, {
          refreshToken: refreshToken
        });
        
        const { accessToken } = res.data;

        localStorage.setItem('accessToken', accessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        onRefreshed(accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        localStorage.removeItem('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
