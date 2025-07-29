import { apiClient } from '@/configs/axios';
import { useMutation , useQueryClient } from '@tanstack/react-query';
import { useTodoModal } from '@/store/todoModal.store';
import { todoApi } from '@/configs/api';

export interface TodoData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { setModal } = useTodoModal();

  return useMutation({
    mutationFn: async (data: TodoData) => {
      const response = await todoApi.createTodo(apiClient, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({queryKey : ["notifications"]});
      setModal({
        modalType: 'success',
        description: 'Todo created successfully',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data.errors
        ? error.response.data.errors
            .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
            .join(', ')
        : error.response?.data.message || 'Failed to create todo';
      console.error('Create todo error:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      setModal({ modalType: 'error', description: message });
    },
  });
};