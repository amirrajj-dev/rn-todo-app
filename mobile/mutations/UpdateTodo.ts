import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/configs/axios';
import { useTodoModal } from '@/store/todoModal.store';
import { TodoData } from './createTodo';
import { todoApi } from '@/configs/api';

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const { setModal } = useTodoModal();

  return useMutation({
    mutationFn: async (data: { id: string } & Partial<TodoData>) => {
      const { id, ...updates } = data;
      const response = await todoApi.updateTodo(apiClient, id, updates);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setModal({
        modalType: 'success',
        description: 'Todo updated successfully',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data.errors
        ? error.response.data.errors
            .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
            .join(', ')
        : error.response?.data.message || 'Failed to update todo';
      console.error('Update todo error:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      setModal({ modalType: 'error', description: message });
    },
  });
};