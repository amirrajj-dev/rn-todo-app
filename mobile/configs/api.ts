import { Todo, User, Notification } from "@/interfaces/entities";
import { AxiosInstance } from "axios";
import { ApiResponse } from "./axios";

type SignUpUserDto = User & { password: string };
type SignInUserDto = User & { password: string };

const authApi = {
  signup: (
    api: AxiosInstance,
    user: Pick<SignUpUserDto, "password" | "username" | "email" | "gender">
  ) =>
    api.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >("/auth/register", user),
  login: (
    api: AxiosInstance,
    user: Pick<SignInUserDto, "email" | "password">
  ) =>
    api.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >("/auth/login", user),
  refreshToken: (api: AxiosInstance, refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/refresh-token",
      { refreshToken }
    ),
  logout: (api: AxiosInstance) => api.post<ApiResponse<void>>("/auth/logout"),
};

const userApi = {
  getMe: (api: AxiosInstance) => api.get<ApiResponse<User>>("/users/me"),
  updateMe: (
    api: AxiosInstance,
    data: Partial<
      Pick<
        SignUpUserDto,
        "username" | "email" | "password" | "wantToGetNotification"
      >
    >,
    image?: { uri: string; name: string; type: string } // Keep for compatibility, or use ImagePicker.ImagePickerAsset
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value as string)
    );
    if (image)
      formData.append(
        "image",
        { uri: image.uri, name: image.name, type: image.type } as any,
        image.name
      );
    return api.put<ApiResponse<User>>("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteMe: (api: AxiosInstance) => api.delete<ApiResponse<void>>("/users/me"),
};

const notificationApi = {
  getNotifications: (api: AxiosInstance) =>
    api.get<ApiResponse<Notification[]>>("/notifications"),
  markAsRead: (api: AxiosInstance, id: string) =>
    api.put<ApiResponse<Notification>>(`/notifications/${id}`, {}),
  deleteNotification: (api: AxiosInstance, id: string) =>
    api.delete<ApiResponse<Notification>>(`/notifications/${id}`),
  markAllAsRead: (api: AxiosInstance) =>
    api.put<ApiResponse<Notification[]>>("/notifications/mark-all-read"),
  deleteAllNotifications : (api : AxiosInstance)=>api.delete<ApiResponse<void>>("/notifications/all")
}

const todoApi = {
  createTodo: (
    api: AxiosInstance,
    todo: Partial<
      Pick<Todo, "title" | "description" | "completed" | "dueDate" | "priority">
    >
  ) => api.post<ApiResponse<Todo>>("/todos", todo),
  getTodos: (api: AxiosInstance) => api.get<ApiResponse<Todo[]>>("/todos"),
  updateTodo: (
    api: AxiosInstance,
    id: string,
    todo: Partial<
      Pick<Todo, "title" | "description" | "completed" | "dueDate" | "priority">
    >
  ) => api.put<ApiResponse<Todo>>(`/todos/${id}`, todo),
  deleteTodo: (api: AxiosInstance, id: string) =>
    api.delete<ApiResponse<Todo>>(`/todos/${id}`),
};

export { todoApi, authApi, userApi, notificationApi };
