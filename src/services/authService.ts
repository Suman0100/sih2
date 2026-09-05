// Auth service — role selection and LocalStorage persistence
import type { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

const STORAGE_KEY = 'jansamadhan_auth';

export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  login(role: UserRole): User {
    const user = DEMO_USERS.find(u => u.role === role) ?? DEMO_USERS[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  },
};
