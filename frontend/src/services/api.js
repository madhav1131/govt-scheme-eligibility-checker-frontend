import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Auth Token header
API.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getSaved: () => API.get('/auth/saved'),
  toggleBookmark: (data) => API.post('/auth/bookmark', data),
};

export const schemeAPI = {
  getAll: (params) => API.get('/schemes', { params }),
  getById: (id) => API.get(`/schemes/${id}`),
  create: (data) => API.post('/schemes', data),
  update: (id, data) => API.put(`/schemes/${id}`, data),
  delete: (id) => API.delete(`/schemes/${id}`),
};

export const eligibilityAPI = {
  check: (data) => API.post('/eligibility/check', data),
};

export default API;
