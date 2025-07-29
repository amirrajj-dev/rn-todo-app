import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/store/theme.store";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNotificationFilter } from "@/store/notificationFilter.store";

const NoNotificationFound = () => {
  const { setStateFilter } = useNotificationFilter();
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <View
      className={`flex-1 items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Animatable.View
        className={`w-11/12 max-w-md p-6 rounded-2xl ${
          theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
        } shadow-xl border ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="items-center mb-4">
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={theme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <Text
            className={`text-xl font-bold mt-3 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            No Notifications
          </Text>
          <Text
            className={`text-base text-center mt-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            You’re all caught up! Add todos to get reminders.
          </Text>
        </View>
        <View className="flex-row items-center justify-center gap-4">
          <TouchableOpacity
            className={`p-3 rounded-lg ${
              theme === "dark" ? "bg-blue-700" : "bg-blue-600"
            }`}
            onPress={() => router.replace("/(tabs)")} // Navigate to todos tab
          >
            <Animatable.Text
              className="text-base font-semibold text-white"
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
            >
              Add Todo
            </Animatable.Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-3 rounded-lg ${
              theme === "dark" ? "bg-sky-700" : "bg-sky-600"
            }`}
            onPress={() => setStateFilter("all")}
          >
            <Animatable.Text
              className="text-base font-semibold text-white"
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
            >
              Reset Filter
            </Animatable.Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default NoNotificationFound;
