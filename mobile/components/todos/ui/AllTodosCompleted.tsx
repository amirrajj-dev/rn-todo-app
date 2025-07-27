import { View } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/theme.store';

const AllTodosCompleted = () => {
  const { theme } = useTheme();

  return (
    <View className="mb-3">
      <Animatable.View
        className={`w-full p-5 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
        } shadow-2xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
        animation="zoomIn"
        duration={1000}
        delay={400}
      >
        <View className="flex-row items-center mb-3">
          <Animatable.View animation="bounceIn" duration={800}>
            <Ionicons
              name="sparkles"
              size={28}
              color={theme === 'dark' ? '#FBBF24' : '#D97706'}
            />
          </Animatable.View>
            <Animatable.Text
              className={`text-xl font-bold px-2 py-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
              animation="fadeIn"
              duration={600}
            >
              All Done!
            </Animatable.Text>
        </View>
        <Animatable.Text
          className={`text-base text-center mb-3 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
          }`}
          animation="fadeIn"
          duration={600}
          delay={200}
        >
          You’ve completed all your todos! 🎉 Time to celebrate or add more!
        </Animatable.Text>
      </Animatable.View>
    </View>
  );
};

export default AllTodosCompleted;