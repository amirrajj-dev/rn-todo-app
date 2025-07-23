import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { clearTokens, getTokens, setTokens } from "./helpers";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://rn-todo-app.vercel.app/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const {accessToken} = await getTokens()
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: CustomAxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      error.response?.data.message === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const {refreshToken} = await getTokens()
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        await setTokens(accessToken, newRefreshToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        return apiClient(originalRequest);
      } catch (refreshError) {
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient};