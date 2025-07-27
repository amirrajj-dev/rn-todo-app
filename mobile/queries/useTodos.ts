import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/configs/axios';
import { Todo } from '@/interfaces/entities';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Todo[]>>('/todos');
      return response.data.data;
    },
  });
};