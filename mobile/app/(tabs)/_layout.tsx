import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/store/theme.store";
import { useAuth } from "@/store/auth.store";
import { TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import MyModal from "@/components/modal/MyModal";
import { useState } from "react";

const TabsLayout = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout , isLoading } = useAuth();
  const router = useRouter();
  const showNotifications = user?.wantToGetNotification ?? false;
  const [isOpenLogOutModal, setIsOpenLogOutModal] = useState(false);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === "dark" ? "#111827" : "#F3F4F6",
        },
        headerTintColor: theme === "dark" ? "#FFFFFF" : "#1F2937",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#111827" : "#FFFFFF",
          borderTopColor: theme === "dark" ? "#374151" : "#E5E7EB",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme === "dark" ? "#3B82F6" : "#2563EB",
        tabBarInactiveTintColor: theme === "dark" ? "#9CA3AF" : "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Todos",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "flash" : "flash-outline"}
            />
          ),
          headerRight: () =>
            showNotifications ? (
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
              >
                <TouchableOpacity
                  className="mr-4"
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={theme === "dark" ? "#3B82F6" : "#2563EB"}
                  />
                </TouchableOpacity>
              </Animatable.View>
            ) : null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "settings" : "settings-outline"}
            />
          ),
          headerRight: () => (
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
            >
              <TouchableOpacity
                className="mr-4"
                onPress={() => setIsOpenLogOutModal(true)}
              >
                <Ionicons name="log-out" size={24} color={"#f43f5e"} />
              </TouchableOpacity>
              <MyModal
                title="Ready to leave?"
                description="are you sure you want to log out now?"
                isOpen={isOpenLogOutModal}
                confirmBtnText="Yes, Log Out"
                cancelBtnText="No, Stay"
                haveCancelBtn
                haveConfirmBtn
                handleClose={() => setIsOpenLogOutModal(false)}
                onConfirm={() => logout()}
                isLoading={isLoading}
              />
            </Animatable.View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
