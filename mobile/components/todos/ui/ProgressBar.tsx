import { View } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/store/theme.store';
import { useTodos } from '@/queries/useTodos';

const ProgressBar = () => {
  const { theme } = useTheme();
  const { data: todos, isLoading } = useTodos();

  const { completedCount, totalCount, percentage } = React.useMemo(() => {
    if (!todos || todos.length === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0 };
    }
    const completedCount = todos.filter((todo) => todo.completed).length;
    const totalCount = todos.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    return { completedCount, totalCount, percentage };
  }, [todos]);

  if (isLoading) {
    return null;
  }

  return (
    <View className="mb-3">
      <Animatable.View
        className={`w-full p-5 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'
        } shadow-2xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
        animation="zoomIn"
        duration={1000}
        delay={400}
      >
        <View className="flex-row items-center mb-3">
          <Animatable.View animation="bounceIn" duration={800}>
            <Ionicons
              name="trophy-outline"
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
              Progress
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
          {completedCount}/{totalCount} Todos Completed ({Math.round(percentage)}%)
        </Animatable.Text>
        <View
          className={`h-4 rounded-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-300/50'
          } shadow-md`}
        >
          <Animatable.View
            animation="slideInLeft"
            duration={1000}
            easing="ease-out"
          >
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['#60A5FA', '#34D399']
                  : ['#2563EB', '#10B981']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-full rounded-lg"
              style={{ width: `${percentage}%` }}
            />
          </Animatable.View>
        </View>
      </Animatable.View>
    </View>
  );
};

export default ProgressBar;