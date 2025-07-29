import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/configs/axios';
import { notificationApi } from '@/configs/api';

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationApi.markAsRead(apiClient , notificationId)
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
    },
  });
};