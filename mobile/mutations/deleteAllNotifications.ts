import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/configs/axios";
import { notificationApi } from "@/configs/api";
import { useTodoModal } from "@/store/todoModal.store";

export const useDeleteAllNotifications = () => {
    const {setModal}= useTodoModal()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await notificationApi.deleteAllNotifications(apiClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setModal({
        title : "Success",
        description : "Notifications deleted successfully",
        modalType : "success"
      })
    },
    onError: (error: any) => {
      console.log(error.response.data)
      setModal({
        title : "Error" ,
        description : "Error deleting notification" ,
        modalType : "error"
      })
    },
  });
};
