import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/configs/axios';
import { todoApi } from '@/configs/api';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await todoApi.getTodos(apiClient);
      return response.data.data;
    },
  });
};