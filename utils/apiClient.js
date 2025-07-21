import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
});

// Request interceptor to add admin token
apiClient.interceptors.request.use(
  (config) => {
    // Get admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      config.headers['x-admin-token'] = adminToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is invalid, redirect to setup page
    if (error.response?.status === 401 && error.response?.data?.message?.includes('token')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/setup';
    }
    return Promise.reject(error);
  }
);

export default apiClient; 