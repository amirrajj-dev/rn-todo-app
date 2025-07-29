import { Notification as NotificationI } from '@/interfaces/entities';
import { useTheme } from '@/store/theme.store';
import { useTodoModal } from '@/store/todoModal.store';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { formatDistanceToNow } from 'date-fns';
import * as Animatable from 'react-native-animatable';
import { useMarkNotificationAsRead } from '@/mutations/markNotifcationsAsRead';
import { useDeleteNotification } from '@/mutations/deleteNotification';
import { useEffect } from 'react';

interface NotificationProps {
  notification: NotificationI;
}

const Notification = ({ notification }: NotificationProps) => {
  const { theme } = useTheme();
  const { setModal } = useTodoModal();
  const { mutate: markAsRead, isPending: isMarking, error: markError } =
    useMarkNotificationAsRead();
  const { mutate: deleteNotification, isPending: isDeleting, error: deleteError } =
    useDeleteNotification();

  useEffect(() => {
    if (markError) {
      setModal({
        modalType: 'error',
        title: 'Error',
        description: 'Failed to mark notification as read',
      });
    }
  }, [markError, setModal]);

  useEffect(() => {
    if (deleteError) {
      setModal({
        modalType: 'error',
        title: 'Error',
        description: 'Failed to delete notification',
      });
    }
  }, [deleteError, setModal]);

  const handleMarkAsRead = () => {
    markAsRead(notification._id, {
      onSuccess: () => {
        setModal({
          modalType: 'success',
          title: 'Success!',
          description: 'Notification marked as read!',
        });
      },
    });
  };

  const handleDelete = () => {
    deleteNotification(notification._id, {
      onSuccess: () => {
        setModal({
          modalType: 'success',
          title: 'Success!',
          description: 'Notification deleted!',
        });
      },
    });
  };

  return (
      <Animatable.View
        className={`mb-3 p-5 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
        } shadow-xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="flex-row items-center">
          <Animatable.View animation="bounceIn" duration={800}>
            <Ionicons
              name={
                notification.type === 'reminder'
                  ? 'alarm-outline'
                  : notification.type === 'update'
                  ? 'sync-outline'
                  : 'warning-outline'
              }
              size={28}
              color={
                notification.type === 'reminder'
                  ? '#059669'
                  : notification.type === 'overdue'
                  ? '#F43F5E'
                  : '#F59E0B'
              }
            />
          </Animatable.View>
          <View className="flex-1 ml-3">
            <Text
              className={`text-base font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
            >
              {notification.message}
            </Text>
            <Text
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } mt-1`}
            >
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </View>
          {!notification.isRead ? (
            <TouchableOpacity
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
              }`}
              onPress={handleMarkAsRead}
              disabled={isMarking}
            >
              <Animatable.Text
                className="text-xs font-semibold text-white"
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
              >
                {isMarking ? <ActivityIndicator size={20} color="#fff" /> : 'Mark as Read'}
              </Animatable.Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-rose-600' : 'bg-rose-500'
              }`}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              <Animatable.Text
                className="text-xs font-semibold text-white"
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
              >
                {isDeleting ? <ActivityIndicator size={20} color="#fff" /> : 'Delete'}
              </Animatable.Text>
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>
  );
};

export default Notification;