import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/store/theme.store";
import { useNotfications } from "@/queries/useNotifications";
import Notification from "@/components/notifications/ui/Notification";
import NotificationSkeleton from "@/components/notifications/ui/NotificationSkeleton";
import { useTodoModal } from "@/store/todoModal.store";
import MyModal from "@/components/modal/MyModal";
import NoNotificationFound from "@/components/notifications/ui/NoNotificationFound";
import Error from "@/components/error/Error";
import { notificationsFilter } from "@/helpers/helpers";
import { useNotificationFilter } from "@/store/notificationFilter.store";
import { useMarkAllNotificationsAsRead } from "@/mutations/MarkAllNotificationsAsRead";
import { useDeleteAllNotifications } from "@/mutations/deleteAllNotifications";

const Notifications = () => {
  const { theme } = useTheme();
  const { data: notifications, isLoading, error } = useNotfications();
  const { setModal, isOpen, modalType, modalTitle, modalDescription } =
    useTodoModal();
  const { setStateFilter, stateFilter } = useNotificationFilter();
  const { mutate: markAllNotificationsAsRead, isPending } =
    useMarkAllNotificationsAsRead();
    const {mutate : deleteAllNotifications , isPending : isPendingDeleteAllNotifications} = useDeleteAllNotifications()
  const isAllNotificationsRead =
    notifications?.filter((notification) => !notification.isRead).length === 0;

  const filteredNotifications = React.useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((notification) => {
      if (stateFilter === "all") {
        return true;
      } else if (stateFilter === "seen") {
        return notification.isRead;
      } else {
        return !notification.isRead;
      }
    });
  }, [notifications, stateFilter]);

  if (isLoading) {
    return (
      <View
        className={`flex-1 p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <NotificationSkeleton />
      </View>
    );
  }

  if (error) {
    return <Error title="Notifications" />;
  }

  if (!filteredNotifications || filteredNotifications.length === 0) {
    return <NoNotificationFound />;
  }

  return (
    <View
      className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <LinearGradient
        colors={
          theme === "dark" ? ["#1F2937", "#111827"] : ["#F3F4F6", "#E5E7EB"]
        }
        className="absolute inset-0"
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 16 }}>
        <View className="px-4">
          <Animatable.Text
            className={`text-3xl font-extrabold mb-4 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
            animation="fadeInUp"
            duration={1000}
          >
            Notifications
          </Animatable.Text>
          <View className="items-end">
            {!isAllNotificationsRead ? (
              <TouchableOpacity
                className={`p-3 mb-4 items-end rounded-lg ${
                  theme === "dark" ? "bg-indigo-600" : "bg-indigo-500"
                }`}
                disabled={isPending}
                onPress={() => markAllNotificationsAsRead()}
              >
                <Animatable.Text
                  className="text-xs font-semibold text-white"
                  animation="pulse"
                  iterationCount="infinite"
                  duration={2000}
                >
                  {isPending ? (
                    <ActivityIndicator size={20} color={"#fff"} />
                  ) : (
                    "Mark All As Read"
                  )}
                </Animatable.Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`p-3 mb-4 items-end rounded-lg ${
                  theme === "dark" ? "bg-rose-600" : "bg-rose-500"
                }`}
                disabled={isPendingDeleteAllNotifications}
                onPress={() => deleteAllNotifications()}
              >
                <Animatable.Text
                  className="text-xs font-semibold text-white"
                  animation="pulse"
                  iterationCount="infinite"
                  duration={2000}
                >
                  {isPendingDeleteAllNotifications ? (
                    <ActivityIndicator size={20} color={"#fff"} />
                  ) : (
                    "Delete All Notifications"
                  )}
                </Animatable.Text>
              </TouchableOpacity>
            )}
            <View className="flex-row justify-between mb-3">
              {notificationsFilter.map(({ label, value }) => (
                <TouchableOpacity
                  key={value}
                  className={`flex-1 mx-1 p-2 rounded-lg ${
                    stateFilter === value
                      ? theme === "dark"
                        ? "bg-blue-700"
                        : "bg-blue-600"
                      : theme === "dark"
                        ? "bg-gray-700"
                        : "bg-gray-300"
                  }`}
                  onPress={() =>
                    setStateFilter(value as "all" | "seen" | "notSeen")
                  }
                >
                  <Animatable.Text
                    className={`text-center text-sm font-semibold ${
                      stateFilter === value
                        ? "text-white"
                        : theme === "dark"
                          ? "text-gray-200"
                          : "text-gray-800"
                    }`}
                    animation={stateFilter === value ? "pulse" : undefined}
                    iterationCount="infinite"
                    duration={2000}
                  >
                    {label}
                  </Animatable.Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {filteredNotifications.map((notification) => {
            return (
              <Notification
                key={notification._id}
                notification={notification}
              />
            );
          })}
        </View>
      </ScrollView>
      <MyModal
        title={modalTitle}
        description={modalDescription}
        haveCancelBtn={modalType === "success" || modalType === "error"}
        haveConfirmBtn={false}
        cancelBtnText="OK"
        isOpen={isOpen && (modalType === "success" || modalType === "error")}
        handleClose={() => setModal({ modalType: null })}
      />
    </View>
  );
};

export default Notifications;
