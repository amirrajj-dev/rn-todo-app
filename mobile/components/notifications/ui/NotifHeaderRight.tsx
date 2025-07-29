import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useNotfications } from "@/queries/useNotifications" 
import { useTheme } from '@/store/theme.store';

const NotifHeaderRight = () => {
  const { data: notifications } = useNotfications();
  const { theme } = useTheme();
  const notificationCount = notifications?.length || 0;

  return (
    <View className="relative mr-4">
      <TouchableOpacity>
        <Animatable.View animation="bounceIn" duration={800}>
          <Ionicons
            name="notifications"
            size={28}
            color={theme === 'dark' ? '#60A5FA' : '#2563EB'}
          />
        </Animatable.View>
      </TouchableOpacity>
      {notificationCount > 0 && (
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          duration={2000}
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-xl border ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
          } flex items-center justify-center`}
        >
          <Animatable.Text
            animation="fadeIn"
            duration={600}
            className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </Animatable.Text>
        </Animatable.View>
      )}
    </View>
  );
};

export default NotifHeaderRight;