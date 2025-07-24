import { userApi } from "@/configs/api";
import { apiClient } from "@/configs/axios";
import { useAuth } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import React from "react";

interface MutationProps {
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    isNotificationsEnabled: boolean;
}

interface UpdateProfileData {
    image?: { uri: string; name: string; type: string };
    wantToGetNotification?: boolean;
}

export const useUpdateProfile = ({setIsModal, isNotificationsEnabled}: MutationProps) => {
    const {setUser} = useAuth();
    return useMutation({
        mutationFn: async (data: UpdateProfileData) => {
          const response = await userApi.updateMe(apiClient, {
            wantToGetNotification: data.wantToGetNotification ?? isNotificationsEnabled,
          }, data.image);
          return response.data.data;
        },
        onSuccess: (updatedUser) => {
          setUser(updatedUser);
          setIsModal(true); // Show success modal
        },
        onError: (error: any) => {
          console.error('Update profile error:', {
            message: error.message,
            status: error.response?.status,
            responseData: error.response?.data,
          });
          setIsModal(true); // Show error modal
        },
      });
}