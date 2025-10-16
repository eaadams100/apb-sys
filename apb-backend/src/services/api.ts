import axios from 'axios';
import { Bulletin } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const bulletinAPI = {
  getBulletins: () => api.get<Bulletin[]>('/bulletins'),
  getBulletin: (id: string) => api.get<Bulletin>(`/bulletins/${id}`),
  createBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Bulletin>('/bulletins', bulletin),
  updateBulletin: (id: string, updates: Partial<Bulletin>) => 
    api.put<Bulletin>(`/bulletins/${id}`, updates),
  deleteBulletin: (id: string) => api.delete(`/bulletins/${id}`),
  uploadMedia: (bulletinId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/bulletins/${bulletinId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const authAPI = {
  login: (email: string, password: string) => 
    api.post<{ user: any; token: string }>('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post<{ user: any; token: string }>('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export default api;