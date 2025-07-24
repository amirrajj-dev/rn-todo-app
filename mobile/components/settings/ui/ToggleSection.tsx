import { View, Text, Switch } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/theme.store';

interface ToggleSectionProps {
  title: string;
  icon: 'notifications' | 'moon' | 'sunny';
  value: boolean;
  onValueChange: (value: boolean) => void;
  isDisabled?: boolean;
  animationDelay: number;
}

const ToggleSection = ({ title, icon, value, onValueChange, isDisabled, animationDelay }: ToggleSectionProps) => {
  const { theme } = useTheme();

  return (
    <Animatable.View
      className={`p-4 rounded-xl mb-4 flex-row justify-between items-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
      animation="fadeIn"
      duration={animationDelay}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          size={24}
          color={theme === 'dark' ? '#3B82F6' : '#2563EB'}
          style={{ marginRight: 12 }}
        />
        <Text
          className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
        >
          {title}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#9CA3AF', true: '#2563EB' }}
        thumbColor={theme === 'dark' ? '#FFFFFF' : '#F3F4F6'}
        disabled={isDisabled}
      />
    </Animatable.View>
  );
};

export default ToggleSection;