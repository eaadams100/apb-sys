import { User } from '../types';

// Mock auth service - replace with real authentication
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Mock login - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: '1',
          email,
          name: 'John Officer',
          agencyId: 'agency1',
          role: 'officer',
        };
        const token = 'mock-jwt-token';
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        resolve({ user, token });
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};