import { apiClient } from '@/configs/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTodoModal } from '@/store/todoModal.store';
import { todoApi } from '@/configs/api';

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { setModal } = useTodoModal();

  return useMutation({
    mutationFn: async (id: string) => {
      await todoApi.deleteTodo(apiClient, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setModal({
        modalType: 'success',
        description: 'Todo deleted successfully',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data.errors
        ? error.response.data.errors
            .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
            .join(', ')
        : error.response?.data.message || 'Failed to delete todo';
      console.error('Delete todo error:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      setModal({ modalType: 'error', description: message });
    },
  });
};