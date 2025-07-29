import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/configs/axios";
import { notificationApi } from "@/configs/api";

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      await notificationApi.deleteNotification(apiClient, notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      console.error("Delete notification error:", {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
    },
  });
};
