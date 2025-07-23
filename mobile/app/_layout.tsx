import { Stack } from 'expo-router';
import '@/global.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { useTheme } from '@/store/theme.store';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {QueryClient , QueryClientProvider} from "@tanstack/react-query"
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient()

export default function RootLayout() {
  const {setTheme} = useTheme()
  const colorScheme = useColorScheme()

  useEffect(()=>{
    const initializeTheme = async ()=>{
      const storedTheme = await AsyncStorage.getItem('theme')
      if (!storedTheme){
        setTheme(colorScheme as "light" | "dark")
      }else{
        setTheme(storedTheme as "light" | "dark")
      }
    }
    initializeTheme()
  } , [colorScheme , setTheme])
  return (
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name='notifications' />
      </Stack>
    </AuthProvider>
  </QueryClientProvider>
  );
}