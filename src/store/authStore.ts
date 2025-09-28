import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
interface AuthState {
  isAuthenticated: boolean;
}
interface AuthActions {
  login: (password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
}
const AUTH_KEY = 'villa_flow_auth';
const MOCK_PASSWORD = 'admin'; // In a real app, this would be handled by a secure backend.

// Helper function to safely check localStorage
const getStoredAuth = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(AUTH_KEY) === 'true' : false;
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    isAuthenticated: true, // Auto-authenticate for development
    login: (password: string) => {
      if (password === MOCK_PASSWORD) {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_KEY, 'true');
          }
        } catch { /* ignore localStorage errors */ }
        set((state) => {
          state.isAuthenticated = true;
        });
        return true;
      }
      return false;
    },
    logout: () => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch { /* ignore localStorage errors */ }
      set((state) => {
        state.isAuthenticated = false;
      });
    },
    checkAuth: () => {
      set((state) => {
        state.isAuthenticated = getStoredAuth();
      });
    },
  }))
);