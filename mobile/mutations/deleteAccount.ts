import { userApi } from "@/configs/api";
import { apiClient } from "@/configs/axios";
import { useAuth } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";

interface MutationProps {
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}


export const useDeleteAccount = ({setIsModal} : MutationProps)=>{
    const {logout} = useAuth()
    return useMutation({
      mutationFn: () => userApi.deleteMe(apiClient),
      onSuccess: async () => {
        await logout();
        setIsModal(true); // Show success modal
      },
      onError: (error: any) => {
        console.error('Delete account error:', {
          message: error.message,
          status: error.response?.status,
          responseData: error.response?.data,
        });
        setIsModal(true); // Show error modal
      },
    });
}
