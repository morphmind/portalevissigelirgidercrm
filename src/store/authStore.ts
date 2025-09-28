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
export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    isAuthenticated: localStorage.getItem(AUTH_KEY) === 'true',
    login: (password: string) => {
      if (password === MOCK_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        set((state) => {
          state.isAuthenticated = true;
        });
        return true;
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      set((state) => {
        state.isAuthenticated = false;
      });
    },
    checkAuth: () => {
      set((state) => {
        state.isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
      });
    },
  }))
);