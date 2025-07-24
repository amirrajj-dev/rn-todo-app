import { create } from 'zustand';
import { User } from '@/interfaces/entities';
import { userApi, authApi } from '@/configs/api';
import { apiClient } from '@/configs/axios';
import { clearTokens, getTokens } from '@/configs/helpers';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  initializeAuth: async () => {
    try {
      const { accessToken } = await getTokens();
      console.log('initializeAuth: Access token found:', !!accessToken);
      if (!accessToken) {
        console.log('initializeAuth: No access token, setting user to null');
        set({ user: null, isLoading: false });
        return;
      }
      const response = await userApi.getMe(apiClient);
      console.log('initializeAuth: getMe response:', response.data);
      set({ user: response.data.data, isLoading: false });
    } catch (error: any) {
      console.error('initializeAuth error:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      // Only clear tokens if refresh fails explicitly (handled in axios.ts)
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    try {
      set({isLoading : true})
      await authApi.logout(apiClient);
    } catch (error: any) {
      console.error('logout error:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
    } finally {
      await clearTokens();
      set({ user: null, isLoading: false });
    }
  },
}));