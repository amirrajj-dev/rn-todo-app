import { View } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@/store/theme.store';

const SkeletonLoader = () => {
  const { theme } = useTheme();

  return (
    <View className="flex-1">
      {[...Array(4)].map((_, index) => (
        <Animatable.View
          key={index}
          className={`p-4 rounded-xl mb-3 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} shadow-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          animation="fadeInUp"
          duration={1000}
          delay={index * 200}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Animatable.View
                className={`w-10 h-5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                animation={{
                  from: { opacity: 0.3 },
                  to: { opacity: 0.7 },
                }}
                duration={1200}
                iterationCount="infinite"
                easing="ease-in-out"
                direction="alternate"
              />
              <View className="ml-3 flex-1">
                <Animatable.View
                  className={`h-5 w-3/4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  animation={{
                    from: { opacity: 0.3 },
                    to: { opacity: 0.7 },
                  }}
                  duration={1200}
                  iterationCount="infinite"
                  easing="ease-in-out"
                  direction="alternate"
                />
                <Animatable.View
                  className={`h-4 w-2/3 rounded mt-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  animation={{
                    from: { opacity: 0.3 },
                    to: { opacity: 0.7 },
                  }}
                  duration={1200}
                  iterationCount="infinite"
                  easing="ease-in-out"
                  direction="alternate"
                />
                <Animatable.View
                  className={`h-4 w-1/2 rounded mt-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  animation={{
                    from: { opacity: 0.3 },
                    to: { opacity: 0.7 },
                  }}
                  duration={1200}
                  iterationCount="infinite"
                  easing="ease-in-out"
                  direction="alternate"
                />
                <Animatable.View
                  className={`h-4 w-1/4 rounded mt-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  animation={{
                    from: { opacity: 0.3 },
                    to: { opacity: 0.7 },
                  }}
                  duration={1200}
                  iterationCount="infinite"
                  easing="ease-in-out"
                  direction="alternate"
                />
              </View>
            </View>
            <View className="flex-row gap-2">
              <Animatable.View
                className={`w-6 h-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                animation={{
                  from: { opacity: 0.3 },
                  to: { opacity: 0.7 },
                }}
                duration={1200}
                iterationCount="infinite"
                easing="ease-in-out"
                direction="alternate"
              />
              <Animatable.View
                className={`w-6 h-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                animation={{
                  from: { opacity: 0.3 },
                  to: { opacity: 0.7 },
                }}
                duration={1200}
                iterationCount="infinite"
                easing="ease-in-out"
                direction="alternate"
              />
            </View>
          </View>
        </Animatable.View>
      ))}
    </View>
  );
};

export default SkeletonLoader;