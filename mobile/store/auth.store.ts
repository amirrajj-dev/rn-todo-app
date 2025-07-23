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
      const {accessToken} = await getTokens()
      if (!accessToken) {
        set({ user: null, isLoading: false });
        await clearTokens();
        return;
      }
      const response = await userApi.getMe(apiClient);
      console.log('getMe response:', response.data);
      set({ user: response.data.data, isLoading: false });
    } catch (error: any) {
      console.error('initializeAuth error:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      set({ user: null, isLoading: false });
      await clearTokens();
    }finally{
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await authApi.logout(apiClient);
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', {
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

// React Query hook for fetching user