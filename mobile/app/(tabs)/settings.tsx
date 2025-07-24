import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@/store/theme.store";
import { useAuth } from "@/store/auth.store";
import * as SecureStore from "expo-secure-store";
import ProfileSection from "@/components/settings/ui/ProfileSection";
import ToggleSection from "@/components/settings/ui/ToggleSection";
import DeleteAccountSection from "@/components/settings/ui/DeleteAccountSection";
import MyModal from "@/components/modal/MyModal";
import { useUpdateProfile } from "@/mutations/updateProfile";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useAuth();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(
    user?.wantToGetNotification ?? false
  );
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    mutate: updateProfile,
    isSuccess,
    isError,
    error,
    isPending,
  } = useUpdateProfile({
    isNotificationsEnabled,
    setIsModal: setIsModalOpen,
  });

  const handleNotificationToggle = (value: boolean) => {
    setIsNotificationsEnabled(value);
    updateProfile({ wantToGetNotification: value });
  };

  const handleThemeToggle = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    setIsDarkMode(value);
    setTheme(newTheme);
    SecureStore.setItemAsync("theme", newTheme);
  };

  if (!user) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#3B82F6" : "#2563EB"}
        />
        <Text
          className={`mt-4 text-lg ${theme === "dark" ? "text-white" : "text-gray-800"}`}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <LinearGradient
        colors={
          theme === "dark" ? ["#1F2937", "#111827"] : ["#F3F4F6", "#E5E7EB"]
        }
        className="absolute inset-0"
      />
      <Animatable.View
        className="flex-1 px-6 mt-6"
        animation="fadeInUp"
        duration={1000}
      >
        <Text
          className={`text-3xl font-extrabold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Settings
        </Text>
        <ProfileSection
          user={user}
          setUser={setUser}
          isNotificationsEnabled={isNotificationsEnabled}
        />
        <ToggleSection
          title="Notifications"
          icon="notifications"
          value={isNotificationsEnabled}
          onValueChange={handleNotificationToggle}
          isDisabled={isPending}
          animationDelay={900}
        />
        <ToggleSection
          title="Dark Mode"
          icon={theme === "dark" ? "moon" : "sunny"}
          value={isDarkMode}
          onValueChange={handleThemeToggle}
          animationDelay={1000}
        />
        <DeleteAccountSection />
      </Animatable.View>
      <MyModal
        title={isSuccess ? "Success" : "Error"}
        description={
          isSuccess
            ? "Notification settings updated successfully"
            : error?.response?.data?.errors
            ? error.response.data.errors
                .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
                .join(", ")
            : error?.response?.data?.message || "Failed to update notification settings"
        }
        haveCancelBtn={true}
        haveConfirmBtn={false}
        handleClose={()=>setIsModalOpen(false)}
        isLoading={isPending}
        isOpen={isModalOpen}
        cancelBtnText="Ok"
      />
    </SafeAreaView>
  );
};

export default Settings;