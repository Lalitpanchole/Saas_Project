/**
 * Axios API Client
 * 
 * Configures base URL, HTTP-only cookie inclusion (withCredentials: true),
 * Authorization header attachment, and automatic token rotation on 401 Unauthorized responses.
 * References:
 *   - ARCHITECTURE.md §16 (Frontend HTTP client behavior)
 */

import axios from 'axios';
import { BASE_URL } from '../config/config';

// In-memory access token storage
let accessToken = localStorage.getItem('accessToken') || null;

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function getAccessToken() {
  return accessToken;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send HTTP-only refreshToken cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Response interceptor to handle 401 transparently and enrich validation errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Automatically extract exact field validation errors into message for toast/popup display
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      const details = error.response.data.errors
        .map((e) => e.message || `${e.field || 'Field'}: invalid`)
        .join(' • ');
      if (error.response.data.message === 'Validation failed.' || !error.response.data.message) {
        error.response.data.message = details;
      } else {
        error.response.data.message = `${error.response.data.message} (${details})`;
      }
    }

    const originalRequest = error.config;

    // Do not intercept refresh or login endpoints or already retried requests
    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data && res.data.success) {
          const newToken = res.data.data.accessToken;
          setAccessToken(newToken);
          onRefreshed(newToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        setAccessToken(null);
        // Trigger custom event for AuthContext to catch and redirect to login
        window.dispatchEvent(new CustomEvent('auth:session_expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
