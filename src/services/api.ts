import axios from 'axios';
import { Bulletin } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bulletinAPI = {
  // Get all bulletins
  getBulletins: () => api.get<Bulletin[]>('/bulletins'),
  
  // Get bulletin by ID
  getBulletin: (id: string) => api.get<Bulletin>(`/bulletins/${id}`),
  
  // Create new bulletin
  createBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Bulletin>('/bulletins', bulletin),
  
  // Update bulletin
  updateBulletin: (id: string, updates: Partial<Bulletin>) => 
    api.put<Bulletin>(`/bulletins/${id}`, updates),
  
  // Delete bulletin
  deleteBulletin: (id: string) => api.delete(`/bulletins/${id}`),
};

export default api;