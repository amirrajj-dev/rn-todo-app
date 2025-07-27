import { View, Text, TouchableOpacity } from 'react-native';
import React, { useMemo, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/theme.store';
import { motivationalQuotes } from '@/helpers/helpers';

const MotivationalQuote = () => {
  const { theme } = useTheme();
  const [quoteIndex, setQuoteIndex] = useState(
    Math.floor(Math.random() * motivationalQuotes.length)
  );

  const motivationalQuote = useMemo(() => {
    return motivationalQuotes[quoteIndex];
  }, [quoteIndex]);

  const handleNewQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (newIndex === quoteIndex);
    setQuoteIndex(newIndex);
  };

  return (
    <View className="mb-4 relative">
      <Animatable.View
        className={`w-full p-5 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
        } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="mb-3">
          <Animatable.View className='absolute' animation="bounceIn" duration={800}>
            <Ionicons
              name="sparkles-outline"
              size={24}
              color={theme === 'dark' ? '#FBBF24' : '#D97706'}
            />
          </Animatable.View>
          <Text
            className={`text-xl font-bold ml-2 flex-1 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            Daily Motivation
          </Text>
        </View>
        <Text
          className={`text-base italic text-center mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
          }`}
        >
          "{motivationalQuote}"
        </Text>
        <TouchableOpacity
          className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
          } mx-auto`}
          onPress={handleNewQuote}
        >
          <Animatable.Text
            className="text-base font-semibold text-white"
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
          >
            New Quote
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default MotivationalQuote;