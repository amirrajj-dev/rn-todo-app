import { View } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@/store/theme.store';

const NotificationSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View className="px-4">
      {[...Array(4)].map((_, index) => (
        <Animatable.View
          key={index}
          className={`mb-3 p-5 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
          animation="pulse"
          iterationCount="infinite"
          duration={1500}
        >
          <View className="flex-row items-center">
            <Animatable.View
              className={`w-7 h-7 rounded-full ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}
              animation="pulse"
              iterationCount="infinite"
              duration={1500}
            />
            <View className="flex-1 ml-3">
              <Animatable.View
                className={`h-5 w-3/4 rounded ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}
                animation="pulse"
                iterationCount="infinite"
                duration={1500}
              />
              <Animatable.View
                className={`h-4 w-1/2 rounded mt-2 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}
                animation="pulse"
                iterationCount="infinite"
                duration={1500}
              />
            </View>
            <Animatable.View
              className={`w-20 h-8 rounded-lg ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}
              animation="pulse"
              iterationCount="infinite"
              duration={1500}
            />
          </View>
        </Animatable.View>
      ))}
    </View>
  );
};

export default NotificationSkeleton;