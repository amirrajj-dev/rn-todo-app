import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/store/auth.store';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@/store/theme.store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isLoading: authLoading, initializeAuth } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { theme } = useTheme();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)');
    }
  }, [user, authLoading, segments , router]);

  if (authLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <ActivityIndicator
          size="large"
          color={theme === 'dark' ? '#3B82F6' : '#2563EB'}
        />
        <Text
          className={`mt-4 text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};