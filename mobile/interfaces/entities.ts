export interface User {
  _id: string;
  username: string;
  email: string;
  gender: 'male' | 'female';
  profilePic: string;
  profilePublicId?: string;
  wantToGetNotification: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  user: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  todoId: string;
  message: string;
  type: 'reminder' | 'update' | 'overdue';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshToken {
  _id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}