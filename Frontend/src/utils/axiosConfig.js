import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear tokens and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('volunteerInfo');
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/volunteer-login') {
            window.location.href = '/volunteer-login';
          }
          break;
          
        case 403:
          console.error('Forbidden access');
          break;
          
        case 404:
          console.error('Resource not found');
          break;
          
        case 500:
          console.error('Server error');
          break;
          
        default:
          console.error('API Error:', response.status, response.data);
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth helper functions
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
  logout: () => api.post('/api/auth/logout'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
};

// Volunteer helper functions
export const volunteerAPI = {
  getCalls: () => api.get('/api/volunteers/calls'),
  getIncomingCalls: () => api.get('/api/volunteers/incoming-calls'),
  updateProfile: (data) => api.put('/api/volunteers/profile', data),
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && token !== 'null' && token !== 'undefined';
};

// Helper function to get current user info
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('volunteerInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Helper function to logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('volunteerInfo');
  window.location.href = '/volunteer-login';
};

export default api;