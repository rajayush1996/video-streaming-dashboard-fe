// utils/axiosInstance.js
import axios from 'axios';
import config from '@config/config';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
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

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
    Cookies.set('refreshToken', refreshToken, { path: '/' });
  }
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('userData');
}

// Create a function to handle navigation
const redirectToSignIn = () => {
  if (typeof window !== 'undefined') {
    // Clear any existing tokens
    clearTokens();
    // Use window.location.replace for a clean navigation
    window.location.replace('/signin');
  }
};

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

    // Handle 401/403 errors
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refresh-token') // Prevent infinite loop
    ) {
      const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
      
      // If no refresh token, redirect to signin
      if (!refreshToken) {
        redirectToSignIn();
        return Promise.reject(error);
      }

      // If already refreshing, add to queue
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
        const rawAxios = axios.create({ 
          baseURL: config.apiBaseUrl,
          withCredentials: true 
        });
        
        const response = await rawAxios.post(refreshEndpoint, {
          refreshToken: refreshToken
        });
      
        const { accessToken, refreshToken: newRefresh } = response.data;
        
        if (!accessToken) {
          throw new Error('No access token received');
        }
      
        setTokens({ accessToken, refreshToken: newRefresh });
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
        
        // Retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('[Axios Refresh Error]', refreshError);
        redirectToSignIn();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
