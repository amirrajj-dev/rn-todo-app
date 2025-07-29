import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/configs/axios';
import { notificationApi } from '@/configs/api';
import { useTodoModal } from '@/store/todoModal.store';

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const {setModal} = useTodoModal()

  return useMutation({
    mutationFn: async () => {
      const response = await notificationApi.markAllAsRead(apiClient);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setModal({
        title : "Success" ,
        modalType : "success",
        description : "All notifications have been marked as read" 
      })
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
      setModal({
        title : "Error" ,
        modalType : "error",
        description : "Failed to mark all notifications as read"
      })
    },
  });
};