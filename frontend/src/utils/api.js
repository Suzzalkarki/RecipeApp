import axios from 'axios';

// Base URL of our backend — one place to change if URL ever changes
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This runs before every request automatically
// If a token exists in localStorage, attach it to the header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;