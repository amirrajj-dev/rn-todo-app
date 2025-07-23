import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/store/theme.store';
import { authApi } from '@/configs/api';
import { setTokens } from '@/configs/helpers';
import { apiClient } from '@/configs/axios';
import { useAuth } from '@/store/auth.store';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { validateEmail, validatePassword } from '@/validations/validations';

const Login = () => {
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleBlur = (field: keyof typeof errors) => {
    let error = '';
    if (field === 'email') error = validateEmail(email);
    if (field === 'password') error = validatePassword(password);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };
   const handleFocus = (field : keyof typeof errors)=>{
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      Alert.alert('Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending login request:', { email });
      const response = await authApi.login(apiClient, { email, password });
      const { accessToken, refreshToken, user } = response.data.data;
      await setTokens(accessToken, refreshToken);
      setUser(user);
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <LinearGradient
        colors={theme === 'dark' ? ['#1F2937', '#111827'] : ['#F3F4F6', '#E5E7EB']}
        className="absolute inset-0"
      />
      <View className="items-center mt-6">
        <Animatable.Text
          className={`text-3xl font-extrabold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
          animation="fadeInDown"
          duration={1200}
        >
          Welcome Back
        </Animatable.Text>
      </View>
      <Animatable.View className="w-full px-6 mt-8" animation="fadeInUp" duration={1000}>
        <View className="mb-4">
          <TextInput
            className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'} shadow-sm ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Email"
            placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={email}
            onChangeText={setEmail}
            onBlur={() => handleBlur('email')}
            onFocus={()=>handleFocus("email")}
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
            className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'} shadow-sm ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Password"
            placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={password}
            onChangeText={setPassword}
            onBlur={() => handleBlur('password')}
            onFocus={()=>handleFocus("password")}
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
        <TouchableOpacity
          activeOpacity={0.7}
          className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'} ${loading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? <ActivityIndicator color={"#fff"} /> : 'Log In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-6" onPress={() => router.push('/(auth)')}>
          <Text className={`text-center text-base ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} font-medium`}>
            Don't have an account? <Text className="underline">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default Login;