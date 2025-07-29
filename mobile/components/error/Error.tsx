import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/theme.store';
import { useNotfications } from '@/queries/useNotifications';
import { useTodos } from '@/queries/useTodos';

const Error = ({title} : {title : string}) => {
  const { theme } = useTheme();
  const { refetch, isFetching : isRefetchingNotifications } = useNotfications();
  const {refetch : refetchTodos , isRefetching : isRefetchingTodos} = useTodos()

  const isRefetching = title === "Todos" ? isRefetchingTodos : isRefetchingNotifications

  return (
    <View
      className={`flex-1 items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <Animatable.View
        className={`w-11/12 max-w-md p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
        } shadow-xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="items-center mb-4">
          <Animatable.View animation="bounceIn" duration={800}>
            <Ionicons
              name="warning-outline"
              size={48}
              color="#F43F5E"
            />
          </Animatable.View>
          <Animatable.Text
            className={`text-base text-center mt-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            animation="fadeIn"
            duration={600}
            delay={200}
          >
            Failed to load {title}. Please try again.
          </Animatable.Text>
        </View>
        <TouchableOpacity
          className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
          } mx-auto`}
          onPress={() => title === "Todos" ? refetchTodos() : refetch()}
          disabled={isRefetching}
        >
          <Animatable.Text
            className="text-base font-semibold text-white"
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
          >
            {isRefetching ? <ActivityIndicator size={20} color={"#fff"} /> : 'Retry'}
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default Error;