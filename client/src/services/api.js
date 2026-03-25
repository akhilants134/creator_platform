import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Return modified config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Handle error responses
    
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login ONLY IF we are not already on the login page
      // to avoid refreshing the page and losing the error message
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      // Show message (optional)
      console.log('Session expired or invalid credentials.');
    }

    
    // Return the error for component to handle
    return Promise.reject(error);
  }
);

export default api;