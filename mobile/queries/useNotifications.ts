import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/configs/axios";
import { notificationApi } from "@/configs/api";

export const useNotfications = ()=>{
    return useQuery({
        queryKey : ["notifications"],
        queryFn : async ()=>{
            const response = await notificationApi.getNotifications(apiClient);
            return response.data.data;
        }
    })
}