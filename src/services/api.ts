import axios from 'axios';
import { Bulletin, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// FIX: Add these authAPI methods
export const authAPI = {
  login: (email: string, password: string) => 
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),
  getProfile: () => api.get<{ user: User }>('/auth/profile'),
};

export const bulletinAPI = {
  getBulletins: () => api.get<Bulletin[]>('/bulletins'),
  getBulletin: (id: string) => api.get<Bulletin>(`/bulletins/${id}`),
  createBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Bulletin>('/bulletins', bulletin),
};

export default api;