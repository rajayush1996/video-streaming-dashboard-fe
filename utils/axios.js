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

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('userData');
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
      const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearTokens();
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
        const refreshEndpoint = config.endpoints.refreshToken || '/api/v1/auth/refresh-token';

        const rawAxios = axios.create({ withCredentials: true });
        const response = await rawAxios.get(`${config.apiBaseUrl}${refreshEndpoint}`);
      
        const { accessToken, refreshToken: newRefresh } = response.data;
      
        setTokens({ accessToken, refreshToken: newRefresh });
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
      } catch (refreshError) {
        console.error('[Axios Refresh Error]', refreshError);
        clearTokens();
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
