import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/store/theme.store";
import { authApi } from "@/configs/api";
import { setTokens } from "@/configs/helpers";
import { apiClient } from "@/configs/axios";
import { useAuth } from "@/store/auth.store";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import {
  validateEmail,
  validateGender,
  validatePassword,
  validateUsername,
} from "@/validations/validations";
import MyModal from "@/components/modal/MyModal";

const Index = () => {
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBlur = (field: keyof typeof errors) => {
    let error = "";
    if (field === "username") error = validateUsername(username.trim());
    if (field === "email") error = validateEmail(email.trim());
    if (field === "password") error = validatePassword(password.trim());
    if (field === "gender") error = validateGender(gender);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFocus = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSignup = async () => {
    const usernameError = validateUsername(username.trim());
    const emailError = validateEmail(email.trim());
    const passwordError = validatePassword(password.trim());
    const genderError = validateGender(gender);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      gender: genderError,
    });

    if (usernameError || emailError || passwordError || genderError) {
      Alert.alert("Error", "Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.signup(apiClient, {
        username,
        email,
        password,
        gender: gender as "male" | "female",
      });
      const { accessToken, refreshToken, user } = data.data;
      await setTokens(accessToken, refreshToken);
      setUser(user);
      router.push("/(tabs)");
    } catch (error: any) {
      setErrorMessage(error.response.data.message)
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <LinearGradient
        colors={
          theme === "dark" ? ["#1F2937", "#111827"] : ["#F3F4F6", "#E5E7EB"]
        }
        className="absolute inset-0"
      />
      <View className="items-center mt-6">
        <Animatable.Text
          className={`text-3xl font-extrabold mt-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          animation="fadeInDown"
          duration={1200}
        >
          Join Us Today
        </Animatable.Text>
      </View>
      <Animatable.View
        className="px-6 mt-8 w-full"
        animation="fadeInUp"
        duration={1000}
      >
        <View className="mb-4">
          <TextInput
            className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} shadow-sm ${errors.username ? "border-red-500" : ""}`}
            placeholder="Username"
            placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            value={username}
            onChangeText={setUsername}
            onBlur={() => handleBlur("username")}
            onFocus={() => handleFocus("username")}
            autoCapitalize="none"
          />
          {errors.username ? (
            <Animatable.Text
              className="text-red-500 text-sm mt-1"
              animation="fadeIn"
              duration={300}
            >
              {errors.username}
            </Animatable.Text>
          ) : null}
        </View>
        <View className="mb-4">
          <TextInput
            className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} shadow-sm ${errors.email ? "border-red-500" : ""}`}
            placeholder="Email"
            placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            value={email}
            onChangeText={setEmail}
            onBlur={() => handleBlur("email")}
            onFocus={() => handleFocus("email")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Animatable.Text
              className="text-red-500 text-sm mt-1"
              animation="fadeIn"
              duration={300}
            >
              {errors.email}
            </Animatable.Text>
          ) : null}
        </View>
        <View className="mb-4">
          <TextInput
            className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} shadow-sm ${errors.password ? "border-red-500" : ""}`}
            placeholder="Password"
            placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            value={password}
            onChangeText={setPassword}
            onBlur={() => handleBlur("password")}
            onFocus={() => handleFocus("password")}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password ? (
            <Animatable.Text
              className="text-red-500 text-sm mt-1"
              animation="fadeIn"
              duration={300}
            >
              {errors.password}
            </Animatable.Text>
          ) : null}
        </View>
        <View
          className={`${errors.gender ? "mb-0" : "mb-4"} rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-sm ${errors.gender ? "border-red-500" : ""}`}
        >
          <Picker
            selectedValue={gender}
            onValueChange={(value) => {
              setGender(value as "male" | "female");
              handleBlur("gender");
            }}
            onFocus={() => handleFocus("gender")}
            style={{
              color: theme === "dark" ? "#FFFFFF" : "#1F2937",
              fontSize: 16,
            }}
          >
            <Picker.Item
              label="Select Gender"
              value={undefined}
              enabled={false}
              style={{
                fontSize: 14,
                color: theme === "dark" ? "#9CA3AF" : "#6B7280",
              }}
            />
            <Picker.Item label="Male" value="male" style={{ fontSize: 16 }} />
            <Picker.Item
              label="Female"
              value="female"
              style={{ fontSize: 16 }}
            />
          </Picker>
        </View>
        {errors.gender ? (
          <Animatable.Text
            className="text-red-500 text-sm mt-1 px-4 mb-4"
            animation="fadeIn"
            duration={300}
          >
            {errors.gender}
          </Animatable.Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          className={`p-4 rounded-xl ${theme === "dark" ? "bg-blue-700" : "bg-blue-600"} ${loading ? "opacity-50" : ""}`}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? <ActivityIndicator color={"#fff"} /> : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-6"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text
            className={`text-center text-base ${theme === "dark" ? "text-blue-400" : "text-blue-500"} font-medium`}
          >
            Already have an account? <Text className="underline">Log in</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
      <MyModal
        title="Error"
        description={errorMessage}
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        cancelBtnText="Ok"
        haveConfirmBtn={false}
      />
    </SafeAreaView>
  );
};

export default Index;
