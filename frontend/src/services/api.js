import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
const API_VERSION = "v1"

// Instance Axios with base URL
export const api = axios.create({
  baseURL: API_BASE,
});

// Add or remove Authorization header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Get all users
export const fetchUsers = () => api.get(API_VERSION + '/users');

// Get all links
export const fetchLinks = () => api.get(API_VERSION + '/links');

// Get current user info
export const fetchMe = () => api.get(API_VERSION + '/me');

// Add a new link
export const addLink = (linkData) => api.post('/links', linkData);