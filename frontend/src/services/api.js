import axios from 'axios';
import toast from 'react-hot-toast';

// Uses Vite proxy: all /api requests go to http://localhost:8080 via the proxy
// This avoids CORS completely - the browser sees all requests as same-origin
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap the ApiResponse wrapper
// Backend always returns: { success: boolean, message: string, data: T, timestamp: string }
api.interceptors.response.use(
  (response) => {
    // Return the full ApiResponse body so callers can check response.success and response.data
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 401) {
        // Only redirect if we have a token (expired session), not on login failures
        const hasToken = !!localStorage.getItem('token');
        if (hasToken) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status === 409) {
        // Duplicate resource (e.g. email already exists)
        toast.error(message || 'This resource already exists.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      // For 400, 404, 409 — let the caller handle by returning the error
    } else if (error.request) {
      // Network error: no response received
      toast.error('Cannot connect to server. Please ensure the backend is running.');
    }
    return Promise.reject(error);
  }
);

export default api;
