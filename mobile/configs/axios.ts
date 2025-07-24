import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { clearTokens, getTokens, setTokens } from './helpers';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://rn-todo-app.vercel.app/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

interface CustomAxiosError extends AxiosError {
  response?: AxiosResponse<{
    success: boolean;
    message: string;
    errors?: Array<{ field: string; message: string }>;
  }>;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const { accessToken } = await getTokens();
    console.log('Request interceptor: accessToken:', !!accessToken);
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: CustomAxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      (error.response?.data.message === 'Token expired' ||
        error.response?.data.message === 'Invalid token') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = await getTokens();
        console.log('Response interceptor: refreshToken:', !!refreshToken);
        if (!refreshToken) {
          console.error('Response interceptor: No refresh token available');
          await clearTokens();
          throw new Error('No refresh token available');
        }

        const response = await axios.post<
          ApiResponse<{ accessToken: string; refreshToken: string }>
        >(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        console.log('Response interceptor: Token refreshed successfully');
        await setTokens(accessToken, newRefreshToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient };